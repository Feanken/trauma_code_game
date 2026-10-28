(function () {
  'use strict';
  const frame = document.getElementById('app-frame');
  const report = [];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  function check(condition, label) { report.push({ label, passed: Boolean(condition) }); if (!condition) throw new Error(label); }
  frame.addEventListener('load', async () => {
    try {
      const page = frame.contentDocument;
      const app = frame.contentWindow.TraumaQuiz;
      const examples = [
        ['AAAAAAAAAA', 'B'], ['AAAAABAAAA', 'Y'], ['AAAAAAAABA', 'C'],
        ['AAAAAAABAA', 'P'], ['AAAAAAAAAB', 'H']
      ];
      for (let run = 0; run < examples.length; run += 1) {
        if (run === 0) page.getElementById('start-quiz').click();
        else page.getElementById('restart-quiz').click();
        check(page.getElementById('question-title') === page.activeElement, `fokus awal ${run}`);
        check(page.getElementById('result-screen').hidden && page.getElementById('question-progress').value === 1, `reset awal ${run}`);
        const [pattern, id] = examples[run];
        for (let index = 0; index < 10; index += 1) {
          const option = pattern[index];
          const button = page.querySelector(`#answer-options button[data-option="${option}"]`);
          check(Boolean(button), `opsi ${run}/${index}`);
          button.click();
          await wait(205);
        }
        const character = app.data.characters.find((entry) => entry.id === id);
        const expected = app.quiz.calculateResult(app.data, [...pattern]);
        check(!page.getElementById('result-screen').hidden, `hasil terlihat ${id}`);
        check(page.getElementById('result-card').dataset.theme === id, `tema ${id}`);
        check(page.getElementById('result-name').textContent === character.name, `nama ${id}`);
        check(page.getElementById('result-character-title').textContent === character.title, `gelar ${id}`);
        check(page.getElementById('result-description').textContent === character.description, `deskripsi ${id}`);
        check(page.querySelectorAll('#result-strengths li').length === 3, `kekuatan ${id}`);
        check([...page.querySelectorAll('#result-reasons li')].map((node) => node.textContent).join('|') === expected.reasons.join('|'), `alasan ${id}`);
        check(page.getElementById('result-photo').naturalWidth === 720 && !page.getElementById('result-photo').hidden, `foto lokal ${id}`);
        check(page.getElementById('result-title') === page.activeElement, `fokus hasil ${id}`);
      }
      page.getElementById('restart-quiz').click();
      check(!page.getElementById('result-card').hasAttribute('data-theme'), 'tema lama bersih');
      check(page.getElementById('result-name').textContent === '' && page.getElementById('result-initials').textContent === '', 'isi lama bersih');
      check([...page.querySelectorAll('#answer-options button')].every((button) => button.getAttribute('aria-pressed') === 'false'), 'jawaban lama bersih');
      check(page.getElementById('question-title') === page.activeElement, 'fokus setelah ulang');
    } catch (error) { report.push({ label: error.message, passed: false }); }
    const passed = report.every((item) => item.passed);
    document.getElementById('report').textContent = JSON.stringify({ passed, count: report.length, results: report });
    document.documentElement.dataset.checkStatus = passed ? 'passed' : 'failed';
  }, { once: true });
})();