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

  // Render kuis, hasil, dan efek visual mengikuti tugas UI berikutnya.
  app.ui = { showInitializationError };
})();
