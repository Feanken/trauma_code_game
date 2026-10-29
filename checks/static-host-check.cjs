'use strict';

// Verifikasi versi yang tersedia, bukan persetujuan rilis atau pengganti T24/T25.
const fs = require('node:fs');
const path = require('node:path');
const { openBrowser } = require('./browser-driver.cjs');

async function main() {
  const browser = await openBrowser({ mountPath: '/trauma-quiz' });
  const cases = [];
  const requests = [];
  const responses = [];
  const exceptions = [];
  let stage = '';
  browser.on('Network.requestWillBeSent', ({ request }) => requests.push({ stage, url: request.url, method: request.method }));
  browser.on('Network.responseReceived', ({ response }) => responses.push({ stage, url: response.url, status: response.status }));
  browser.on('Runtime.exceptionThrown', ({ exceptionDetails }) => exceptions.push(exceptionDetails.text));
  function check(value, name) {
    cases.push({ name, passed: Boolean(value) });
    if (!value) throw new Error(name);
  }
  try {
    for (const prefix of ['', '/trauma-quiz']) {
      stage = prefix || '/';
      await browser.navigate(`${prefix}/`);
      check(await browser.evaluate("!document.getElementById('landing-screen').hidden && getComputedStyle(document.getElementById('quiz-screen')).display === 'none'"), `pembuka dan layar tersembunyi ${stage}`);
      check(await browser.evaluate('document.styleSheets[0].cssRules.length > 0 && Boolean(TraumaQuiz.quiz.calculateResult)'), `CSS/JS dimuat ${stage}`);
      await browser.send('Runtime.evaluate', {expression:"document.getElementById('start-quiz').click()",userGesture:true});
      await browser.waitFor("TraumaQuiz.audio.getState().effectsReady === 4 && TraumaQuiz.audio.getState().playbackState === 'playing'");
      check(await browser.evaluate("TraumaQuiz.audio.getState().contextState === 'running'"), `audio lokal berjalan ${stage}`);
      for (let index = 1; index <= 10; index += 1) {
        await browser.evaluate("document.querySelector('#answer-options button[data-option=A]').click()");
        await browser.waitFor(index === 10 ? "!document.getElementById('result-screen').hidden" : `document.getElementById('question-progress').value === ${index + 1}`);
      }
      await browser.waitFor("document.getElementById('result-photo').naturalWidth === 720 && !document.getElementById('result-photo').hidden");
      check(await browser.evaluate("document.getElementById('result-name').textContent === 'Baek Kang-hyuk'"), `hasil semua A ${stage}`);
      check(await browser.evaluate(`new URL(document.getElementById('result-photo').currentSrc).pathname === '${prefix}/assets/images/baek-kang-hyuk.jpg'`), `foto relatif ${stage}`);
      await browser.evaluate("document.getElementById('restart-quiz').click()");
      check(await browser.evaluate("document.getElementById('question-progress').value === 1 && document.activeElement.id === 'question-title'"), `ulang ${stage}`);
      await browser.navigate(`${prefix}/checks/scoring-check.html`, "document.documentElement.dataset.checkStatus !== undefined");
      const score = await browser.evaluate("JSON.parse(document.getElementById('check-report').textContent)");
      check(score.passed && score.completed === 1024, `pemeriksa skor relatif ${stage}`);
    }
    check(requests.every((request) => request.url.startsWith(`${browser.base}/`)), 'tanpa request runtime ke pihak ketiga');
    check(requests.every((request) => request.method === 'GET'), 'tanpa pengiriman jawaban melalui POST/PUT');
    check(requests.every((request) => !new URL(request.url).search), 'tanpa jawaban pada query URL');
    check(responses.every((response) => response.status === 200), 'semua resource pengujian HTTP 200');
    check(exceptions.length === 0, 'tanpa exception JavaScript');
    const report = { passed: true, environment: browser.environment, scope: 'Versi dengan audio pada server statis alat uji; Nginx dan hosting publik tidak dijalankan.', cases, requests, responses, exceptions };
    fs.writeFileSync(path.join(browser.root, process.env.TRAUMA_AUDIO_REGRESSION ? 'docs/t25-static-host-check.json' : 'docs/t21-static-host-check.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ passed: true, cases: cases.length, requests: requests.length }));
  } catch (error) {
    fs.writeFileSync(path.join(browser.root, process.env.TRAUMA_AUDIO_REGRESSION ? 'docs/t25-static-host-check.json' : 'docs/t21-static-host-check.json'), JSON.stringify({ passed: false, environment: browser.environment, cases, error: error.message }, null, 2) + '\n');
    throw error;
  } finally { await browser.close(); }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
