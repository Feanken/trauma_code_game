(function () {
  'use strict';
  const frame = document.getElementById('frame');
  const results = [];
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  function check(value, label) { results.push({ label, passed: Boolean(value) }); if (!value) throw new Error(label); }
  frame.addEventListener('load', async () => {
    try {
      const doc = frame.contentDocument;
      const win = frame.contentWindow;
      check(win.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches, 'mouse fine tersedia');
      const reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const landingCard = doc.querySelector('#landing-card-wrapper .id-card');
      function move(card, x, y) {
        card.dispatchEvent(new win.PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: x, clientY: y }));
      }
      const rect = landingCard.getBoundingClientRect();
      move(landingCard, rect.right - 3, rect.top + 3);
      await wait(60);
      if (reduced) {
        check(landingCard.style.getPropertyValue('--card-rotate-y') === '', 'reduced motion menetralkan tilt');
        check(doc.getElementById('ambient-near').style.getPropertyValue('--ambient-x') === '', 'reduced motion menetralkan latar');
        doc.getElementById('start-quiz').click();
        doc.querySelector('#answer-options button[data-option="A"]').click();
        await wait(205);
        check(doc.getElementById('progress-text').textContent === 'Pertanyaan 2/10', 'reduced motion tetap maju tepat satu');
      } else {
      check(landingCard.style.getPropertyValue('--card-rotate-y').endsWith('deg'), 'tilt pembuka');
      check(parseFloat(landingCard.style.getPropertyValue('--card-rotate-y')) <= 3, 'tilt dibatasi');
      const nearX = parseFloat(doc.getElementById('ambient-near').style.getPropertyValue('--ambient-x'));
      const farX = parseFloat(doc.getElementById('ambient-far').style.getPropertyValue('--ambient-x'));
      check(Number.isFinite(nearX) && Math.abs(nearX) <= 12 && Math.abs(farX) <= 6, 'parallax latar dibatasi');
      doc.dispatchEvent(new win.KeyboardEvent('keydown', { bubbles: true, key: 'Tab' }));
      check(landingCard.style.getPropertyValue('--card-rotate-y') === '', 'keyboard reset');
      doc.getElementById('start-quiz').click();
      check(doc.getElementById('ambient-near').style.getPropertyValue('--ambient-x') === '', 'ganti layar reset');
      for (let index = 0; index < 10; index += 1) {
        doc.querySelector('#answer-options button[data-option="A"]').click();
        await wait(205);
      }
      const resultCard = doc.querySelector('#result-card-wrapper .id-card');
      const resultRect = resultCard.getBoundingClientRect();
      move(resultCard, resultRect.right - 3, resultRect.top + 100);
      await wait(240);
      check(resultCard.style.getPropertyValue('--card-rotate-x').endsWith('deg'), `tilt hasil: ${resultCard.style.getPropertyValue('--card-rotate-x')}, hidden=${doc.getElementById('result-screen').hidden}, rect=${resultRect.x},${resultRect.y},${resultRect.width}x${resultRect.height}, viewport=${win.innerWidth}x${win.innerHeight}, fine=${win.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches}, ambient=${doc.getElementById('ambient-near').style.getPropertyValue('--ambient-x')}`);
      win.dispatchEvent(new win.Event('blur'));
      check(resultCard.style.getPropertyValue('--card-rotate-x') === '', 'blur reset');
      move(resultCard, resultRect.right - 3, resultRect.top + 100);
      await wait(60);
      doc.dispatchEvent(new win.PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
      check(resultCard.style.getPropertyValue('--card-rotate-x') === '', 'touch reset');
      doc.getElementById('restart-quiz').click();
      check(doc.getElementById('ambient-far').style.getPropertyValue('--ambient-x') === '', 'ulang reset');
      }
    } catch (error) { results.push({ label: error.message, passed: false }); }
    const passed = results.every((item) => item.passed);
    document.getElementById('report').textContent = JSON.stringify({ passed, results });
  }, { once: true });
})();