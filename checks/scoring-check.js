(function () {
  'use strict';

  // Acuan desain 5.3, bukan implementasi skor alternatif.
  const EXPECTED_COUNTS = { B: 240, Y: 204, C: 196, P: 192, H: 192 };
  const COMBINATION_COUNT = 1024;
  const EXPECTED_PRIMARY_TIES = 424;
  const tests = [];
  const distribution = { B: 0, Y: 0, C: 0, P: 0, H: 0 };
  let completed = 0;
  let primaryTies = 0;

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function test(name, run) {
    try {
      run();
      tests.push({ name, passed: true });
    } catch (error) {
      tests.push({ name, passed: false, error: error.message });
    }
  }

  function freeze(value) {
    if (value && typeof value === 'object') {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  }

  test('Validasi struktur dan enumerasi seluruh kombinasi', () => {
    const app = window.TraumaQuiz;
    assert(app && app.quiz.validateData(app.data).isValid, 'Data produksi tidak valid.');
    const data = freeze(JSON.parse(JSON.stringify(app.data)));

    for (let number = 0; number < COMBINATION_COUNT; number += 1) {
      const answers = Object.freeze(number.toString(2).padStart(10, '0').split('')
        .map((bit) => bit === '0' ? 'A' : 'B'));
      const pattern = answers.join('');
      const result = app.quiz.calculateResult(data, answers);
      const repeat = app.quiz.calculateResult(data, answers);
      const ids = Object.keys(result.scores);

      assert(Object.hasOwn(EXPECTED_COUNTS, result.characterId), `${pattern}: karakter tidak valid.`);
      assert(ids.length === 5 && ids.every((id) => Object.hasOwn(EXPECTED_COUNTS, id)), `${pattern}: ID skor tidak valid.`);
      assert(Object.values(result.scores).every((score) => Number.isInteger(score)
        && score >= 0 && score <= 8 && score % 2 === 0), `${pattern}: nilai skor tidak valid.`);
      assert(Object.values(result.scores).reduce((sum, score) => sum + score, 0) === 20, `${pattern}: total skor bukan 20.`);
      assert(JSON.stringify(result) === JSON.stringify(repeat), `${pattern}: hasil tidak deterministik.`);

      const highest = Math.max(...Object.values(result.scores));
      assert(result.scores[result.characterId] === highest, `${pattern}: pemenang bukan kandidat tertinggi.`);
      if (ids.filter((id) => result.scores[id] === highest).length > 1) primaryTies += 1;

      const expectedReasons = data.questions.flatMap((question, index) => {
        const selected = question.options.find((option) => option.id === answers[index]);
        return selected.characterId === result.characterId ? [selected.reason] : [];
      }).slice(0, 2);
      assert(expectedReasons.length === 2 && JSON.stringify(result.reasons) === JSON.stringify(expectedReasons),
        `${pattern}: dua alasan tidak berasal dari pilihan pendukung paling awal.`);

      distribution[result.characterId] += 1;
      completed += 1;
    }
  });

  test('Distribusi dan seri sesuai desain; semua karakter terjangkau', () => {
    assert(completed === COMBINATION_COUNT, 'Enumerasi belum lengkap.');
    assert(primaryTies === EXPECTED_PRIMARY_TIES, `Jumlah seri primer ${primaryTies}, seharusnya 424.`);
    for (const [id, expected] of Object.entries(EXPECTED_COUNTS)) {
      const actual = distribution[id];
      assert(actual === expected, `Jumlah ${id}: ${actual}, seharusnya ${expected}.`);
      const percentage = actual / COMBINATION_COUNT * 100;
      assert(percentage >= 15 && percentage <= 25, `Proporsi ${id} di luar 15–25%.`);
    }
  });

  const examples = [
    ['Contoh B dan seri lima kandidat', 'AAAAAAAAAA', 'B'],
    ['Contoh Y', 'AAAAABAAAA', 'Y'],
    ['Contoh C', 'AAAAAAAABA', 'C'],
    ['Contoh P', 'AAAAAAABAA', 'P'],
    ['Contoh H', 'AAAAAAAAAB', 'H'],
    ['Seri dua kandidat: pembanding mengalahkan prioritas C', 'AAAABAAAAB', 'H'],
    ['Seri siklus tiga kandidat: fallback tetap', 'AAABBBBAAB', 'B']
  ];
  for (const [name, pattern, expected] of examples) {
    test(name, () => {
      const app = window.TraumaQuiz;
      const result = app.quiz.calculateResult(app.data, pattern.split(''));
      assert(result.characterId === expected, 'Pemenang fixture salah.');
      if (pattern === 'AAAAAAAAAA') {
        assert(Object.values(result.scores).every((score) => score === 4), 'Semua A harus memberi lima skor 4.');
      }
    });
  }

  test('Mengubah satu jawaban menghitung ulang dan tidak menggandakan skor', () => {
    const app = window.TraumaQuiz;
    const answers = Array(10).fill('A');
    const original = app.quiz.calculateResult(app.data, answers);
    answers[9] = 'B';
    const changed = app.quiz.calculateResult(app.data, answers);
    assert(changed.characterId === 'H' && changed.scores.H === 6 && changed.scores.P === 2, 'Revisi Q10 salah.');
    assert(original.scores.H === 4, 'Hasil lama dimutasi.');
    answers[9] = 'A';
    assert(JSON.stringify(app.quiz.calculateResult(app.data, answers)) === JSON.stringify(original), 'Koreksi balik salah.');
  });

  const invalidCases = [
    ['kosong', []], ['tidak lengkap', Array(9).fill('A')],
    ['slot kosong', Array(10)], ['opsi tidak dikenal', [...Array(9).fill('A'), 'X']]
  ];
  for (const [name, answers] of invalidCases) {
    test(`Tolak input ${name}`, () => {
      const app = window.TraumaQuiz;
      assert(!app.quiz.validateAnswers(answers).isValid, 'Validator menerima input rusak.');
      let rejected = false;
      try {
        app.quiz.calculateResult(app.data, answers);
      } catch (error) {
        rejected = error instanceof TypeError;
      }
      assert(rejected, 'Perhitungan menghasilkan hasil dari input rusak.');
    });
  }

  const passed = tests.every((item) => item.passed);
  const report = { passed, total: tests.length, completed, primaryTies, distribution, tests };
  document.getElementById('check-summary').textContent = `${passed ? 'LULUS' : 'GAGAL'}: ${completed}/1024 kombinasi; seri primer ${primaryTies}.`;
  const tableBody = document.getElementById('distribution-body');
  for (const [id, expected] of Object.entries(EXPECTED_COUNTS)) {
    const row = document.createElement('tr');
    for (const value of [id, distribution[id], expected, `${(distribution[id] / COMBINATION_COUNT * 100).toFixed(2)}%`]) {
      const cell = document.createElement('td');
      cell.textContent = String(value);
      row.append(cell);
    }
    tableBody.append(row);
  }
  document.getElementById('check-report').textContent = JSON.stringify(report, null, 2);
  document.documentElement.dataset.checkStatus = passed ? 'passed' : 'failed';
})();
