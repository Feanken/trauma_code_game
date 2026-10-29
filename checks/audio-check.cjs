'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { openBrowser, delay } = require('./browser-driver.cjs');

async function main() {
  const b = await openBrowser();
  const cases = [];
  const errors = [];
  let requests = [];
  b.on('Network.requestWillBeSent', ({ request }) => requests.push(request.url));
  b.on('Runtime.exceptionThrown', ({ exceptionDetails }) => errors.push(exceptionDetails.text));
  await b.send('Runtime.addBinding', { name: 'reportAudioUnhandled' });
  b.on('Runtime.bindingCalled', ({ name, payload }) => { if(name==='reportAudioUnhandled') errors.push(payload); });
  const check = (ok, name) => { cases.push({ name, passed: Boolean(ok) }); if (!ok) throw new Error(name); };
  const state = () => b.evaluate('TraumaQuiz.audio.getState()');
  async function gesture(expression) {
    const r = await b.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  }
  const click = (selector) => gesture(`document.querySelector(${JSON.stringify(selector)}).click()`);
  async function answer() {
    const before = await b.evaluate('document.getElementById("question-progress").value');
    await click('[data-option=A]');
    await b.waitFor(before === 10 ? '!document.getElementById("result-screen").hidden'
      : `document.getElementById('question-progress').value === ${before + 1}`);
  }
  // Instrument real browser nodes; buffers/playback are not mocked in the normal path.
  await b.send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.audioProbe = { contexts:0, elements:0, starts:[], gains:[], rejections:[] };
    window.addEventListener('unhandledrejection', e=>{audioProbe.rejections.push(String(e.reason));reportAudioUnhandled(String(e.reason))});
    const NativeContext = window.AudioContext;
    window.AudioContext = class extends NativeContext {
      constructor(...args) { super(...args); audioProbe.contexts++; }
      createGain() { const node=super.createGain(); audioProbe.gains.push(node); return node; }
      createBufferSource() { const node=super.createBufferSource(), start=node.start.bind(node);
        node.start=(...args)=>{audioProbe.starts.push(node.buffer.duration); return start(...args)}; return node; }
    };
    const NativeAudio=window.Audio;
    window.Audio = class extends NativeAudio { constructor(...args) { super(...args); audioProbe.elements++; } };
  ` });
  let report;
  try {
    await b.viewport(1280, 900);
    await b.navigate();
    await delay(250);
    check(requests.filter(url=>url.includes('/assets/audio/')).length === 0, 'zero audio requests before gesture');
    check((await state()).contextState === 'not-created', 'no AudioContext on initial load');
    check(await b.evaluate('audioProbe.contexts===0 && audioProbe.elements===0'), 'no media player on initial load');
    const tabIds = [];
    for (let i=0;i<5;i++) { await b.key('Tab','Tab',9); tabIds.push(await b.evaluate('document.activeElement.id')); }
    check(tabIds.join(',')==='music-toggle,music-volume,effects-toggle,effects-volume,start-quiz', 'native keyboard order includes four audio controls');
    await b.key('Enter','Enter',13);
    check(await b.evaluate('!document.getElementById("quiz-screen").hidden'), 'Start renders question without waiting for audio');
    await b.waitFor('TraumaQuiz.audio.getState().effectsReady===4 && TraumaQuiz.audio.getState().playbackState==="playing"');
    const t0=(await state()).currentTime; await delay(180);
    check((await state()).currentTime>t0, 'real BGM playback advances');
    check(await b.evaluate('audioProbe.contexts===1 && audioProbe.elements===1'), 'single graph and music player');
    check(await b.evaluate('Math.abs(audioProbe.gains[0].gain.value-.12)<.001 && Math.abs(audioProbe.gains[1].gain.value-.25)<.001'), 'independent gain defaults 12% / 25%');
    let count=await b.evaluate('audioProbe.starts.length');
    await click('[data-option=A]');
    await click('[data-option=B]'); await click('#back-button');
    await b.waitFor('document.getElementById("question-progress").value===2');
    await b.evaluate('document.querySelector("[data-option=A]").dispatchEvent(new MouseEvent("click",{bubbles:true,detail:2}))');
    check(await b.evaluate(`audioProbe.starts.length===${count+1}`), 'accepted answer produces one effect; locked and double-click actions silent');
    await click('#back-button');
    check(await b.evaluate(`audioProbe.starts.length===${count+2}`), 'accepted Back produces one effect');
    await click('#effects-toggle');
    check(!(await state()).effectsEnabled && (await state()).musicEnabled && !(await state()).musicPaused, 'effects mute leaves music playing');
    check(await b.evaluate('audioProbe.gains[1].gain.value===0'), 'effect gain zero immediately: '+JSON.stringify(await b.evaluate('audioProbe.gains.map(g=>({value:g.gain.value,time:g.context.currentTime,state:g.context.state}))')));
    count=await b.evaluate('audioProbe.starts.length'); await answer();
    check(await b.evaluate(`audioProbe.starts.length===${count}`), 'muted answer has no effect');
    await click('#effects-toggle'); await click('#music-toggle');
    check((await state()).effectsEnabled && !(await state()).musicEnabled && (await state()).musicPaused, 'music mute leaves effects enabled');
    await answer();
    check(await b.evaluate(`audioProbe.starts.length===${count+1}`), 'effects work while music muted');
    await b.evaluate('document.getElementById("effects-volume").value=0; document.getElementById("effects-volume").dispatchEvent(new Event("input"))');
    await answer();
    check(await b.evaluate(`audioProbe.starts.length===${count+1} && audioProbe.gains[1].gain.value===0`), 'effects volume zero is silent');
    await b.evaluate('document.getElementById("music-volume").value=0; document.getElementById("music-volume").dispatchEvent(new Event("input"))');
    await click('#music-toggle');
    await b.waitFor('TraumaQuiz.audio.getState().playbackState==="playing"');
    check(await b.evaluate('audioProbe.gains[0].gain.value===0 && document.getElementById("music-volume-value").textContent==="0%"'), 'music zero respected after enabling');
    await b.evaluate('document.getElementById("music-volume").focus()');
    await b.key('ArrowRight','ArrowRight',39);
    check((await state()).musicVolume===.01, 'native arrow key changes labeled slider');
    await b.evaluate('TraumaQuiz.audio.setVolume("effects",25)');
    while(await b.evaluate('document.getElementById("result-screen").hidden')) await answer();
    check(await b.evaluate('audioProbe.starts.filter(d=>Math.abs(d-1.4)<.01).length===1'), 'one reveal source after complete result');
    const beforeReset=await state();
    await click('#restart-quiz');
    const afterReset=await state();
    check(afterReset.musicVolume===.01 && afterReset.effectsVolume===.25 && afterReset.currentTime>=beforeReset.currentTime, 'restart preserves preferences and BGM position');
    check(await b.evaluate('audioProbe.contexts===1 && audioProbe.elements===1 && audioProbe.starts.filter(d=>Math.abs(d-.25)<.01).length>=1'), 'restart uses cached start effect and existing player');
    await b.evaluate('window.dispatchEvent(new Event("blur"))');
    check((await state()).musicPaused && (await state()).activeEffects===0 && (await state()).needsResume, 'blur stops music and voice');
    await b.evaluate('window.dispatchEvent(new Event("focus"))');
    await delay(120);
    check((await state()).musicPaused, 'focus does not auto resume');
    await answer();
    check((await state()).musicPaused, 'answer gesture does not auto resume music after blur');
    await click('#music-toggle');
    await b.waitFor('TraumaQuiz.audio.getState().playbackState==="playing"');
    check(!(await state()).musicPaused, 'explicit music control resumes');
    await b.evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"))');
    check((await state()).musicPaused && (await state()).activeEffects===0, 'hidden stops both channels');
    await b.evaluate('Object.defineProperty(document,"hidden",{configurable:true,value:false});document.dispatchEvent(new Event("visibilitychange"))');
    check((await state()).musicPaused, 'visible does not auto resume');
    // New controls retain their dimensions and fit on every required width, including zoom-equivalent reflow.
    for(const width of [320,375,768,1280,160]) {
      await b.viewport(width,700);
      check(await b.evaluate(`document.documentElement.scrollWidth<=innerWidth && [...document.querySelectorAll('#audio-controls button,#audio-controls input')].every(e=>e.getBoundingClientRect().height>=44 && e.getBoundingClientRect().width>=44)`), `audio controls fit and targets >=44px at ${width}px`);
    }
    await b.send('Accessibility.enable');
    const ax=await b.send('Accessibility.getFullAXTree');
    check(ax.nodes.filter(n=>n.role?.value==='slider').length===2 && ax.nodes.some(n=>n.role?.value==='slider' && n.name?.value.includes('Volume musik')), 'two named sliders in Chrome accessibility tree');
    await b.viewport(375,667); await b.navigate();
    await b.screenshot('t25-audio-controls-375.png');
    // Delayed loads may fill the cache, but must never play the skipped Start or unmute music.
    await b.evaluate(`window.originalFetch=window.fetch; window.fetch=(...args)=>new Promise(resolve=>setTimeout(()=>resolve(originalFetch(...args)),450))`);
    await click('#start-quiz'); await click('#music-toggle'); await click('#effects-toggle');
    await b.waitFor('TraumaQuiz.audio.getState().effectsReady===4'); await delay(150);
    check(await b.evaluate('audioProbe.starts.length===0 && TraumaQuiz.audio.getState().musicPaused'), 'late decode cannot play skipped start or override mute');
    // Reject playback and test a stale resolved play Promise after mute.
    await b.navigate();
    await b.evaluate('HTMLMediaElement.prototype.play=function(){return Promise.reject(new DOMException("test blocked","NotAllowedError"))}');
    await click('#start-quiz'); await delay(100);
    check((await state()).playbackState==='unavailable' && await b.evaluate('!document.getElementById("quiz-screen").hidden'), 'rejected playback is handled without blocking quiz');
    await b.navigate();
    await b.evaluate('HTMLMediaElement.prototype.play=function(){return new Promise(resolve=>{window.resolveOldPlay=resolve})}');
    await click('#start-quiz'); await click('#music-toggle');
    await b.evaluate('resolveOldPlay()'); await delay(50);
    check(!(await state()).musicEnabled && (await state()).playbackState==='paused', 'stale play callback cannot undo mute');
    await b.navigate();
    await b.evaluate('HTMLMediaElement.prototype.play=function(){return new Promise(resolve=>{window.resolveOldPlay=resolve})}');
    await click('#start-quiz');
    for(let i=0;i<10;i++) await answer();
    await click('#restart-quiz');
    await b.evaluate('resolveOldPlay()'); await delay(50);
    check((await state()).playbackState==='paused' && (await state()).activeEffects<=1, 'reset invalidates pending music callback without restarting old playback');
    // Actual decode failure and media error use invalid local bytes, with the real decoder.
    for(const file of ['bgm','start','select','back','reveal']) b.fixtures.set(`/assets/audio/${file}.mp3`,'invalid audio');
    await b.navigate(); await click('#start-quiz');
    await b.waitFor('document.getElementById("effects-status").textContent.includes("belum tersedia") && TraumaQuiz.audio.getState().playbackState==="unavailable"');
    await answer();
    check(await b.evaluate('document.getElementById("question-progress").value===2 && audioProbe.starts.length===0'), 'corrupt files do not block navigation or trigger delayed sound');
    b.fixtures.clear();
    await b.navigate();
    await b.send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:0,uploadThroughput:0});
    await click('#start-quiz'); await answer();
    check(await b.evaluate('document.getElementById("question-progress").value===2'), 'offline audio requests do not block already loaded quiz');
    await b.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:0,uploadThroughput:0});
    await b.navigate();
    await b.evaluate('AudioContext.prototype.resume=function(){return Promise.reject(new Error("test context blocked"))}');
    await click('#start-quiz'); await delay(100);
    check((await state()).playbackState==='unavailable' && (await state()).musicPaused, 'resume rejection stops playback and is handled');
    await b.navigate();
    await b.evaluate('window.AudioContext=undefined;window.webkitAudioContext=undefined');
    await click('#start-quiz'); await answer();
    check((await state()).playbackState==='unavailable', 'missing Web Audio still permits quiz');
    await b.navigate(); await click('#music-toggle'); await click('#effects-toggle');
    const before=requests.filter(url=>url.includes('/assets/audio/')).length;
    await click('#start-quiz'); await answer();
    check((await state()).contextState==='not-created' && requests.filter(url=>url.includes('/assets/audio/')).length===before, 'both channels disabled before Start avoid all audio loading');
    check(errors.length===0 && await b.evaluate('audioProbe.rejections.length===0'), 'no uncaught exceptions or unhandled rejection');
    await b.navigate('/checks/accessibility-check.html', 'document.getElementById("report").textContent.startsWith("{")');
    const accessibility=await b.evaluate('JSON.parse(document.getElementById("report").textContent)');
    fs.writeFileSync(path.join(b.root,'docs/t25-accessibility-check.json'),JSON.stringify(accessibility,null,2)+'\n');
    check(accessibility.passed, 'accessibility and actual text contrast including new audio controls');
    report={ automatedPassed:true, environment:b.environment, cases, errors,
      limitations:['CDP gesture/visibility fixtures and real Chrome playback; no speaker capture by agent.', 'Automated run does not judge audible timing; user reports are recorded separately in t25-manual-check.md.', 'Physical Android/iPhone and Firefox pending; screen reader user report is recorded separately.'] };
  } catch(error) { report={automatedPassed:false,environment:b.environment,cases,errors,error:error.message}; process.exitCode=1; }
  finally {
    fs.writeFileSync(path.join(b.root,'docs/t25-audio-check.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify({automatedPassed:report.automatedPassed,count:cases.length,error:report.error}));
    await b.close();
  }
}
main().catch(error=>{console.error(error);process.exitCode=1});
