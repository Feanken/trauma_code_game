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
  const title = document.getElementById('question-title');
  const options = document.getElementById('answer-options');

  function showScreen(name) {
    landing.hidden = name !== 'landing';
    quiz.hidden = name !== 'quiz';
    result.hidden = name !== 'result';
  }

  function renderQuestion(data, state, focusHeading) {
    const question = data.questions[state.currentIndex];
    const number = state.currentIndex + 1;
    document.getElementById('progress-text').textContent = `Pertanyaan ${number}/10`;
    const progress = document.getElementById('question-progress');
    progress.value = number;
    progress.setAttribute('aria-valuetext', `Pertanyaan ${number} dari 10`);
    document.getElementById('question-context').textContent = question.context;
    title.textContent = `Pertanyaan ${number}/10. ${question.prompt}`;
    options.replaceChildren();
    question.options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-card';
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
    photoRequestVersion += 1;
    photo.removeAttribute('src');
    photo.hidden = true;
    initials.textContent = '';
    document.getElementById('result-card').removeAttribute('data-theme');
    document.getElementById('result-screen').removeAttribute('data-theme');
    ['result-name', 'result-character-title', 'result-summary', 'result-description',
      'result-message', 'result-motif'].forEach((id) => {
      document.getElementById(id).textContent = '';
    });
    fillList('result-strengths', []);
    fillList('result-reasons', []);
  }

  function renderResult(data, outcome) {
    const character = data.characters.find((item) => item.id === outcome.characterId);
    if (!character) throw new TypeError('Karakter hasil tidak dikenal.');
    clearResult();
    const card = document.getElementById('result-card');
    card.dataset.theme = character.id;
    result.dataset.theme = character.id;
    document.getElementById('result-name').textContent = character.name;
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
    document.getElementById('result-title').focus();
  }

  app.ui = { showInitializationError, showScreen, renderQuestion, markSelection, renderResult, clearResult };
})();
