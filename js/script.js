(function () {
  'use strict';

  const app = window.TraumaQuiz;

  if (!app || !app.data || !app.quiz || !app.ui || !app.audio) {
    throw new Error('Berkas fondasi kuis tidak dimuat secara lengkap.');
  }

  const validation = app.quiz.validateData(app.data);
  if (!validation.isValid) {
    app.ui.showInitializationError('Kuis belum dapat dimulai karena datanya tidak valid. Silakan coba muat ulang halaman.');
    console.error('Data kuis tidak valid:', validation.errors);
    return;
  }

  const state = {
    screen: 'landing', currentIndex: 0,
    answers: Array(app.data.questions.length).fill(null),
    isTransitioning: false, result: null, sessionVersion: 0
  };
  let transitionTimer = null;
  let heldActivation = false;
  let letterStep = 0;
  const letterButton = document.getElementById('open-letter');
  const startButton = document.getElementById('start-quiz');
  const backButton = document.getElementById('back-button');
  const options = document.getElementById('answer-options');

  function firstMissingAnswer() {
    return state.answers.findIndex((answer) => answer !== 'A' && answer !== 'B');
  }

  function completeQuestion(version, index) {
    if (state.sessionVersion !== version || state.screen !== 'quiz' || state.currentIndex !== index) return;
    transitionTimer = null;
    if (index < app.data.questions.length - 1) {
      state.currentIndex = index + 1;
      app.ui.renderQuestion(app.data, state, true);
    } else {
      const missing = firstMissingAnswer();
      if (missing !== -1) {
        state.currentIndex = missing;
        app.ui.renderQuestion(app.data, state, true);
      } else {
        state.result = app.quiz.calculateResult(app.data, state.answers);
        state.screen = 'letter';
        letterStep = 0;
        app.ui.renderLetter();
        app.audio.setScene('result');
        app.audio.playEffect('start');
      }
    }
    state.isTransitioning = false;
  }

  function startQuiz() {
    if (state.screen !== 'landing' && state.screen !== 'result') return;
    const initialStart = state.screen === 'landing';
    app.audio.resetEffects({ invalidatePendingMusic: true });
    app.audio.setScene('quiz');
    app.audio.prepareFromGesture({ startMusic: initialStart });
    if (transitionTimer !== null) clearTimeout(transitionTimer);
    transitionTimer = null;
    state.sessionVersion += 1;
    letterStep = 0;
    state.answers = Array(app.data.questions.length).fill(null);
    state.currentIndex = 0;
    state.result = null;
    state.isTransitioning = false;
    app.ui.clearResult();
    document.getElementById('quiz-screen').classList.remove('is-leaving');
    state.screen = 'quiz';
    app.ui.renderQuestion(app.data, state, true);
    app.audio.playEffect('start');
  }

  function chooseAnswer(button) {
    if (state.screen !== 'quiz' || state.isTransitioning || !button || !options.contains(button)) return;
    const index = state.currentIndex;
    const optionId = button.dataset.option;
    if (button.dataset.questionIndex !== String(index)
      || !app.data.questions[index].options.some((option) => option.id === optionId)) return;
    state.isTransitioning = true;
    app.audio.prepareFromGesture();
    app.audio.playEffect('select');
    state.answers[index] = optionId;
    state.result = null;
    app.ui.markSelection(optionId);
    document.getElementById('quiz-screen').classList.add('is-leaving');
    const version = state.sessionVersion;
    transitionTimer = setTimeout(() => completeQuestion(version, index), 180);
  }

  function goBack() {
    if (state.screen !== 'quiz' || state.isTransitioning || state.currentIndex === 0) return;
    app.audio.prepareFromGesture();
    app.audio.playEffect('back');
    state.currentIndex -= 1;
    app.ui.renderQuestion(app.data, state, true);
  }

  startButton.addEventListener('click', startQuiz);
  document.getElementById('restart-quiz').addEventListener('click', startQuiz);
  options.addEventListener('click', (event) => {
    // Klik kedua dari double-click dapat tiba setelah DOM pertanyaan berganti.
    if (event.detail > 1) return;
    chooseAnswer(event.target.closest('button[data-option]'));
  });
  backButton.addEventListener('click', goBack);
  letterButton.addEventListener('click', (event) => {
    if (event.detail > 1 || state.screen !== 'letter' || state.isTransitioning || letterStep >= 3) return;
    state.isTransitioning = true;
    letterButton.disabled = true;
    letterStep += 1;
    app.audio.prepareFromGesture();
    app.audio.playEffect(letterStep === 1 ? 'back' : 'select');
    app.ui.advanceLetter(letterStep);
    const version = state.sessionVersion;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : letterStep === 3 ? 1100 : 650;
    transitionTimer = setTimeout(() => {
      if (state.sessionVersion !== version || state.screen !== 'letter') return;
      transitionTimer = null;
      state.isTransitioning = false;
      if (letterStep === 3) {
        state.screen = 'result';
        app.ui.renderResult(app.data, state.result);
        app.audio.setScene('result');
        app.audio.playEffect('reveal');
      } else {
        letterButton.disabled = false;
        if (document.activeElement === document.body || document.activeElement === letterButton) {
          letterButton.focus({ preventScroll: true });
        }
      }
    }, duration);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.repeat || heldActivation) {
      event.preventDefault();
      return;
    }
    if (event.target.closest('button')) heldActivation = true;
  }, true);
  document.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === ' ') heldActivation = false;
  }, true);
  window.addEventListener('blur', () => { heldActivation = false; });
  app.audio.initialize();
  startButton.hidden = false;
  document.documentElement.dataset.quizReady = 'true';
  performance.mark('quiz-ready');

  // Penanda internal pemuatan fondasi, bukan penanda kuis siap dimainkan.
  document.documentElement.dataset.foundationReady = 'true';
})();
