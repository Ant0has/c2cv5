const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
const file = path.join(__dirname, '../shared/lib/html-links-core.ts');
const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020}}).outputText;
const moduleObject = {exports: {}};
vm.runInNewContext(compiled, {exports: moduleObject.exports, module: moduleObject, URL});
const {rewriteAnchorHrefs, resolveHtmlHref} = moduleObject.exports;
const from = '/krasnodar-sochi.html', to = '/mezhgorod/krasnodar/sochi';
const resolver = value => value.startsWith(from) && [undefined, '?', '#'].includes(value[from.length]) ? to + value.slice(from.length) : value;
const rewrite = html => rewriteAnchorHrefs(html, href => resolveHtmlHref(href, resolver));

test('only anchor href bytes change, preserving text, prices, attributes and HTML shape', () => {
  const before = `<p>7 500 ₽ &amp; 190 км</p><a class='go' href="${from}?x=1&amp;y=2#route" data-href="${from}" title='a > b'>Сочи</a><img src="${from}">`;
  assert.equal(rewrite(before), before.replace(`href="${from}?`, `href="${to}?`));
});
test('single/double/unquoted values, whitespace and uppercase anchors', () => {
  const before = `<A HREF = '${from}' title="href='${from}'">a</A><a href=${from}>b</a><a href = "${from}">c</a>`;
  assert.equal(rewrite(before), `<A HREF = '${to}' title="href='${from}'">a</A><a href=${to}>b</a><a href = "${to}">c</a>`);
});
test('comments, script/style/textarea/title and CDATA are not navigation', () => {
  for (const wrap of [s => `<!-- ${s} -->`, s => `<script>let x='${s}'</script>`, s => `<style>/* ${s} */</style>`, s => `<textarea>${s}</textarea>`, s => `<title>${s}</title>`, s => `<![CDATA[${s}]]>`]) {
    const before = wrap(`<a href="${from}">literal</a>`) + `<a href="${from}">real</a>`;
    assert.equal(rewrite(before), wrap(`<a href="${from}">literal</a>`) + `<a href="${to}">real</a>`);
  }
});
test('external, lookalike hosts, fragment, email, phone, JavaScript and unmatched paths unchanged', () => {
  for (const href of ['https://other.example' + from, 'https://city2city.ru.other.example' + from,
    'https://city2city.ru@other.example' + from, '/unmigrated.html', '#order', 'tel:+70000000000',
    'mailto:hello@example.com', 'javascript:void(0)', 'krasnodar-sochi.html', '/krasnodar-sochi.html-extra']) {
    const html = `<a href="${href}">x</a>`; assert.equal(rewrite(html), html);
  }
});
test('explicit same-site absolute and protocol-relative links resolve to final HTTPS path', () => {
  for (const prefix of ['https://city2city.ru', 'http://city2city.ru', '//city2city.ru']) {
    assert.equal(rewrite(`<a href="${prefix}${from}">x</a>`), `<a href="https://city2city.ru${to}">x</a>`);
  }
});
test('unknown HTML and text unchanged, processing idempotent', () => {
  const html = `<a data-href="${from}">no href</a><abbr title="${from}">a</abbr><p>${from}</p>`;
  assert.equal(rewrite(html), html);
  const changed = rewrite(`<a href="${from}">x</a>`); assert.equal(rewrite(changed), changed);
});
test('anchor-looking strings in other element attributes are not actual links', () => {
  const literal = `<div data-template="<a href='${from}'>x</a>">`;
  const before = literal + `<a href="${from}">real</a></div>`;
  assert.equal(rewrite(before), literal + `<a href="${to}">real</a></div>`);
});
test('declarations, end tags and malformed outer markup are consumed before looking for links', () => {
  const fake = `<a href='${from}'>literal</a>`;
  for (const inert of [`<!DOCTYPE html SYSTEM "${fake}">`, `<!bogus "${fake}">`, `<?xml data="${fake}"?>`, `</div data-template="${fake}">`]) {
    assert.equal(rewrite(inert + `<a href="${from}">real</a>`), inert + `<a href="${to}">real</a>`);
  }
  const malformed = `<div data-template="${fake}`;
  assert.equal(rewrite(malformed), malformed);
});
test('unterminated raw content is kept verbatim', () => {
  for (const prefix of ['<!--', '<script>', '<textarea>', '<![CDATA[']) {
    const html = prefix + `<a href="${from}">x</a>`; assert.equal(rewrite(html), html);
  }
});
