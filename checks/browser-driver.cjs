'use strict';

// Alat verifikasi lokal, tidak dimuat oleh website dan tidak memerlukan npm.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const zlib = require('node:zlib');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openBrowser({ mountPath = '' } = {}) {
  const fixtures = new Map();
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg' };
  const server = http.createServer((request, response) => {
    let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (mountPath && pathname.startsWith(`${mountPath}/`)) pathname = pathname.slice(mountPath.length);
    const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!file.startsWith(`${root}${path.sep}`)) { response.writeHead(403).end(); return; }
    fs.readFile(file, (error, original) => {
      if (error) { response.writeHead(404).end(); return; }
      let bytes = fixtures.has(pathname) ? Buffer.from(fixtures.get(pathname)) : original;
      const type = mime[path.extname(file)] || 'application/octet-stream';
      const compressed = /text\//.test(type) && /gzip/.test(request.headers['accept-encoding'] || '');
      if (compressed) bytes = zlib.gzipSync(bytes);
      response.writeHead(200, { 'Content-Type': type, 'Content-Length': bytes.length,
        'Cache-Control': 'no-store', ...(compressed ? { 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' } : {}) });
      response.end(bytes);
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'trauma-verification-'));
  const executable = process.env.TRAUMA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(executable, ['--headless=new', '--disable-gpu', '--no-first-run',
    '--no-default-browser-check', '--remote-debugging-address=127.0.0.1', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  let port;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    await delay(100);
    try { port = Number(fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]); break; } catch {}
  }
  if (!port) { chrome.kill(); server.close(); throw new Error('Chrome tidak siap.'); }
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const socket = new WebSocket(targets.find((target) => target.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  const pending = new Map();
  const listeners = new Map();
  let nextId = 1;
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id);
      clearTimeout(timer);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
    } else if (message.method) {
      for (const listener of listeners.get(message.method) || []) listener(message.params);
    }
  });
  function on(method, listener) {
    if (!listeners.has(method)) listeners.set(method, []);
    listeners.get(method).push(listener);
  }
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, 15000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function waitFor(expression, timeout = 8000) {
    const started = Date.now();
    while (Date.now() - started < timeout) { if (await evaluate(expression)) return; await delay(30); }
    throw new Error(`Kondisi tidak terpenuhi: ${expression}`);
  }
  async function navigate(url = '/index.html', ready = "document.documentElement.dataset.quizReady === 'true'") {
    const previousOrigin = await evaluate('performance.timeOrigin');
    await send('Page.navigate', { url: `${base}${url}` });
    await waitFor(`performance.timeOrigin !== ${previousOrigin} && location.href === ${JSON.stringify(base + url)} && document.readyState === 'complete'`);
    if (ready) await waitFor(ready);
  }
  async function key(key, code, vk, extra = {}) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: vk,
      text: key === 'Enter' ? '\r' : key === ' ' ? ' ' : undefined, ...extra });
    if (!extra.autoRepeat) await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: vk });
  }
  async function viewport(width, height) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  }
  async function screenshot(name) {
    if (process.env.TRAUMA_AUDIO_REGRESSION && name.startsWith('t16-')) name = name.replace('t16-', 't25-');
    const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const filename = path.join(root, 'docs', name);
    fs.writeFileSync(filename, Buffer.from(result.data, 'base64'));
    return `docs/${name}`;
  }
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  const browser = await send('Browser.getVersion');
  const environment = { date: '2026-10-29', os: `${os.type()} ${os.release()}`, cpu: os.cpus()[0].model,
    logicalCpus: os.cpus().length, totalMemoryBytes: os.totalmem(), browser: browser.product, userAgent: browser.userAgent };
  async function close() {
    try { await send('Browser.close'); } catch {}
    socket.close(); chrome.kill(); server.close(); await delay(400);
    if (path.resolve(profile).startsWith(`${path.resolve(os.tmpdir())}${path.sep}trauma-verification-`)) {
      try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
    }
  }
  return { root, base, fixtures, environment, send, on, evaluate, waitFor, navigate, viewport, key, screenshot, close };
}

module.exports = { openBrowser, delay };
