(function () {
  'use strict';

  const app = window.TraumaQuiz;
  const tests = [];
  const fixtures = [];

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

  const cases = [
    ['Baek sesuai desain', 'AAAAAAAAAA', 'B', ['Q01', 'Q03']],
    ['Yang sesuai desain', 'AAAAABAAAA', 'Y', ['Q05', 'Q06']],
    ['Cheon sesuai desain', 'AAAAAAAABA', 'C', ['Q02', 'Q08']],
    ['Park sesuai desain', 'AAAAAAABAA', 'P', ['Q06', 'Q08']],
    ['Han sesuai desain', 'AAAAAAAAAB', 'H', ['Q04', 'Q09']],
    ['Seri dua kandidat', 'AAAAABAAAB', 'Y', ['Q05', 'Q06']],
    ['Pembanding mengalahkan prioritas C sebelum H', 'AAAABAAAAB', 'H', ['Q04', 'Q09']],
    ['Seri siklus tiga kandidat', 'AAABBBBAAB', 'B', ['Q01', 'Q03']]
  ];

  for (const [name, pattern, winner, questionIds] of cases) {
    test(name, () => {
      const answers = pattern.split('');
      const result = app.quiz.calculateResult(app.data, answers);
      assert(result.characterId === winner, 'Karakter salah.');
      assert(Object.values(result.scores).reduce((sum, score) => sum + score, 0) === 20, 'Jumlah skor salah.');
      const expectedReasons = questionIds.map((id) => {
        const index = app.data.questions.findIndex((question) => question.id === id);
        return app.data.questions[index].options.find((option) => option.id === answers[index]).reason;
      });
      assert(result.reasons.length === 2, 'Jumlah alasan salah.');
      assert(JSON.stringify(result.reasons) === JSON.stringify(expectedReasons), 'Alasan/urutan salah.');
      assert(JSON.stringify(result) === JSON.stringify(app.quiz.calculateResult(app.data, answers)), 'Tidak deterministik.');
      fixtures.push({ name, pattern, result });
    });
  }

  test('Semua A: lima skor 4 dan fallback B', () => {
    const result = app.quiz.calculateResult(app.data, Array(10).fill('A'));
    assert(result.characterId === 'B' && Object.values(result.scores).every((score) => score === 4), 'Seri lima salah.');
  });

  test('Koreksi jawaban tanpa akumulasi skor', () => {
    const answers = Array(10).fill('A');
    const oldResult = app.quiz.calculateResult(app.data, answers);
    answers[9] = 'B';
    const updated = app.quiz.calculateResult(app.data, answers);
    assert(JSON.stringify(updated.scores) === JSON.stringify({ B: 4, Y: 4, C: 4, P: 2, H: 6 }), 'Revisi skor salah.');
    assert(updated.characterId === 'H' && oldResult.scores.H === 4, 'Hasil lama berubah.');
    answers[9] = 'A';
    assert(JSON.stringify(app.quiz.calculateResult(app.data, answers)) === JSON.stringify(oldResult), 'Koreksi balik salah.');
  });

  test('Input dibekukan tidak dimutasi', () => {
    const data = freeze(JSON.parse(JSON.stringify(app.data)));
    const answers = freeze(Array(10).fill('A'));
    const before = JSON.stringify({ data, answers });
    app.quiz.calculateResult(data, answers);
    assert(JSON.stringify({ data, answers }) === before, 'Input berubah.');
  });

  test('Output tidak berbagi state antar pemanggilan', () => {
    const answers = Array(10).fill('A');
    const first = app.quiz.calculateResult(app.data, answers);
    first.scores.B = 999;
    first.reasons.length = 0;
    const next = app.quiz.calculateResult(app.data, answers);
    assert(next.scores.B === 4 && next.reasons.length === 2, 'State bocor.');
  });

  test('Fallback tidak bergantung pada urutan array karakter', () => {
    const data = JSON.parse(JSON.stringify(app.data));
    data.characters.reverse();
    assert(app.quiz.calculateResult(data, Array(10).fill('A')).characterId === 'B', 'Urutan fallback salah.');
  });

  const invalidAnswers = [
    ['undefined', undefined], ['null', null], ['string', 'AAAAAAAAAA'], ['objek', {}],
    ['kosong', []], ['sembilan', Array(9).fill('A')], ['sebelas', Array(11).fill('A')],
    ['slot kosong', Array(10)], ['null dalam jawaban', [...Array(9).fill('A'), null]],
    ['opsi X', [...Array(9).fill('A'), 'X']], ['huruf kecil', [...Array(9).fill('A'), 'a']],
    ['angka', [...Array(9).fill('A'), 0]], ['spasi', [...Array(9).fill('A'), ' A']]
  ];
  for (const [name, answers] of invalidAnswers) {
    test(`Tolak jawaban ${name}`, () => {
      assert(!app.quiz.validateAnswers(answers).isValid, 'Validator menerima input rusak.');
      let rejected = false;
      try {
        app.quiz.calculateResult(app.data, answers);
      } catch (error) {
        rejected = error instanceof TypeError;
      }
      assert(rejected, 'Perhitungan tidak menolak input rusak.');
    });
  }

  test('Data rusak tidak menghasilkan karakter asal', () => {
    const data = JSON.parse(JSON.stringify(app.data));
    data.questions[0].options[0].points = 100;
    let rejected = false;
    try {
      app.quiz.calculateResult(data, Array(10).fill('A'));
    } catch (error) {
      rejected = error instanceof TypeError;
    }
    assert(rejected, 'Data rusak diterima.');
  });

  test('Jawaban valid diterima', () => {
    assert(app.quiz.validateAnswers('ABABABABAB'.split('')).isValid, 'Jawaban valid ditolak.');
  });

  const report = { passed: tests.every((item) => item.passed), total: tests.length, tests, fixtures };
  document.getElementById('check-report').textContent = JSON.stringify(report, null, 2);
  document.documentElement.dataset.checkStatus = report.passed ? 'passed' : 'failed';
})();
