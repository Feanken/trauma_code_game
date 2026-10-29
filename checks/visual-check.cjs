'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { openBrowser, delay } = require('./browser-driver.cjs');

async function main() {
  const b = await openBrowser();
  const cases = [];
  const screenshots = [];
  const measurements = [];
  function check(value, name) { cases.push({ name, passed: Boolean(value) }); }
  const click = (selector) => b.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  const patterns = ['AAAAAAAAAA', 'AAAAABAAAA', 'AAAAAAAABA', 'AAAAAAABAA', 'AAAAAAAAAB'];
  async function measure(label) {
    const result = await b.evaluate(`(() => {
      const visible = [...document.querySelectorAll('section')].find(n=>!n.hidden);
      const controls = [...visible.querySelectorAll('button'), ...document.querySelectorAll('#audio-controls button,#audio-controls input')].filter(n=>!n.hidden);
      const choices = [...visible.querySelectorAll('.answer-card')].map(n=>n.getBoundingClientRect());
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        targets: controls.map(n=>({width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})),
        hiddenScreens: [...document.querySelectorAll('section[hidden]')].every(n=>getComputedStyle(n).display==='none'),
        sideBySide: !choices.length || choices[0].right <= choices[1].left,
        shadow: getComputedStyle(visible).boxShadow !== 'none' };
    })()`);
    check(result.hiddenScreens, `layar nonaktif tersembunyi ${label}`);
    check(result.scrollWidth <= result.width, `tanpa overflow ${label}`);
    check(result.targets.every((n) => n.width >= 44 && n.height >= 44), `target 44 px ${label}`);
    check(result.sideBySide && result.shadow, `dua pilihan/lapisan ${label}`);
    measurements.push({ label, ...result });
  }
  try {
    for (const [width, height] of [[320, 568], [375, 667], [768, 1024], [1280, 900]]) {
      await b.viewport(width, height);
      await b.navigate(); await delay(200);
      await measure(`landing-${width}`);
      screenshots.push(await b.screenshot(`t16-landing-${width}.png`));
      await click('#start-quiz');
      for (let index = 1; index <= 10; index += 1) {
        await measure(`Q${index}-${width}`);
        if (index === 5) screenshots.push(await b.screenshot(`t16-quiz-${width}.png`));
        await click('#answer-options button');
        await delay(205);
      }
      for (const pattern of patterns) {
        const id = await b.evaluate(`(() => { const outcome = TraumaQuiz.quiz.calculateResult(TraumaQuiz.data, [...'${pattern}']); TraumaQuiz.ui.renderResult(TraumaQuiz.data, outcome); return outcome.characterId; })()`);
        await b.waitFor("document.getElementById('result-photo').naturalWidth > 0 && !document.getElementById('result-photo').hidden");
        await delay(400);
        await measure(`result-${id}-${width}`);
        await b.evaluate("document.getElementById('result-card-wrapper').scrollIntoView({block:'start'})");
        const card = await b.evaluate("(() => { const r=document.getElementById('result-card').getBoundingClientRect(); return {width:r.width,height:r.height,top:r.top,bottom:r.bottom}; })()");
        measurements.push({ label: `card-${id}-${width}`, ...card });
        check(card.height <= height && card.top >= -1 && card.bottom <= height + 1, `kartu utuh ${id}-${width}`);
        if (width === 320) check(card.height <= 400, `tinggi kartu 320 ${id}`);
        screenshots.push(await b.screenshot(`t16-result-${id}-${width}.png`));
      }
    }
    await b.viewport(1280, 900);
    await b.navigate();
    for (const wrapperId of ['landing-card-wrapper', 'result-card-wrapper']) {
      if (wrapperId === 'result-card-wrapper') await b.evaluate("TraumaQuiz.ui.renderResult(TraumaQuiz.data, TraumaQuiz.quiz.calculateResult(TraumaQuiz.data, Array(10).fill('A')))");
      await delay(400);
      await b.evaluate(`document.getElementById('${wrapperId}').scrollIntoView({block:'center'})`);
      const rect = await b.evaluate(`(() => {const r=document.getElementById('${wrapperId}').getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}})()`);
      const control = wrapperId === 'landing-card-wrapper' ? '#start-quiz' : '#restart-quiz';
      const hitBefore = await b.evaluate(`JSON.stringify(document.querySelector('${control}').getBoundingClientRect().toJSON())`);
      for (const [x, y] of [[0.5, 0.5], [0.01, 0.01], [0.99, 0.01], [0.01, 0.99], [0.99, 0.99]]) {
        await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: rect.x + x * rect.width, y: rect.y + y * rect.height });
        await delay(140);
        const effect = await b.evaluate(`(() => { const c=document.querySelector('#${wrapperId} .id-card');const s=c.style;return {x:parseFloat(s.getPropertyValue('--card-rotate-x')),y:parseFloat(s.getPropertyValue('--card-rotate-y')),gx:parseFloat(s.getPropertyValue('--glow-x')),gy:parseFloat(s.getPropertyValue('--glow-y')),far:parseFloat(document.getElementById('ambient-far').style.getPropertyValue('--ambient-x')),near:parseFloat(document.getElementById('ambient-near').style.getPropertyValue('--ambient-x'))};})()`);
        check(Number.isFinite(effect.x) && Math.abs(effect.x) <= 3 && Math.abs(effect.y) <= 3, `tilt pusat/sudut ${wrapperId} ${x},${y}`);
        check(Math.abs(effect.gx - x * 100) < 1 && Math.abs(effect.gy - y * 100) < 1, `sorotan ${wrapperId} ${x},${y}`);
        check(Math.abs(effect.far) <= 6 && Math.abs(effect.near) <= 12, `parallax ${wrapperId} ${x},${y}`);
      }
      check(hitBefore === await b.evaluate(`JSON.stringify(document.querySelector('${control}').getBoundingClientRect().toJSON())`), `hit area stabil ${wrapperId}`);
      await b.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      const neutral = `document.querySelector('#${wrapperId} .id-card').style.getPropertyValue('--card-rotate-x') === ''`;
      await b.waitFor(neutral);
      check(await b.evaluate(neutral), `perubahan reduced motion menetralkan ${wrapperId}`);
      await b.send('Emulation.setEmulatedMedia', { features: [] });
    }
    await b.send('Emulation.clearDeviceMetricsOverride');
    for (let i = 0; i < 5; i += 1) {
      await b.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: '+', code: 'Equal', windowsVirtualKeyCode: 187, nativeVirtualKeyCode: 187, modifiers: 2 });
      await b.send('Input.dispatchKeyEvent', { type: 'keyUp', key: '+', code: 'Equal', windowsVirtualKeyCode: 187, nativeVirtualKeyCode: 187, modifiers: 2 });
    }
    await b.waitFor('devicePixelRatio === 2');
    check(await b.evaluate('devicePixelRatio === 2'), 'zoom browser asli 200%');
    for (const [width, height] of [[320, 568], [375, 667], [768, 1024], [1280, 900]]) {
      await b.viewport(width, height);
      await b.navigate();
      for (const screen of ['landing', 'quiz', 'B', 'Y', 'C', 'P', 'H']) {
        if (screen === 'quiz') await click('#start-quiz');
        else if (screen !== 'landing') await b.evaluate(`TraumaQuiz.ui.renderResult(TraumaQuiz.data, {characterId:'${screen}',reasons:['Alasan pertama yang tetap terbaca.', 'Alasan kedua yang tetap terbaca.']})`);
        await delay(50);
        const result = await b.evaluate("({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth})");
        measurements.push({ label: `zoom-200-${screen}-${width}`, ...result });
        check(result.scrollWidth <= result.width + 1, `zoom 200 tanpa overflow ${screen}-${width}`);
      }
      if (width === 320) screenshots.push(await b.screenshot('t16-result-H-320-zoom200.png'));
    }
    const report = { passed: cases.every((item) => item.passed), environment: b.environment, cases, measurements, screenshots,
      method: 'Chrome CDP, ukuran CSS aktual, rendering hasil memakai fungsi produksi; alur controller diperiksa terpisah pada T15' };
    fs.writeFileSync(path.join(b.root, process.env.TRAUMA_AUDIO_REGRESSION ? 'docs/t25-visual-check.json' : 'docs/t16-visual-check.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ passed: report.passed, cases: cases.length, failures: cases.filter((item) => !item.passed) }));
  } finally { await b.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
