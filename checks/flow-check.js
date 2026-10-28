(function () {
  'use strict';
  const frame = document.getElementById('app-frame');
  const results = [];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  function check(ok, label) { results.push({ label, passed: Boolean(ok) }); if (!ok) throw new Error(label); }
  function doc() { return frame.contentDocument; }
  function current() { return doc().getElementById('progress-text').textContent; }
  function pick(option) { doc().querySelector(`#answer-options button[data-option="${option}"]`).click(); }
  frame.addEventListener('load', async () => {
    try {
      const page = doc();
      check(!page.getElementById('start-quiz').hidden && !page.getElementById('landing-screen').hidden, 'pembuka siap');
      page.getElementById('start-quiz').click();
      check(current() === 'Pertanyaan 1/10' && page.getElementById('back-button').hidden, 'mulai kosong Q01');
      pick('A'); pick('B');
      check(current() === 'Pertanyaan 1/10', 'klik ganda terkunci');
      await wait(210);
      check(current() === 'Pertanyaan 2/10', 'maju satu');
      page.getElementById('back-button').click();
      check(current() === 'Pertanyaan 1/10' && page.querySelector('[data-option="A"]').getAttribute('aria-pressed') === 'true', 'Back dan pilihan lama');
      pick('B'); await wait(210);
      check(current() === 'Pertanyaan 2/10' && page.querySelector('[data-option="B"]').getAttribute('aria-pressed') === 'false', 'koreksi hanya Q01');
      for (let index = 1; index < 10; index += 1) {
        check(current() === `Pertanyaan ${index + 1}/10`, `progres ${index + 1}`);
        check(page.getElementById('question-progress').value === index + 1, `bilah ${index + 1}`);
        check(page.getElementById('question-title').textContent.includes(frame.contentWindow.TraumaQuiz.data.questions[index].prompt), `teks Q${index + 1}`);
        pick('A'); await wait(210);
      }
      check(!page.getElementById('result-screen').hidden && page.getElementById('quiz-screen').hidden, 'hasil hanya setelah Q10');
      check(page.getElementById('result-title') === page.activeElement, 'fokus hasil');
      frame.src = '../index.html?reload=1';
      await new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }));
      check(!doc().getElementById('landing-screen').hidden && doc().getElementById('quiz-screen').hidden, 'refresh ke pembuka');
    } catch (error) { results.push({ label: 'error', passed: false, message: error.message }); }
    const passed = results.every((entry) => entry.passed);
    document.getElementById('report').textContent = JSON.stringify({ passed, results });
    document.documentElement.dataset.checkStatus = passed ? 'passed' : 'failed';
  }, { once: true });
})();