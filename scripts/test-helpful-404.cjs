const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
let count = 0;
const ok = (v, m) => { assert(v, m); count++; };
for (const file of ['app/(root)/404/page.tsx', 'app/(root)/not-found.tsx', 'app/not-found.tsx', 'middleware.ts', 'pages-list/not-found/NotFound.tsx']) {
  const result = ts.transpileModule(read(file), { fileName: file, reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  ok(!(result.diagnostics || []).some(d => d.category === ts.DiagnosticCategory.Error), 'TSX syntax: ' + file);
}
const page = read('pages-list/not-found/NotFound.tsx');
ok(page.includes('ssr: false') && page.includes('{trip && <section'), 'Constructor only after submit');
ok(page.includes('maxLength={160}') && page.includes('required'), 'Bounded required fields');
ok(page.includes('normalized(points.from) === normalized(points.to)'), 'Reject identical points');
ok(page.includes('<noscript>') && page.includes('constructor_fallback_phone'), 'No-JS and service fallback');
ok(!/localStorage|sessionStorage|location\.search|location\.pathname/.test(page), 'No address or unknown-URL persistence');
ok(!/weather|Погода|fetch\(/.test(page), 'No weather or eager external request');
ok(page.includes('prefetch={false}'), 'No eager route prefetch');
ok(!fs.existsSync(path.join(root, 'app/(root)/loading.tsx')), 'No early group loading screen masking missing routes');
const source = ts.transpileModule(read('middleware.ts'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
const whitelist = JSON.parse(read('whitelist.json'));
const context = { exports: {}, URL, URLSearchParams, require: name => {
  if (name === 'next/server') return { NextResponse: { next: options => ({ kind: 'next', ...options }), redirect: (url, status) => ({ kind: 'redirect', url: url.pathname, status }), rewrite: (url, options) => ({ kind: 'rewrite', url: url.pathname, ...options }) } };
  if (name === './whitelist.json') return whitelist;
  throw Error('Unexpected import: ' + name);
} };
vm.runInNewContext(source, context);
const check = p => context.exports.middleware({ url: 'https://city2city.ru' + p, nextUrl: new URL('https://city2city.ru' + p) });
for (const p of ['/', '/napravleniya', '/napravleniya/sheregesh', '/rostov-novomoskovsk.html', '/images/404-road-city2city-v1.webp']) {
  const r = check(p); ok(r.kind === 'next' && !r.status, 'Valid path unchanged: ' + p);
}
ok(check('/404').status === 404, 'Explicit 404 status without self-proxy');
for (const p of ['/napravleniya/c2c-check-missing', '/no-such-page.html']) {
  const r = check(p); ok(r.kind === 'next' && r.status === 404, 'Local 404 without self-proxy: ' + p);
}
for (const p of ['/napravleniya/c2c-check-missing', '/no-such-page.html']) {
  const r = context.exports.middleware({ url: 'https://localhost:3023' + p, nextUrl: new URL('https://localhost:3023' + p) });
  ok(r.kind === 'next' && r.status === 404 && !r.url, 'HTTPS proxy headers cannot trigger a self-proxy: ' + p);
}
for (const p of ['/taxi777-mezhgorod-moscow.html', '/rostov-novomoskovsk']) {
  const r = check(p); ok(r.kind === 'redirect' && r.status === 301, 'Legacy redirect: ' + p);
}
console.log(`${count} helpful-404 source checks passed`);
