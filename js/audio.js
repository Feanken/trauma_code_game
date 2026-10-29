(function () {
  'use strict';

  const app = window.TraumaQuiz;
  const CONFIG = { music: 'assets/audio/bgm.mp3', effects: {
    start: 'assets/audio/start.mp3', select: 'assets/audio/select.mp3',
    back: 'assets/audio/back.mp3', reveal: 'assets/audio/reveal.mp3'
  } };
  const state = { musicEnabled: true, effectsEnabled: true, musicVolume: 0.12,
    effectsVolume: 0.25, playbackState: 'idle' };
  const buffers = new Map();
  const failedEffects = new Set();
  let context = null;
  let music = null;
  let musicGain = null;
  let effectsGain = null;
  let voice = null;
  let loadPromise = null;
  let musicVersion = 0;
  let needsResume = false;
  let foreground = true;
  let unlocked = false;
  let initialized = false;
  let controls = null;

  function renderControls() {
    if (!controls) return;
    controls.music.textContent = state.musicEnabled && needsResume
      ? 'Lanjutkan musik' : `Musik: ${state.musicEnabled ? 'Aktif' : 'Mati'}`;
    controls.effects.textContent = `Efek: ${state.effectsEnabled ? 'Aktif' : 'Mati'}`;
    controls.music.setAttribute('aria-pressed', String(state.musicEnabled));
    controls.effects.setAttribute('aria-pressed', String(state.effectsEnabled));
    controls.musicOutput.textContent = `${Math.round(state.musicVolume * 100)}%`;
    controls.effectsOutput.textContent = `${Math.round(state.effectsVolume * 100)}%`;
    const messages = { idle: 'Musik mulai setelah Start Quiz.', loading: 'Musik sedang dimuat.',
      playing: 'Musik sedang diputar.', paused: 'Musik dijeda.', unavailable: 'Musik belum dapat diputar. Kuis tetap bisa digunakan.' };
    controls.status.textContent = state.musicEnabled ? messages[state.playbackState] : 'Musik dimatikan.';
    controls.effectsStatus.textContent = failedEffects.size ? 'Sebagian efek belum tersedia.' : 'Efek singkat untuk aksi kuis.';
  }

  function applyGain() {
    if (!context) return;
    musicGain.gain.value = state.musicEnabled ? state.musicVolume : 0;
    effectsGain.gain.value = state.effectsEnabled ? state.effectsVolume : 0;
  }

  function resetEffects({ invalidatePendingMusic = false } = {}) {
    if (invalidatePendingMusic) {
      musicVersion += 1;
      if (state.playbackState === 'loading') {
        music.pause();
        state.playbackState = 'paused';
        needsResume = state.musicEnabled;
        renderControls();
      }
    }
    if (!voice) return;
    voice.onended = null;
    voice.stop();
    voice.disconnect();
    voice = null;
  }

  function createEngine() {
    if (context) return true;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) { state.playbackState = 'unavailable'; renderControls(); return false; }
    const engine = new AudioContextClass();
    try {
      const musicNode = engine.createGain();
      const effectsNode = engine.createGain();
      const element = new Audio();
      element.preload = 'none';
      element.loop = true;
      engine.createMediaElementSource(element).connect(musicNode);
      musicNode.connect(engine.destination);
      effectsNode.connect(engine.destination);
      context = engine;
      musicGain = musicNode;
      effectsGain = effectsNode;
      music = element;
    } catch (error) {
      engine.close().catch((closeError) => console.warn('Audio belum dapat ditutup.', closeError));
      throw error;
    }
    music.addEventListener('error', () => {
      music.pause();
      state.playbackState = 'unavailable';
      needsResume = true;
      renderControls();
    });
    applyGain();
    return true;
  }

  function loadEffects() {
    if (loadPromise || !context || !state.effectsEnabled) return;
    loadPromise = Promise.all(Object.entries(CONFIG.effects).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Audio HTTP ${response.status}`);
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        buffers.set(name, buffer);
      } catch (error) {
        failedEffects.add(name);
        console.warn(`Efek ${name} tidak tersedia.`, error);
      }
    })).then(renderControls);
  }

  function startMusic() {
    if (!state.musicEnabled || !foreground || document.hidden) return;
    const version = ++musicVersion;
    needsResume = false;
    if (!music.src) music.src = CONFIG.music;
    if (music.error) music.load();
    state.playbackState = 'loading';
    renderControls();
    // Dipanggil dalam gesture asal; navigasi kuis tidak menunggu Promise ini.
    music.play().then(() => {
      if (version !== musicVersion) return;
      state.playbackState = 'playing';
      renderControls();
    }).catch((error) => {
      if (version !== musicVersion) return;
      music.pause();
      needsResume = true;
      state.playbackState = 'unavailable';
      renderControls();
      console.warn('Musik belum dapat diputar.', error);
    });
  }

  function prepareFromGesture({ startMusic: shouldStartMusic = false } = {}) {
    if (document.hidden || (!state.musicEnabled && !state.effectsEnabled)) return;
    foreground = true;
    unlocked = true;
    try {
      if (!createEngine()) return;
      if (shouldStartMusic) startMusic();
      const version = musicVersion;
      context.resume().catch((error) => {
        if (version !== musicVersion) return;
        musicVersion += 1;
        if (music) music.pause();
        resetEffects();
        state.playbackState = 'unavailable';
        needsResume = true;
        renderControls();
        console.warn('Audio belum dapat diaktifkan.', error);
      });
      loadEffects();
    } catch (error) {
      state.playbackState = 'unavailable';
      renderControls();
      console.warn('Audio tidak tersedia; kuis tetap berjalan.', error);
    }
  }

  function playEffect(name) {
    if (!context || context.state !== 'running' || !foreground || document.hidden
      || !state.effectsEnabled || state.effectsVolume === 0 || !buffers.has(name)) return;
    try {
      resetEffects();
      const source = context.createBufferSource();
      source.buffer = buffers.get(name);
      source.connect(effectsGain);
      voice = source;
      source.onended = () => { source.disconnect(); if (voice === source) voice = null; };
      source.start();
    } catch (error) {
      failedEffects.add(name);
      resetEffects();
      renderControls();
      console.warn(`Efek ${name} belum dapat diputar.`, error);
    }
  }

  function setMusicEnabled(enabled) {
    state.musicEnabled = Boolean(enabled);
    applyGain();
    if (!enabled) {
      musicVersion += 1;
      if (music) music.pause();
      needsResume = false;
      state.playbackState = 'paused';
    }
    renderControls();
  }

  function setEffectsEnabled(enabled) {
    state.effectsEnabled = Boolean(enabled);
    if (!enabled) resetEffects();
    applyGain();
    renderControls();
  }

  function setVolume(channel, percent) {
    const volume = Math.max(0, Math.min(100, Number(percent))) / 100;
    if (!Number.isFinite(volume)) return;
    if (channel === 'music') state.musicVolume = volume;
    else if (channel === 'effects') { state.effectsVolume = volume; if (!volume) resetEffects(); }
    else return;
    applyGain();
    renderControls();
  }

  function pause() {
    foreground = false;
    musicVersion += 1;
    if (music) music.pause();
    resetEffects();
    if (unlocked && state.musicEnabled) {
      needsResume = true;
      state.playbackState = 'paused';
    }
    renderControls();
  }

  function initialize() {
    if (initialized) return;
    initialized = true;
    controls = { music: document.getElementById('music-toggle'), effects: document.getElementById('effects-toggle'),
      musicOutput: document.getElementById('music-volume-value'), effectsOutput: document.getElementById('effects-volume-value'),
      status: document.getElementById('music-status'), effectsStatus: document.getElementById('effects-status') };
    controls.music.addEventListener('click', (event) => {
      if (event.detail > 1) return;
      if (state.musicEnabled && needsResume) prepareFromGesture({ startMusic: true });
      else {
        setMusicEnabled(!state.musicEnabled);
        if (state.musicEnabled) prepareFromGesture({ startMusic: true });
      }
    });
    controls.effects.addEventListener('click', (event) => {
      if (event.detail > 1) return;
      setEffectsEnabled(!state.effectsEnabled);
      if (state.effectsEnabled && unlocked) prepareFromGesture();
    });
    for (const channel of ['music', 'effects']) {
      const slider = document.getElementById(`${channel}-volume`);
      slider.value = String(state[`${channel}Volume`] * 100);
      slider.addEventListener('input', () => setVolume(channel, slider.value));
    }
    window.addEventListener('blur', pause);
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
    document.getElementById('audio-controls').hidden = false;
    renderControls();
  }

  function getState() {
    return { ...state, needsResume, effectsReady: buffers.size,
      activeEffects: voice ? 1 : 0, contextState: context ? context.state : 'not-created',
      currentTime: music ? music.currentTime : 0, musicPaused: music ? music.paused : true };
  }

  app.audio = { initialize, prepareFromGesture, playEffect, setMusicEnabled, setEffectsEnabled,
    setVolume, pause, resetEffects, getState };
})();
