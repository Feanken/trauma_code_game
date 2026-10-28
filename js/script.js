(function () {
  'use strict';

  const app = window.TraumaQuiz;

  if (!app || !app.data || !app.quiz || !app.ui) {
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
        state.screen = 'result';
        app.ui.renderResult(app.data, state.result);
      }
    }
    state.isTransitioning = false;
  }

  function startQuiz() {
    if (state.screen !== 'landing' && state.screen !== 'result') return;
    if (transitionTimer !== null) clearTimeout(transitionTimer);
    state.sessionVersion += 1;
    state.answers = Array(app.data.questions.length).fill(null);
    state.currentIndex = 0;
    state.result = null;
    state.isTransitioning = false;
    app.ui.clearResult();
    state.screen = 'quiz';
    app.ui.renderQuestion(app.data, state, true);
  }

  function chooseAnswer(button) {
    if (state.screen !== 'quiz' || state.isTransitioning || !button || !options.contains(button)) return;
    const index = state.currentIndex;
    const optionId = button.dataset.option;
    if (button.dataset.questionIndex !== String(index)
      || !app.data.questions[index].options.some((option) => option.id === optionId)) return;
    state.isTransitioning = true;
    state.answers[index] = optionId;
    state.result = null;
    app.ui.markSelection(optionId);
    const version = state.sessionVersion;
    transitionTimer = setTimeout(() => completeQuestion(version, index), 180);
  }

  function goBack() {
    if (state.screen !== 'quiz' || state.isTransitioning || state.currentIndex === 0) return;
    state.currentIndex -= 1;
    app.ui.renderQuestion(app.data, state, true);
  }

  startButton.addEventListener('click', startQuiz);
  document.getElementById('restart-quiz').addEventListener('click', startQuiz);
  options.addEventListener('click', (event) => chooseAnswer(event.target.closest('button[data-option]')));
  backButton.addEventListener('click', goBack);
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
  startButton.hidden = false;
  document.documentElement.dataset.quizReady = 'true';

  // Penanda internal pemuatan fondasi, bukan penanda kuis siap dimainkan.
  document.documentElement.dataset.foundationReady = 'true';
})();
