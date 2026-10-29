'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { openBrowser } = require('./browser-driver.cjs');

async function main() {
  const b = await openBrowser();
  const profile = { downloadBitsPerSecond: 1600000, uploadBitsPerSecond: 750000, latencyMs: 150, cpuSlowdown: 4 };
  let requests = new Map();
  b.on('Network.responseReceived', ({ requestId, response, type }) => {
    const encoding = Object.entries(response.headers).find(([name]) => name.toLowerCase() === 'content-encoding');
    requests.set(requestId, { url: response.url.replace(b.base, ''), type, status: response.status,
      encoding: encoding ? encoding[1] : null, fromDiskCache: Boolean(response.fromDiskCache), encodedDataLength: null });
  });
  b.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
    if (requests.has(requestId)) requests.get(requestId).encodedDataLength = encodedDataLength;
  });
  const runs = [];
  try {
    await b.viewport(1280, 900);
    await b.send('Network.setCacheDisabled', { cacheDisabled: true });
    await b.send('Network.emulateNetworkConditions', { offline: false, latency: profile.latencyMs,
      downloadThroughput: profile.downloadBitsPerSecond / 8, uploadThroughput: profile.uploadBitsPerSecond / 8,
      connectionType: 'cellular3g' });
    await b.send('Emulation.setCPUThrottlingRate', { rate: profile.cpuSlowdown });
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await b.send('Network.clearBrowserCache');
      requests = new Map();
      await b.navigate(`/index.html?performance=${attempt}`);
      const timing = await b.evaluate(`(() => {
        const start = document.getElementById('start-quiz');
        return { readyMs: performance.getEntriesByName('quiz-ready')[0]?.startTime,
          visible: !start.hidden && getComputedStyle(start).display !== 'none' && start.getBoundingClientRect().height >= 44,
          navigation: performance.getEntriesByType('navigation')[0].toJSON(),
          resources: performance.getEntriesByType('resource').map(n=>({name:n.name.replace(location.origin,''),transferSize:n.transferSize,encodedBodySize:n.encodedBodySize,decodedBodySize:n.decodedBodySize})) };
      })()`);
      const resources = [...requests.values()].filter((request) => request.status === 200);
      const transferBytes = resources.reduce((total, resource) => total + (resource.encodedDataLength || 0), 0);
      const textCompressed = resources.filter((resource) => ['Document', 'Script', 'Stylesheet'].includes(resource.type)).every((resource) => resource.encoding === 'gzip');
      const photos = resources.filter((resource) => resource.type === 'Image');
      runs.push({ attempt, readyMs: timing.readyMs, transferBytes, visible: timing.visible, textCompressed,
        cacheUsed: resources.some((resource) => resource.fromDiskCache), initialPhotoCount: photos.length,
        resources, resourceTiming: timing.resources });
    }
    const values = runs.map((run) => run.readyMs).sort((a, c) => a - c);
    const medianReadyMs = values[2];
    const passed = medianReadyMs <= 3000 && runs.every((run) => run.visible && run.textCompressed && !run.cacheUsed
      && run.transferBytes <= 300 * 1024 && run.initialPhotoCount <= 1 && run.resources.every((resource) => resource.encodedDataLength !== null && !resource.url.includes('/assets/audio/')));
    const report = { passed, environment: b.environment, profile, server: 'Server statis lokal alat uji, gzip untuk HTML/CSS/JS, Cache-Control: no-store; JPEG tidak dikompresi ulang',
      medianReadyMs, maximumTransferBytes: Math.max(...runs.map((run) => run.transferBytes)), runs,
      scope: 'Pengukuran konfigurasi localhost terkompresi; deployment lain perlu diukur ulang jika konfigurasi berubah.' };
    fs.writeFileSync(path.join(b.root, process.env.TRAUMA_AUDIO_REGRESSION ? 'docs/t25-performance-check.json' : 'docs/t18-performance-check.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(JSON.stringify({ passed, medianReadyMs, maximumTransferBytes: report.maximumTransferBytes, runs: runs.map((run) => run.readyMs) }));
  } finally { await b.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
