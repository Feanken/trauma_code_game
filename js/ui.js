(function () {
  'use strict';

  const app = window.TraumaQuiz;

  function showInitializationError(message) {
    const landingScreen = document.getElementById('landing-screen');
    let errorMessage = document.getElementById('initialization-error');

    if (!errorMessage) {
      errorMessage = document.createElement('p');
      errorMessage.id = 'initialization-error';
      errorMessage.setAttribute('role', 'alert');
      landingScreen.append(errorMessage);
    }

    errorMessage.textContent = message;
  }

  const landing = document.getElementById('landing-screen');
  const quiz = document.getElementById('quiz-screen');
  const result = document.getElementById('result-screen');
  const letter = document.getElementById('letter-screen');
  const title = document.getElementById('question-title');
  const options = document.getElementById('answer-options');

  function showScreen(name) {
    resetPointerEffects();
    landing.hidden = name !== 'landing';
    quiz.hidden = name !== 'quiz';
    result.hidden = name !== 'result';
    letter.hidden = name !== 'letter';
    const screen = { landing, quiz, result, letter }[name];
    screen.classList.remove('screen-enter');
    void screen.offsetWidth;
    screen.classList.add('screen-enter');
  }

  function renderQuestion(data, state, focusHeading) {
    const question = data.questions[state.currentIndex];
    const number = state.currentIndex + 1;
    quiz.dataset.question = String(number);
    quiz.classList.remove('question-enter');
    // Restart the entry animation even when Back renders inside the same screen.
    void quiz.offsetWidth;
    quiz.classList.add('question-enter');
    document.getElementById('question-emblem').textContent = ['✚', '♡', '✧', '◎', '⚕', '↗', '✿', '☀', '⚡', '✉'][state.currentIndex];
    document.getElementById('progress-text').textContent = `Pertanyaan ${number}/10`;
    const progress = document.getElementById('question-progress');
    progress.value = number;
    progress.setAttribute('aria-valuetext', `Pertanyaan ${number} dari 10`);
    document.getElementById('question-context').textContent = question.context;
    title.textContent = question.prompt;
    title.setAttribute('aria-label', `Pertanyaan ${number} dari 10. ${question.prompt}`);
    options.replaceChildren();
    question.options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-card motion-surface';
      button.dataset.option = option.id;
      button.dataset.questionIndex = String(state.currentIndex);
      const isSelected = state.answers[state.currentIndex] === option.id;
      button.setAttribute('aria-pressed', String(isSelected));
      const surface = document.createElement('span');
      surface.className = 'control-surface';
      const key = document.createElement('span');
      key.className = 'choice-key';
      key.textContent = option.id;
      const label = document.createElement('span');
      label.textContent = option.label;
      const selected = document.createElement('span');
      selected.className = 'choice-state';
      selected.textContent = '✓ Dipilih';
      selected.hidden = !isSelected;
      surface.append(key, label, selected);
      button.append(surface);
      options.append(button);
    });
    document.getElementById('back-button').hidden = state.currentIndex === 0;
    showScreen('quiz');
    quiz.classList.remove('is-leaving');
    if (focusHeading) title.focus();
  }

  function markSelection(optionId) {
    options.querySelectorAll('button').forEach((button) => {
      const selected = button.dataset.option === optionId;
      button.setAttribute('aria-pressed', String(selected));
      button.querySelector('.choice-state').hidden = !selected;
    });
  }

  const photo = document.getElementById('result-photo');
  const initials = document.getElementById('result-initials');
  let photoRequestVersion = 0;

  function fillList(id, values) {
    const list = document.getElementById(id);
    list.replaceChildren(...values.map((value) => {
      const item = document.createElement('li');
      item.textContent = value;
      return item;
    }));
  }

  function clearResult() {
    document.querySelector('.result-more').open = !window.matchMedia('(max-width: 767px)').matches;
    photoRequestVersion += 1;
    photo.removeAttribute('src');
    photo.hidden = true;
    initials.textContent = '';
    document.getElementById('result-announced-name').textContent = '';
    document.getElementById('result-card').removeAttribute('data-theme');
    document.getElementById('result-screen').removeAttribute('data-theme');
    result.classList.remove('is-revealing');
    ['result-name', 'result-character-title', 'result-summary', 'result-description',
      'result-message', 'result-motif'].forEach((id) => {
      document.getElementById(id).textContent = '';
    });
    fillList('result-strengths', []);
    fillList('result-reasons', []);
  }

  function renderLetter() {
    letter.dataset.step = '0';
    document.getElementById('open-letter').disabled = false;
    document.getElementById('letter-action').textContent = '01 / Lepaskan segelnya';
    document.getElementById('letter-instruction').textContent = 'Klik amplop untuk melepas segel. Langkah 1 dari 3.';
    showScreen('letter');
    document.getElementById('letter-title').focus();
  }

  function advanceLetter(step) {
    letter.dataset.step = String(step);
    document.getElementById('letter-action').textContent = ['','02 / Buka tutup amplop','03 / Ambil suratmu','Ini dia suratmu…'][step];
    document.getElementById('letter-instruction').textContent = [
      '', 'Segelnya lepas! Klik lagi untuk membuka tutup. Langkah 2 dari 3.',
      'Amplop terbuka. Klik sekali lagi untuk mengambil surat. Langkah 3 dari 3.',
      'Suratmu sedang dikeluarkan.'
    ][step];
  }

  function renderResult(data, outcome) {
    const character = data.characters.find((item) => item.id === outcome.characterId);
    if (!character) throw new TypeError('Karakter hasil tidak dikenal.');
    clearResult();
    const card = document.getElementById('result-card');
    card.dataset.theme = character.id;
    result.dataset.theme = character.id;
    document.getElementById('result-name').textContent = character.name;
    document.getElementById('result-announced-name').textContent = `: ${character.name}`;
    document.getElementById('result-character-title').textContent = character.title;
    document.getElementById('result-summary').textContent = character.summary;
    document.getElementById('result-description').textContent = character.description;
    document.getElementById('result-message').textContent = character.message;
    document.getElementById('result-motif').textContent = character.theme.motif;
    fillList('result-strengths', character.strengths);
    fillList('result-reasons', outcome.reasons);
    initials.textContent = character.name.split(/\s+/).map((word) => word[0]).join('').slice(0, 2);
    if (character.image && character.image.src) {
      const requestVersion = photoRequestVersion;
      photo.onload = () => {
        if (requestVersion === photoRequestVersion) photo.hidden = false;
      };
      photo.onerror = () => {
        if (requestVersion === photoRequestVersion) photo.hidden = true;
      };
      photo.src = character.image.src;
    }
    showScreen('result');
    result.classList.add('is-revealing');
    document.getElementById('result-title').focus();
  }

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const far = document.getElementById('ambient-far');
  const near = document.getElementById('ambient-near');
  let inputMode = 'mouse';
  let pendingFrame = 0;
  let pendingTimer = 0;
  let pointer = null;
  let activeCard = null;
  const litSurfaces = new Set();

  function resetPointerEffects() {
    litSurfaces.forEach((surface) => {
      surface.style.removeProperty('--hover-x');
      surface.style.removeProperty('--hover-y');
    });
    litSurfaces.clear();
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    if (pendingTimer) clearTimeout(pendingTimer);
    pendingFrame = 0;
    pendingTimer = 0;
    pointer = null;
    if (activeCard) {
      activeCard.style.removeProperty('--card-rotate-x');
      activeCard.style.removeProperty('--card-rotate-y');
      activeCard.style.removeProperty('--glow-x');
      activeCard.style.removeProperty('--glow-y');
      activeCard.style.removeProperty('--glow-opacity');
      activeCard = null;
    }
    [far, near].forEach((layer) => {
      layer.style.removeProperty('--ambient-x');
      layer.style.removeProperty('--ambient-y');
    });
  }

  function drawPointer() {
    if (pendingTimer) clearTimeout(pendingTimer);
    pendingFrame = 0;
    pendingTimer = 0;
    if (!pointer || motionPreference.matches || !finePointer.matches || inputMode !== 'mouse') return;
    const { x, y, card } = pointer;
    const surfaces = pointer.surfaces || [];
    litSurfaces.forEach((surface) => {
      if (!surfaces.includes(surface)) {
        surface.style.removeProperty('--hover-x');
        surface.style.removeProperty('--hover-y');
        litSurfaces.delete(surface);
      }
    });
    surfaces.forEach((surface) => {
      const box = surface.getBoundingClientRect();
      surface.style.setProperty('--hover-x', `${Math.max(0, Math.min(100, (x - box.left) / box.width * 100))}%`);
      surface.style.setProperty('--hover-y', `${Math.max(0, Math.min(100, (y - box.top) / box.height * 100))}%`);
      litSurfaces.add(surface);
    });
    const viewportX = Math.max(-1, Math.min(1, x / window.innerWidth * 2 - 1));
    const viewportY = Math.max(-1, Math.min(1, y / window.innerHeight * 2 - 1));
    far.style.setProperty('--ambient-x', `${(viewportX * 6).toFixed(2)}px`);
    far.style.setProperty('--ambient-y', `${(viewportY * 6).toFixed(2)}px`);
    near.style.setProperty('--ambient-x', `${(viewportX * 12).toFixed(2)}px`);
    near.style.setProperty('--ambient-y', `${(viewportY * 12).toFixed(2)}px`);
    if (activeCard && activeCard !== card) {
      activeCard.style.removeProperty('--card-rotate-x');
      activeCard.style.removeProperty('--card-rotate-y');
      activeCard.style.removeProperty('--glow-opacity');
    }
    activeCard = card;
    if (!card) return;
    const bounds = card.parentElement.getBoundingClientRect();
    const normalizedX = Math.max(-1, Math.min(1, (x - bounds.left) / bounds.width * 2 - 1));
    const normalizedY = Math.max(-1, Math.min(1, (y - bounds.top) / bounds.height * 2 - 1));
    card.style.setProperty('--card-rotate-x', `${(-normalizedY * 3).toFixed(2)}deg`);
    card.style.setProperty('--card-rotate-y', `${(normalizedX * 3).toFixed(2)}deg`);
    card.style.setProperty('--glow-x', `${((normalizedX + 1) * 50).toFixed(1)}%`);
    card.style.setProperty('--glow-y', `${((normalizedY + 1) * 50).toFixed(1)}%`);
    card.style.setProperty('--glow-opacity', '1');
  }

  function queuePointer(event) {
    if (event.pointerType !== 'mouse' || motionPreference.matches || !finePointer.matches) return;
    inputMode = 'mouse';
    document.documentElement.dataset.inputMode = 'mouse';
    const activeScreen = !landing.hidden ? landing : !result.hidden ? result : quiz;
    const wrapper = activeScreen.querySelector('.id-card-wrapper');
    pointer = { x: event.clientX, y: event.clientY,
      surfaces: [...new Set([event.target.closest('.motion-surface'), event.target.closest('section.panel')].filter(Boolean))],
      card: wrapper && wrapper.contains(event.target) ? wrapper.querySelector('.id-card') : null };
    if (!pendingFrame) {
      pendingFrame = requestAnimationFrame(drawPointer);
      pendingTimer = setTimeout(() => {
        if (pendingFrame) cancelAnimationFrame(pendingFrame);
        drawPointer();
      }, 34);
    }
  }

  document.addEventListener('pointermove', queuePointer, { passive: true });
  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse') {
      inputMode = 'touch';
      document.documentElement.dataset.inputMode = 'touch';
      resetPointerEffects();
    }
  }, { passive: true });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') {
      inputMode = 'keyboard'; resetPointerEffects();
      document.documentElement.dataset.inputMode = 'keyboard';
    }
  }, true);
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) resetPointerEffects();
    else if (activeCard && !activeCard.parentElement.contains(event.relatedTarget)) {
      activeCard.style.removeProperty('--card-rotate-x');
      activeCard.style.removeProperty('--card-rotate-y');
      activeCard.style.removeProperty('--glow-opacity');
      activeCard = null;
    }
  });
  window.addEventListener('blur', resetPointerEffects);
  window.addEventListener('resize', resetPointerEffects);
  window.addEventListener('scroll', () => {
    if (!activeCard) return;
    const bounds = activeCard.parentElement.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) resetPointerEffects();
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetPointerEffects(); });
  motionPreference.addEventListener('change', resetPointerEffects);
  finePointer.addEventListener('change', resetPointerEffects);

  const mobileLayout = window.matchMedia('(max-width: 767px)');
  document.querySelectorAll('section.panel, .site-header, button, summary, .hero-tags span, .letter-stamp').forEach((element) => element.classList.add('motion-surface'));
  const resultDetails = document.querySelector('.result-more');
  resultDetails.open = !mobileLayout.matches;
  mobileLayout.addEventListener('change', () => { resultDetails.open = !mobileLayout.matches; });

  let castIndex = 0;
  const cast = document.getElementById('landing-card-wrapper');
  const castImage = cast.querySelector('.landing-photo');
  function showCast(offset) {
    castIndex = (castIndex + offset + app.data.characters.length) % app.data.characters.length;
    const character = app.data.characters[castIndex];
    castImage.src = character.image.src;
    castImage.alt = character.name;
    document.getElementById('landing-character-name').textContent = character.name;
    document.getElementById('landing-carousel-position').textContent = `${castIndex + 1} / ${app.data.characters.length}`;
  }
  showCast(0);
  document.getElementById('cast-previous').addEventListener('click', () => showCast(-1));
  document.getElementById('cast-next').addEventListener('click', () => showCast(1));
  let swipeStart = null;
  cast.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' || event.target.closest('button')) return;
    swipeStart = { x: event.clientX, y: event.clientY };
  });
  cast.addEventListener('pointerup', (event) => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) showCast(dx < 0 ? 1 : -1);
  });
  cast.addEventListener('pointercancel', () => { swipeStart = null; });

  // Repeat identical photo groups so the diagonal wallpaper loops without a jump.
  const wall = document.getElementById('character-wall-grid');
  if (wall) {
    const characters = [...app.data.characters,
      { image: { src: 'assets/images/moments/corridor-surprise.jpg' } },
      { image: { src: 'assets/images/moments/playful-team.jpg' } },
      { image: { src: 'assets/images/moments/court-duo.jpg' } },
      { image: { src: 'assets/images/moments/scrub-room-banter.jpg' } },
      { image: { src: 'assets/images/moments/helicopter-duo.jpg' } },
      { image: { src: 'assets/images/moments/jang-mi-smile.jpg' } },
      { image: { src: 'assets/images/moments/hospital-partners.jpg' } },
      { image: { src: 'assets/images/moments/night-rescue.jpg' } },
      { image: { src: 'assets/images/moments/baek-on-call.jpg' } },
      { image: { src: 'assets/images/moments/rescue-team.jpg' } },
      { image: { src: 'assets/images/moments/jang-mi-on-duty.jpg' } },
      { image: { src: 'assets/images/moments/gyeong-won-focus.jpg' } }
    ];
    const fragment = document.createDocumentFragment();
    for (let column = 0; column < 8; column += 1) {
      const lane = document.createElement('div');
      lane.className = 'wall-lane';
      const track = document.createElement('div');
      track.className = 'wall-track';
      track.style.setProperty('--wall-duration', `${95 + (column % 3) * 13}s`);
      track.style.setProperty('--wall-delay', `${-column * 11}s`);
      const group = document.createElement('div');
      group.className = 'wall-group';
      Array.from({ length: characters.length }).forEach((_, index) => {
        const character = characters[(index + column * 2) % characters.length];
        if (!character.image || !character.image.src) return;
        const tile = document.createElement('div');
        tile.className = 'wall-tile';
        const image = document.createElement('img');
        image.src = character.image.src;
        image.alt = '';
        image.decoding = 'async';
        image.addEventListener('error', () => { if (image.dataset.fallback) return; image.dataset.fallback = 'true'; image.src = app.data.characters[index % app.data.characters.length].image.src; }, { once: true });
        image.width = 240;
        image.height = 270;
        tile.append(image);
        group.append(tile);
      });
      track.append(group, group.cloneNode(true));
      lane.append(track);
      fragment.append(lane);
    }
    wall.append(fragment);
    document.addEventListener('visibilitychange', () => {
      wall.classList.toggle('is-paused', document.hidden);
    });
  }

  app.ui = { showInitializationError, showScreen, renderQuestion, markSelection, renderResult, renderLetter, advanceLetter,
    clearResult, resetPointerEffects };
})();
