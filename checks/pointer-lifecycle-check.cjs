'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { openBrowser, delay } = require('./browser-driver.cjs');

async function main() {
  const b = await openBrowser();
  const cases = [];
  function check(value, name) { cases.push({ name, passed: Boolean(value) }); if (!value) throw new Error(name); }
  const neutral = "document.querySelector('#landing-card-wrapper .id-card').style.getPropertyValue('--card-rotate-x') === '' && document.getElementById('ambient-near').style.getPropertyValue('--ambient-x') === ''";
  async function move(wrapperId = 'landing-card-wrapper') {
    await b.evaluate(`document.getElementById('${wrapperId}').scrollIntoView({block:'center'})`);
    const point = await b.evaluate(`(() => {const r=document.getElementById('${wrapperId}').getBoundingClientRect(); return {x:r.left+r.width*.8,y:r.top+r.height*.2};})()`);
    await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point }); await delay(160);
  }
  try {
    await b.viewport(1280, 900); await b.navigate();
    await b.evaluate('window.frameCount=0; window.savedRaf=window.requestAnimationFrame; window.requestAnimationFrame=(callback)=>{window.frameCount++; return window.savedRaf(callback)}');
    await move();
    const frames = await b.evaluate('window.frameCount'); await delay(200);
    check(await b.evaluate('window.frameCount') === frames, 'pointer diam tanpa loop RAF');
    await b.key('Tab', 'Tab', 9);
    check(await b.evaluate(neutral), 'keyboard reset properti');
    check(await b.evaluate("getComputedStyle(document.querySelector('#landing-card-wrapper .id-card')).transform === 'matrix(1, 0, 0, 1, 0, 0)'"), 'keyboard langsung netral tanpa animasi reset');
    await move();
    await b.evaluate("document.dispatchEvent(new PointerEvent('pointerout', {relatedTarget:null}))");
    check(await b.evaluate(neutral), 'keluar viewport reset properti (event sintetis)');
    await move();
    await b.viewport(1281, 900); await delay(50);
    check(await b.evaluate(neutral), 'resize reset properti');
    await move();
    const newTab = await b.send('Target.createTarget', { url: 'about:blank' });
    await b.send('Target.activateTarget', { targetId: newTab.targetId });
    await b.waitFor('document.hidden');
    check(await b.evaluate(neutral), 'halaman tersembunyi reset properti');
    await b.send('Target.closeTarget', { targetId: newTab.targetId });
    await b.send('Page.bringToFront');
    await move();
    await b.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
    await b.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: 100 }] });
    await b.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    check(await b.evaluate(neutral), 'touch reset properti');
    await b.send('Emulation.setTouchEmulationEnabled', { enabled: false });
    await b.viewport(375, 667);
    await b.evaluate("TraumaQuiz.ui.renderResult(TraumaQuiz.data, TraumaQuiz.quiz.calculateResult(TraumaQuiz.data, Array(10).fill('A')))");
    await delay(400); await move('result-card-wrapper');
    await b.evaluate("window.scrollTo(0,document.getElementById('result-card-wrapper').getBoundingClientRect().bottom+scrollY+40)");
    await delay(160);
    check(await b.evaluate("document.getElementById('result-card').style.getPropertyValue('--card-rotate-x') === ''"), 'kartu keluar viewport saat scroll kembali netral');
    const report = { passed: true, environment: b.environment, cases };
    fs.writeFileSync(path.join(b.root, 'docs/t16-pointer-lifecycle-check.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ passed: true, cases: cases.length }));
  } catch (error) {
    fs.writeFileSync(path.join(b.root, 'docs/t16-pointer-lifecycle-check.json'), JSON.stringify({ passed: false, environment: b.environment, cases, error: error.message }, null, 2) + '\n');
    throw error;
  } finally { await b.close(); }
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
