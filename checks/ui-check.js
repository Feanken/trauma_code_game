(function () {
  'use strict';

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function luminance(color) {
    const channels = color.match(/[\d.]+/g).slice(0, 3).map((value) => {
      const normalized = Number(value) / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }

  function contrast(foreground, background) {
    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
    return (values[0] + 0.05) / (values[1] + 0.05);
  }

  function measure(frame, width) {
    const page = frame.contentWindow;
    const doc = frame.contentDocument;
    const css = (element) => page.getComputedStyle(element);
    const bounds = (element) => element.getBoundingClientRect();
    assert(page.innerWidth === width, 'Lebar iframe berbeda dari target.');
    assert(doc.documentElement.scrollWidth <= width, 'Overflow horizontal.');

    const columns = css(doc.querySelector('.split-layout')).gridTemplateColumns.split(' ').length;
    const resultColumns = css(doc.querySelector('.result-layout')).gridTemplateColumns.split(' ').length;
    assert(columns === (width < 768 ? 1 : 2), 'Kolom pembuka salah.');
    assert(resultColumns === columns, 'Kolom hasil salah.');
    const left = bounds(doc.getElementById('choice-a'));
    const right = bounds(doc.getElementById('choice-b'));
    assert(left.right <= right.left && Math.abs(left.top - right.top) < 1, 'A/B tidak sejajar.');
    assert(Math.abs(left.height - right.height) < 1, 'Tinggi kartu berbeda.');

    for (const button of doc.querySelectorAll('button')) {
      const rect = bounds(button);
      assert(rect.width >= 44 && rect.height >= 44, 'Target tekan terlalu kecil.');
    }
    const control = doc.getElementById('normal-control');
    const before = bounds(control);
    control.classList.add('is-pressed');
    const after = bounds(control);
    assert(before.x === after.x && before.y === after.y
      && before.width === after.width && before.height === after.height, 'Area tekan bergeser.');
    control.classList.remove('is-pressed');

    const focus = doc.getElementById('focus-control');
    focus.focus();
    const focusStyle = css(focus);
    assert(doc.activeElement === focus && parseFloat(focusStyle.outlineWidth) >= 3
      && focusStyle.outlineStyle !== 'none', 'Fokus tidak terlihat.');
    const selected = doc.getElementById('choice-b');
    assert(css(selected.querySelector('.choice-state')).display !== 'none', 'Label dipilih tersembunyi.');
    assert(css(doc.querySelector('button:disabled')).borderTopStyle === 'dashed', 'Status disabled tidak dibedakan.');

    const panel = doc.querySelector('.panel');
    const panelStyle = css(panel);
    assert(panelStyle.boxShadow !== 'none', 'Bayangan panel hilang.');
    const ratios = {
      mainText: contrast(panelStyle.color, panelStyle.backgroundColor),
      mutedText: contrast(css(doc.querySelector('.muted')).color, panelStyle.backgroundColor),
      primaryButton: contrast(css(control).color, css(control).backgroundColor)
    };
    for (const element of doc.querySelectorAll('[data-theme].eyebrow')) {
      ratios[element.dataset.theme] = contrast(css(element).color, panelStyle.backgroundColor);
    }
    assert(Object.values(ratios).every((ratio) => ratio >= 4.5), 'Kontras teks tidak memadai.');
    return { width, passed: true, columns, resultColumns, answersSideBySide: true,
      stableHitArea: true, visibleFocus: true, minimumTarget: 44, contrastRatios: ratios };
  }

  const checks = [320, 375, 768, 1280].map((width) => new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.title = `Viewport ${width} CSS px`;
    frame.width = width;
    frame.height = 1000;
    frame.src = 'ui-preview.html';
    frame.addEventListener('load', () => {
      try {
        resolve(measure(frame, width));
      } catch (error) {
        resolve({ width, passed: false, error: error.message });
      }
    }, { once: true });
    document.getElementById('frames').append(frame);
  }));

  Promise.all(checks).then((results) => {
    const report = { passed: results.every((result) => result.passed), viewports: results };
    document.getElementById('check-report').textContent = JSON.stringify(report, null, 2);
    document.documentElement.dataset.checkStatus = report.passed ? 'passed' : 'failed';
  });
})();
