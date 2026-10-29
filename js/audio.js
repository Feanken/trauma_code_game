(function () {
  'use strict';

  const app = window.TraumaQuiz;
  const CONFIG = { introMusic: 'assets/audio/intro-trauma.mp3', resultMusic: 'assets/audio/here-we-go.mp3', effects: {
    start: 'assets/audio/start.mp3', select: 'assets/audio/select.mp3',
    back: 'assets/audio/back.mp3', reveal: 'assets/audio/reveal.mp3'
  } };
  const state = { musicEnabled: true, effectsEnabled: true, musicVolume: 0.12,
    effectsVolume: 0.45, playbackState: 'idle' };
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
  let musicScene = 'landing';

  function musicUrl() {
    return musicScene === 'result' ? CONFIG.resultMusic : CONFIG.introMusic;
  }

  function renderControls() {
    if (!controls) return;
    controls.music.textContent = `Musik: ${state.musicEnabled ? 'Aktif' : 'Mati'}`;
    controls.effects.textContent = `Efek: ${state.effectsEnabled ? 'Aktif' : 'Mati'}`;
    controls.music.setAttribute('aria-pressed', String(state.musicEnabled));
    controls.effects.setAttribute('aria-pressed', String(state.effectsEnabled));
    controls.musicOutput.textContent = `${Math.round(state.musicVolume * 100)}%`;
    controls.effectsOutput.textContent = `${Math.round(state.effectsVolume * 100)}%`;
    controls.track.textContent = `Lagu: ${musicScene === 'result' ? 'Here We Go! — Adam Gibbons' : 'Breathe Again — Celestial Scribbles'}`;
    const messages = { idle: 'Musik dimulai saat kuis dimulai.', loading: 'Musik sedang dimuat.',
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
    context.addEventListener('statechange', renderControls);
    applyGain();
    return true;
  }

  function loadEffects() {
    if (loadPromise || !context || !state.effectsEnabled) return;
    // Same two-note chime as option 04 in the listening preview.
    const click = context.createBuffer(1, Math.ceil(0.25 * context.sampleRate), context.sampleRate);
    const clickSamples = click.getChannelData(0);
    let peak = 0;
    for (let i = 0; i < clickSamples.length; i += 1) {
      const t = i / context.sampleRate;
      let value = 0;
      for (const [frequency, offset] of [[660, 0], [990, 0.045]]) {
        const elapsed = t - offset;
        if (elapsed < 0) continue;
        value += (Math.sin(2 * Math.PI * frequency * elapsed)
          + 0.12 * Math.sin(4 * Math.PI * frequency * elapsed))
          * Math.min(1, elapsed / 0.003) * Math.exp(-elapsed / 0.045) * 0.65;
      }
      clickSamples[i] = value * Math.min(1, (0.25 - t) / 0.008);
      peak = Math.max(peak, Math.abs(clickSamples[i]));
    }
    for (let i = 0; i < clickSamples.length; i += 1) clickSamples[i] *= 0.65 / peak;
    // Build short, distinct chimes synchronously so the very first click is audible.
    const sounds = { start: [523.25, 783.99], select: [880, 1174.66], back: [659.25, 440], reveal: [523.25, 659.25, 783.99, 1046.5] };
    for (const [name, notes] of Object.entries(sounds)) {
      if (name !== 'reveal') { buffers.set(name, click); continue; }
      const spacing = name === 'reveal' ? 0.11 : 0.045;
      const tail = name === 'reveal' ? 0.5 : 0.16;
      const buffer = context.createBuffer(1, Math.ceil((notes.length * spacing + tail) * context.sampleRate), context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let n = 0; n < notes.length; n += 1) {
        const offset = Math.round(n * spacing * context.sampleRate);
        for (let i = offset; i < samples.length; i += 1) {
          const t = (i - offset) / context.sampleRate;
          const envelope = Math.min(1, t / 0.004) * Math.exp(-t / (tail / 4));
          samples[i] += (Math.sin(2 * Math.PI * notes[n] * t) + 0.18 * Math.sin(4 * Math.PI * notes[n] * t)) * envelope * 0.44;
        }
      }
      buffers.set(name, buffer);
    }
    loadPromise = Promise.resolve();
    renderControls();
  }

  function startMusic() {
    if (!state.musicEnabled || !foreground || document.hidden) return;
    const version = ++musicVersion;
    needsResume = false;
    if (!music.src) music.src = musicUrl();
    if (music.error) music.load();
    state.playbackState = 'loading';
    renderControls();
    // Playback stays nonblocking, including a browser-controlled autoplay attempt.
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

  function setScene(scene) {
    if (scene === musicScene) return;
    const previousUrl = musicUrl();
    musicScene = scene;
    if (previousUrl === musicUrl()) { renderControls(); return; }
    if (!music) return;
    const shouldPlay = state.musicEnabled && foreground && !document.hidden && !needsResume;
    musicVersion += 1;
    music.pause();
    music.src = musicUrl();
    if (shouldPlay) startMusic();
  }

  function prepareFromGesture({ startMusic: shouldStartMusic = false } = {}) {
    if (document.hidden || (!state.musicEnabled && !state.effectsEnabled)) return;
    const resumeMusic = shouldStartMusic || (unlocked && needsResume);
    foreground = true;
    unlocked = true;
    try {
      if (!createEngine()) return;
      if (resumeMusic) startMusic();
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
    const menu = document.getElementById('sound-menu');
    document.addEventListener('click', (event) => { if (!menu.contains(event.target)) menu.open = false; });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
    });
    controls = { music: document.getElementById('music-toggle'), effects: document.getElementById('effects-toggle'),
      musicOutput: document.getElementById('music-volume-value'), effectsOutput: document.getElementById('effects-volume-value'),
      status: document.getElementById('music-status'), effectsStatus: document.getElementById('effects-status'), track: document.getElementById('music-track') };
    controls.music.addEventListener('click', (event) => {
      if (event.detail > 1) return;
      setMusicEnabled(!state.musicEnabled);
      if (state.musicEnabled && unlocked) prepareFromGesture({ startMusic: true });
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
    // Music starts from the accepted quiz-start gesture, not on page load.
  }

  function getState() {
    return { ...state, needsResume, effectsReady: buffers.size,
      activeEffects: voice ? 1 : 0, contextState: context ? context.state : 'not-created',
      currentTime: music ? music.currentTime : 0, musicPaused: music ? music.paused : true };
  }

  app.audio = { initialize, prepareFromGesture, playEffect, setMusicEnabled, setEffectsEnabled,
    setVolume, pause, resetEffects, getState, setScene };
})();
