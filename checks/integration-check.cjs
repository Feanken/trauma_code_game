'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { openBrowser, delay } = require('./browser-driver.cjs');

async function main() {
  const b = await openBrowser();
  const cases = [];
  const exceptions = [];
  b.on('Runtime.exceptionThrown', (event) => exceptions.push(event.exceptionDetails.text));
  function check(value, name) { cases.push({ name, passed: Boolean(value) }); if (!value) throw new Error(name); }
  const value = (expression) => b.evaluate(expression);
  const index = () => value("Number(document.getElementById('question-progress').value)");
  const click = (selector) => value(`document.querySelector(${JSON.stringify(selector)}).click()`);
  async function answer(option = 'A') {
    const before = await index();
    await click(`#answer-options button[data-option='${option}']`);
    await b.waitFor(before === 10 ? "!document.getElementById('result-screen').hidden" : `document.getElementById('question-progress').value === ${before + 1}`);
  }
  try {
    await b.navigate();
    await click('#start-quiz');
    await value("document.querySelector('#answer-options button').dispatchEvent(new MouseEvent('click', {bubbles:true, detail:1}))");
    await delay(220);
    await value("document.querySelector('#answer-options button').dispatchEvent(new MouseEvent('click', {bubbles:true, detail:2}))");
    await delay(220);
    check(await index() === 2, 'double-click setelah pergantian tidak melewati Q02');
    await click('#back-button');
    check(await index() === 1, 'Back dari Q02 ke Q01');
    check(await value("document.querySelector('[data-option=A]').getAttribute('aria-pressed') === 'true'"), 'pilihan sebelumnya terlihat');
    await answer();
    for (let i = 2; i <= 6; i += 1) await answer();
    await click('#back-button'); await click('#back-button');
    check(await index() === 5, 'dua Back dari Q07 ke Q05');
    await answer('B');
    check(await value("document.querySelector('[data-option=A]').getAttribute('aria-pressed') === 'true'"), 'koreksi Q05 mempertahankan Q06');
    const answers = Array(10).fill('A'); answers[4] = 'B';
    while (await index() <= 10 && await value("document.getElementById('result-screen').hidden")) await answer();
    check(await value(`document.getElementById('result-name').textContent === TraumaQuiz.data.characters.find(c => c.id === TraumaQuiz.quiz.calculateResult(TraumaQuiz.data, ${JSON.stringify(answers)}).characterId).name`), 'hasil mengikuti koreksi jawaban terbaru');
    await click('#restart-quiz');
    await b.key('Tab', 'Tab', 9);
    await b.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: '\r' });
    await delay(220);
    for (let i = 0; i < 5; i += 1) await b.key('Enter', 'Enter', 13, { autoRepeat: true });
    await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await delay(220);
    check(await index() === 2, 'Enter ditahan tidak melewati pertanyaan');
    await b.navigate(); await click('#start-quiz');
    await answer();
    await click('#answer-options button');
    await click('#back-button');
    await delay(220);
    check(await index() === 3, 'Back selama transisi diabaikan');
    const patterns = [['AAAAAAAAAA', 'B'], ['AAAAABAAAA', 'Y'], ['AAAAAAAABA', 'C'], ['AAAAAAABAA', 'P'], ['AAAAAAAAAB', 'H']];
    for (const [pattern, id] of patterns) {
      await b.navigate(); await click('#start-quiz');
      for (let i = 0; i < 10; i += 1) {
        check(await value("document.getElementById('result-screen').hidden"), `hasil belum muncul sebelum jawaban ${i + 1} pola ${id}`);
        await answer(pattern[i]);
      }
      await b.waitFor("document.getElementById('result-photo').naturalWidth > 0 && !document.getElementById('result-photo').hidden");
      check(await value(`document.getElementById('result-card').dataset.theme === '${id}'`), `hasil dan tema ${id}`);
      check(await value(`JSON.stringify([...document.querySelectorAll('#result-reasons li')].map(n=>n.textContent)) === JSON.stringify(TraumaQuiz.quiz.calculateResult(TraumaQuiz.data, [...'${pattern}']).reasons)`), `alasan pola ${id}`);
      await click('#restart-quiz');
      check(await value("!document.getElementById('result-screen').hasAttribute('data-theme') && document.getElementById('result-name').textContent === '' && [...document.querySelectorAll('#answer-options button')].every(n=>n.getAttribute('aria-pressed')==='false')"), `ulang membersihkan sesi ${id}`);
    }
    await b.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    for (let i = 0; i < 10; i += 1) await answer();
    check(await value("!document.getElementById('result-screen').hidden"), 'alur lengkap reduced motion');
    await value("window.stalePhotoLoad = document.getElementById('result-photo').onload; document.getElementById('result-photo').src = 'assets/images/missing.jpg'");
    await b.waitFor("document.getElementById('result-photo').hidden");
    check(await value("document.getElementById('result-initials').textContent.length === 2 && !document.getElementById('restart-quiz').hidden"), 'foto gagal tidak menghalangi hasil/ulang');
    await click('#restart-quiz');
    await value('window.stalePhotoLoad()');
    check(await value("document.getElementById('result-photo').hidden && !document.getElementById('result-photo').hasAttribute('src')"), 'callback foto sesi lama diabaikan');
    await b.navigate();
    check(await value("!document.getElementById('landing-screen').hidden && document.getElementById('quiz-screen').hidden"), 'refresh kembali ke pembuka');
    b.fixtures.set('/js/data.js', 'window.TraumaQuiz = {data: {questions: [], characters: [], tieBreakOrder: []}};');
    await b.navigate('/index.html?invalid=1', null);
    check(await value("Boolean(document.getElementById('initialization-error')) && document.getElementById('start-quiz').hidden && document.getElementById('result-screen').hidden"), 'data invalid menghentikan kuis');
    b.fixtures.clear();
    await b.navigate('/checks/scoring-check.html', "document.documentElement.dataset.checkStatus !== undefined");
    const scoring = await value("JSON.parse(document.getElementById('check-report').textContent)");
    check(scoring.passed && scoring.completed === 1024 && scoring.primaryTies === 424, 'regresi produksi 1024 kombinasi');
    check(exceptions.length === 0, 'tanpa exception JavaScript');
    fs.writeFileSync(path.join(b.root, process.env.TRAUMA_AUDIO_REGRESSION ? 'docs/t25-integration-check.json' : 'docs/t15-integration-check.json'), JSON.stringify({ passed: true, environment: b.environment, cases, scoring, exceptions }, null, 2) + '\n');
    console.log(JSON.stringify({ passed: true, cases: cases.length, combinations: scoring.completed }));
  } catch (error) {
    fs.writeFileSync(path.join(b.root, process.env.TRAUMA_AUDIO_REGRESSION ? 'docs/t25-integration-check.json' : 'docs/t15-integration-check.json'), JSON.stringify({ passed: false, environment: b.environment, cases, error: error.message, exceptions }, null, 2) + '\n');
    throw error;
  } finally { await b.close(); }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
