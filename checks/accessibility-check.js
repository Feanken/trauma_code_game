(function () {
  'use strict';
  function check(value, label, results) { results.push({ label, passed: Boolean(value) }); }
  function luminance(value) {
    const parts = value.match(/[\d.]+/g).slice(0, 3).map((v) => {
      const c = Number(v) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return parts[0] * 0.2126 + parts[1] * 0.7152 + parts[2] * 0.0722;
  }
  function contrast(a, b) { const values = [luminance(a), luminance(b)].sort((x, y) => y - x); return (values[0] + 0.05) / (values[1] + 0.05); }
  async function run(frame, width) {
    const doc = frame.contentDocument;
    const win = frame.contentWindow;
    const results = [];
    const app = win.TraumaQuiz;
    check(doc.documentElement.scrollWidth <= width, `tanpa overflow ${width}`, results);
    check(doc.documentElement.lang === 'id', `bahasa ${width}`, results);
    check(doc.getElementById('quiz-screen').hidden && doc.getElementById('result-screen').hidden, `layar nonaktif ${width}`, results);
    const toolbar = doc.getElementById('audio-controls');
    check(toolbar.getAttribute('role') === 'group' && toolbar.getAttribute('aria-labelledby') === 'audio-title', `kelompok audio ${width}`, results);
    for (const channel of ['music', 'effects']) {
      const toggle = doc.getElementById(`${channel}-toggle`);
      const slider = doc.getElementById(`${channel}-volume`);
      const label = doc.querySelector(`label[for="${channel}-volume"]`);
      const text = win.getComputedStyle(toggle);
      check(toggle.tagName === 'BUTTON' && toggle.getAttribute('aria-pressed') === 'true' && toggle.getAttribute('aria-describedby'), `status tombol ${channel} ${width}`, results);
      check(slider.type === 'range' && slider.min === '0' && slider.max === '100' && label.textContent.includes('Volume'), `nama/rentang ${channel} ${width}`, results);
      check(contrast(text.color, text.backgroundColor) >= 4.5, `kontras audio ${channel} ${width}`, results);
    }
    const start = doc.getElementById('start-quiz');
    start.focus();
    check(doc.activeElement === start, `fokus programatis tombol ${width}`, results);
    check(start.getBoundingClientRect().height >= 44, `target tombol ${width}`, results);
    start.click();
    const progress = doc.getElementById('question-progress');
    check(progress.max === 10 && progress.value === 1 && progress.getAttribute('aria-label'), `progres ${width}`, results);
    check(doc.getElementById('question-title') === doc.activeElement, `fokus pertanyaan ${width}`, results);
    check(doc.getElementById('answer-options').getAttribute('aria-labelledby') === 'question-title', `kelompok pilihan ${width}`, results);
    const answer = doc.querySelector('#answer-options button');
    check(answer.tagName === 'BUTTON' && answer.textContent.includes(app.data.questions[0].options[0].label), `nama pilihan ${width}`, results);
    check(answer.getBoundingClientRect().width >= 44 && answer.getBoundingClientRect().height >= 44, `target pilihan ${width}`, results);
    const card = doc.getElementById('result-card');
    for (const character of app.data.characters) {
      app.ui.renderResult(app.data, { characterId: character.id, reasons: ['alasan satu', 'alasan dua'] });
      const style = win.getComputedStyle(card);
      const text = win.getComputedStyle(doc.getElementById('result-name'));
      const muted = win.getComputedStyle(doc.getElementById('result-character-title'));
      check(contrast(text.color, style.backgroundColor) >= 4.5 && contrast(muted.color, style.backgroundColor) >= 4.5, `kontras ${character.id} ${width}`, results);
      check(doc.getElementById('result-announced-name').textContent.includes(character.name), `nama hasil aksesibel ${character.id} ${width}`, results);
      check(doc.getElementById('result-photo').alt === '', `foto dekoratif ${character.id} ${width}`, results);
    }
    return results;
  }
  Promise.all([320, 375, 768, 1280].map((width) => new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.width = width;
    frame.height = 900;
    frame.title = `Viewport ${width}`;
    frame.src = '../index.html';
    frame.addEventListener('load', async () => {
      try { resolve(await run(frame, width)); }
      catch (error) { resolve([{ label: `${width}: ${error.message}`, passed: false }]); }
    }, { once: true });
    document.getElementById('frames').append(frame);
  }))).then((groups) => {
    const results = groups.flat();
    document.getElementById('report').textContent = JSON.stringify({ passed: results.every((item) => item.passed), results });
  });
})();
