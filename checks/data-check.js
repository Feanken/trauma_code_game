(function () {
  'use strict';

  const app = window.TraumaQuiz;
  const results = [];

  function cloneData() {
    return JSON.parse(JSON.stringify(app.data));
  }

  function freezeData(value) {
    if (value !== null && typeof value === 'object') {
      Object.values(value).forEach(freezeData);
      Object.freeze(value);
    }
    return value;
  }

  function check(name, data, expectedValid) {
    const before = JSON.stringify(data);
    try {
      const result = app.quiz.validateData(data);
      const passed = result.isValid === expectedValid
        && Array.isArray(result.errors)
        && (expectedValid ? result.errors.length === 0 : result.errors.length > 0)
        && JSON.stringify(data) === before;
      results.push({ name, passed, errors: result.errors });
    } catch (error) {
      results.push({ name, passed: false, error: error.message });
    }
  }

  function checkInvalid(name, change) {
    const data = cloneData();
    change(data);
    check(name, data, false);
  }

  check('Data desain valid dan tidak dimutasi, termasuk input dibekukan', freezeData(cloneData()), true);
  check('Tolak root null', null, false);
  check('Tolak root array', [], false);
  check('Tolak root undefined', undefined, false);
  checkInvalid('Tolak pertanyaan hilang', (data) => { delete data.questions; });
  checkInvalid('Tolak sembilan pertanyaan', (data) => { data.questions.pop(); });
  checkInvalid('Tolak sebelas pertanyaan', (data) => { data.questions.push(data.questions[0]); });
  checkInvalid('Tolak slot pertanyaan kosong', (data) => { delete data.questions[0]; });
  checkInvalid('Tolak ID pertanyaan duplikat', (data) => { data.questions[1].id = 'Q01'; });
  checkInvalid('Tolak urutan pertanyaan berubah', (data) => { data.questions.reverse(); });
  checkInvalid('Tolak pertanyaan nonobjek', (data) => { data.questions[0] = []; });
  checkInvalid('Tolak satu pilihan', (data) => { data.questions[0].options.pop(); });
  checkInvalid('Tolak tiga pilihan', (data) => { data.questions[0].options.push(data.questions[0].options[0]); });
  checkInvalid('Tolak pilihan hilang', (data) => { delete data.questions[0].options; });
  checkInvalid('Tolak slot pilihan kosong', (data) => { delete data.questions[0].options[0]; });
  checkInvalid('Tolak dua ID opsi A', (data) => { data.questions[0].options[1].id = 'A'; });
  checkInvalid('Tolak label opsi identik', (data) => {
    data.questions[0].options[1].label = data.questions[0].options[0].label;
  });
  checkInvalid('Tolak karakter pilihan tidak dikenal', (data) => { data.questions[0].options[0].characterId = 'X'; });
  checkInvalid('Tolak pembandingan karakter dengan dirinya', (data) => { data.questions[0].options[0].characterId = 'Y'; });
  checkInvalid('Tolak pasangan karakter duplikat', (data) => {
    data.questions[1].options[0].characterId = 'Y';
    data.questions[1].options[1].characterId = 'B';
  });
  checkInvalid('Tolak ketidakseimbangan sisi A/B meski pasangan tetap unik', (data) => {
    const options = data.questions[0].options;
    const firstId = options[0].characterId;
    options[0].characterId = options[1].characterId;
    options[1].characterId = firstId;
  });
  checkInvalid('Tolak poin berupa string', (data) => { data.questions[0].options[0].points = '2'; });
  checkInvalid('Tolak bobot selain dua', (data) => { data.questions[0].options[0].points = 3; });

  for (const field of ['context', 'prompt']) {
    checkInvalid(`Tolak teks pertanyaan kosong: ${field}`, (data) => { data.questions[0][field] = ' '; });
  }
  for (const field of ['label', 'reason']) {
    checkInvalid(`Tolak teks opsi kosong: ${field}`, (data) => { data.questions[0].options[0][field] = ' '; });
  }
  for (const field of ['name', 'title', 'summary', 'description', 'message']) {
    checkInvalid(`Tolak teks karakter kosong: ${field}`, (data) => { data.characters[0][field] = ' '; });
  }

  checkInvalid('Tolak karakter hilang', (data) => { delete data.characters; });
  checkInvalid('Tolak empat karakter', (data) => { data.characters.pop(); });
  checkInvalid('Tolak slot karakter kosong', (data) => { delete data.characters[0]; });
  checkInvalid('Tolak ID karakter duplikat', (data) => { data.characters[0].id = 'Y'; });
  checkInvalid('Tolak ID karakter tidak dikenal', (data) => { data.characters[0].id = 'X'; });
  checkInvalid('Tolak jumlah kekuatan salah', (data) => { data.characters[0].strengths.pop(); });
  checkInvalid('Tolak kekuatan kosong', (data) => { data.characters[0].strengths[0] = ''; });
  checkInvalid('Tolak slot kekuatan kosong', (data) => { delete data.characters[0].strengths[0]; });
  checkInvalid('Tolak tema hilang', (data) => { delete data.characters[0].theme; });
  checkInvalid('Tolak motif tema kosong', (data) => { data.characters[0].theme.motif = ''; });
  checkInvalid('Tolak warna tema tidak valid', (data) => { data.characters[0].theme.accent = 'red'; });
  checkInvalid('Tolak urutan seri hilang', (data) => { delete data.tieBreakOrder; });
  checkInvalid('Tolak urutan seri berubah', (data) => { data.tieBreakOrder.reverse(); });

  const report = {
    passed: results.every((result) => result.passed),
    total: results.length,
    results,
    data: app.data
  };
  document.getElementById('check-report').textContent = JSON.stringify(report, null, 2);
  document.documentElement.dataset.checkStatus = report.passed ? 'passed' : 'failed';
})();
