// Run after starting Vite preview (4173) and an isolated Chrome CDP session (9222).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:4173';
const targets = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const target = targets.find((item) => item.type === 'page');
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) => socket.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map();
const requests = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const call = pending.get(message.id);
    pending.delete(message.id);
    message.error ? call.reject(message.error) : call.resolve(message.result);
  }
  if (message.method === 'Network.requestWillBeSent') requests.push(message.params.request);
});
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timeout: ${expression}`);
}
async function navigate(path) {
  await send('Page.navigate', { url: base + path });
  await waitFor('document.readyState === "complete" && !!document.querySelector("h1")');
  await evaluate('document.fonts.ready');
}
await send('Page.enable');
await send('Runtime.enable');
await send('Network.enable');
const output = new URL('./browser-evidence/', import.meta.url);
await mkdir(output, { recursive: true });
const evidence = { viewports: [], axe: [], flow: {} };
try {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await navigate('/register');
    const metrics = await evaluate(
      `(()=>{const heading=document.querySelector('h1').getBoundingClientRect();const form=document.querySelector('form').getBoundingClientRect();const panel=document.querySelector('header');return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:{x:heading.x,y:heading.y},formWidth:form.width,brandVisible:!!panel.getBoundingClientRect().width};})()`,
    );
    assert.ok(metrics.scrollWidth <= width);
    assert.equal(metrics.brandVisible, width >= 1024);
    evidence.viewports.push(metrics);
    const screenshot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    await writeFile(
      new URL(`register-${width}.png`, output),
      Buffer.from(screenshot.data, 'base64'),
    );
  }
  const axeSource = await readFile(
    new URL('../../node_modules/axe-core/axe.min.js', new URL('../../', import.meta.url)),
    'utf8',
  ).catch(() => readFile('node_modules/axe-core/axe.min.js', 'utf8'));
  await evaluate(axeSource);
  const axe = await evaluate(
    `axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))}))`,
  );
  evidence.axe.push({ state: 'empty-desktop', ...axe });
  await evaluate(`document.querySelector('button[type=submit]').click()`);
  assert.equal(await evaluate('document.activeElement.name'), 'fullName');
  assert.equal(await evaluate('document.querySelectorAll("[aria-invalid=true]").length'), 5);
  evidence.flow.emptyValidation = true;
  evidence.axe.push({
    state: 'errors-desktop',
    ...(await evaluate(
      `axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,help:v.help}))}))`,
    )),
  });
  await send('Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 700,
    deviceScaleFactor: 1,
    mobile: false,
  });
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  const errorsShot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  });
  await writeFile(
    new URL('register-errors-320.png', output),
    Buffer.from(errorsShot.data, 'base64'),
  );
  evidence.axe.push({
    state: 'errors-mobile',
    ...(await evaluate(
      `axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}).then(r=>({violations:r.violations.map(v=>({id:v.id,help:v.help}))}))`,
    )),
  });
  // Double each computed font size to exercise text enlargement without resizing controls.
  await evaluate(
    `Array.from(document.querySelectorAll('h1,p,label,input,button,a')).map(el=>[el,parseFloat(getComputedStyle(el).fontSize)]).forEach(([el,size])=>el.style.fontSize=(size*2)+'px')`,
  );
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  assert.ok(
    await evaluate(
      `(()=>{const button=Array.from(document.querySelectorAll('button')).find(el=>el.textContent.includes('términos'));const style=getComputedStyle(button);return parseFloat(style.lineHeight)>=parseFloat(style.fontSize);})()`,
    ),
    'Terms text must not overlap at 200%',
  );
  evidence.flow.text200NoHorizontalOverflow = true;
  const zoomShot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  });
  await writeFile(
    new URL('register-text-200-320.png', output),
    Buffer.from(zoomShot.data, 'base64'),
  );
  await evaluate(`document.querySelectorAll('[style]').forEach(el=>el.removeAttribute('style'))`);
  // Native setter + input events exercise React's controlled fields.
  await evaluate(
    `(()=>{const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;for(const [name,value] of Object.entries({fullName:'Diego Martínez',email:'diego@example.test',password:'ficticia-'.repeat(2),confirmPassword:'ficticia-'.repeat(2)})){const input=document.querySelector('[name='+name+']');set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('[type=checkbox]').click();})()`,
  );
  const started = Date.now();
  await evaluate(`document.querySelector('button[type=submit]').click()`);
  await waitFor('location.pathname === "/login" && !!document.querySelector("[role=status]")');
  evidence.flow.successMs = Date.now() - started;
  assert.ok(evidence.flow.successMs < 2000);
  assert.equal(await evaluate('history.state'), null);
  assert.equal(await evaluate('localStorage.length + sessionStorage.length'), 0);
  await navigate('/login');
  assert.equal(await evaluate('!!document.querySelector("[role=status]")'), false);
  await evaluate(`document.querySelector('a[href="/register"]').click()`);
  await waitFor('location.pathname === "/register"');
  assert.equal(await evaluate('document.querySelector("[name=fullName]").value'), '');
  await evaluate(`document.querySelector('a[href="/login"]').click()`);
  await waitFor('location.pathname === "/login"');
  evidence.flow.connectedLinks = true;
  evidence.flow.reloadedNoticeCleared = true;
  assert.equal(
    requests.filter((r) => r.method === 'POST' || r.url.includes('/api/demo/register')).length,
    0,
  );
  evidence.flow.registrationNetworkRequests = 0;
  assert.equal(evidence.axe.flatMap((result) => result.violations).length, 0);
  await writeFile(new URL('results.json', output), JSON.stringify(evidence, null, 2));
  console.log(JSON.stringify(evidence, null, 2));
} finally {
  socket.close();
}
