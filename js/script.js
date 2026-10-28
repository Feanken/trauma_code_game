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

  // Penanda internal pemuatan fondasi, bukan penanda kuis siap dimainkan.
  document.documentElement.dataset.foundationReady = 'true';
})();
