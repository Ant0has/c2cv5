const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const { test } = require('node:test')
const ts = require('typescript')

const root = path.join(__dirname, '..')
const baseline = path.join(root, '../baseline-front')
const read = (file, base = root) => fs.readFileSync(path.join(base, file), 'utf8')

// Execute local source with the installed compiler only; no environment files, network or builds.
function createLoader(overrides = {}) {
  const cache = new Map()
  function load(file) {
    const absolute = path.isAbsolute(file) ? file : path.join(root, file)
    const filename = [absolute, `${absolute}.ts`, `${absolute}.tsx`, `${absolute}.json`, path.join(absolute, 'index.ts')]
      .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
    assert.ok(filename, `Missing local module: ${file}`)
    if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'))
    if (cache.has(filename)) return cache.get(filename).exports
    const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    })
    const loaded = new Module(filename, module)
    loaded.filename = filename
    loaded.paths = Module._nodeModulePaths(path.dirname(filename))
    loaded.require = request => {
      if (Object.hasOwn(overrides, request)) return overrides[request]
      if (/\.s?css$/.test(request)) return {}
      if (request.startsWith('@/')) return load(path.join(root, request.slice(2)))
      if (request.startsWith('.')) return load(path.resolve(path.dirname(filename), request))
      return require(request)
    }
    cache.set(filename, loaded)
    loaded._compile(compiled.outputText, filename)
    return loaded.exports
  }
  return load
}

const load = createLoader()
const { routeToUrl, cityRouteToUrl, uniqueRouteLinks, resolveVerifiedRoutePath } = load('shared/lib/route-url.ts')
const { resolveRoutePath } = load('shared/lib/route-url-core.ts')
const { resolvePublicRoutePath } = load('shared/lib/public-route-url.ts')
const full = require('../shared/data/verified-route-redirects.json')
const client = require('../shared/data/public-route-redirects.json')
const { collectPublicPaths, generatePublicManifest } = require('../scripts/generate-public-route-redirects.cjs')

test('every approved href resolves exactly to a stable local target, never a guessed canonical', () => {
  assert.equal(Object.keys(full.redirects).length, 4590)
  for (const [source, target] of Object.entries(full.redirects)) {
    assert.match(source, /^\/(?!\/)/)
    assert.match(target, /^\/(?!\/)/)
    assert.doesNotMatch(target, /[?#\s\\]/)
    assert.notEqual(source, target, source)
    assert.equal(resolveVerifiedRoutePath(source), target, source)
    assert.equal(resolveVerifiedRoutePath(target), target, `Stable target: ${source}`)
  }
  const approved = JSON.parse(fs.readFileSync(path.join(root, '../url-map/proposed-exact-href-map.json'), 'utf8'))
  assert.deepEqual(full, approved)
})

test('client subset is reproducible, small and agrees with the full map for every included path', () => {
  assert.deepEqual(client, generatePublicManifest(root))
  for (const source of collectPublicPaths(root, full.redirects)) {
    assert.equal(resolvePublicRoutePath(source), resolveVerifiedRoutePath(source), source)
  }
  assert.ok(Object.keys(client.redirects).length < Object.keys(full.redirects).length / 5)
  assert.ok(fs.statSync(path.join(root, 'shared/data/public-route-redirects.json')).size < 50000)
})

test('the four observed main-text routes and ordinary static cards have exact navigation targets', () => {
  for (const slug of ['krasnodar-novorossijsk', 'krasnodar-sochi', 'krasnodar-majkop', 'krasnodar-simferopol']) {
    assert.equal(routeToUrl(slug), full.redirects[`/${slug}.html`])
    assert.equal(routeToUrl(slug).startsWith('/mezhgorod/'), true)
  }
  assert.equal(routeToUrl('krasnodar-anapa'), '/mezhgorod/krasnodar/anapa')
  assert.equal(resolvePublicRoutePath('/krasnodar-anapa.html'), '/mezhgorod/krasnodar/anapa')
})

test('unknown routes preserve their prior representation and identifiers', () => {
  assert.equal(routeToUrl('unknown-city-unknown-destination'), '/unknown-city-unknown-destination.html')
  assert.equal(cityRouteToUrl('kazan', 'kazan-unreviewed-destination'), '/mezhgorod/kazan/unreviewed-destination')
  assert.equal(cityRouteToUrl('kazan', 'other-unreviewed-destination'), '/other-unreviewed-destination.html')
  assert.equal(routeToUrl('other-unreviewed-destination', '/caller-existing-path'), '/caller-existing-path')
})

test('exact resolver retains query/hash and leaves external, malformed and cyclic mappings unchanged', () => {
  const redirects = { '/old.html': '/middle', '/middle': '/final' }
  assert.equal(resolveRoutePath('/old.html?source=internal#order', redirects), '/final?source=internal#order')
  for (const untouched of ['https://city2city.ru/old.html', '//example.com/old.html', '#order', 'old.html', '/OLD.html']) {
    assert.equal(resolveRoutePath(untouched, redirects), untouched)
  }
  assert.equal(resolveRoutePath('/old.html', { '/old.html': '/loop', '/loop': '/old.html' }), '/old.html')
  for (const target of ['//evil.example', 'https://evil.example', '/final?extra=1', '/final#x', '/bad path', '/bad\\path']) {
    assert.equal(resolveRoutePath('/old.html', { '/old.html': target }), '/old.html')
  }
})

test('server list deduplicates final hrefs without mutating route records or labels', () => {
  const routes = [{ url: 'krasnodar-anapa', title: 'Анапа' }, { url: 'krasnodar-anapa', title: 'Повтор' }, { url: 'unknown-city-unknown-destination', title: 'Другой маршрут' }]
  const original = JSON.stringify(routes)
  assert.deepEqual(uniqueRouteLinks(routes).map(r => [r.href, r.title]), [['/mezhgorod/krasnodar/anapa', 'Анапа'], ['/unknown-city-unknown-destination.html', 'Другой маршрут']])
  assert.equal(uniqueRouteLinks(routes, '/krasnodar-anapa.html').length, 1)
  assert.equal(JSON.stringify(routes), original)
  const ServerRouteLinks = load('shared/components/ServerRouteLinks/ServerRouteLinks.tsx').default
  const html = require('react-dom/server').renderToStaticMarkup(ServerRouteLinks({ routes, heading: 'Маршруты' }))
  assert.match(html, /href="\/mezhgorod\/krasnodar\/anapa"/)
  assert.equal((html.match(/href=/g) || []).length, 2)
  assert.doesNotMatch(html, /href="\/krasnodar-anapa\.html"/)
})

test('existing city hierarchy wins over a different legacy redirect: October price conflict', () => {
  const slug = 'krasnodar-oktyabrskij-7'
  const existing = '/mezhgorod/krasnodar/oktyabrskij-7'
  const legacyFinal = '/mezhgorod/krasnodar/oktyabrskij'
  assert.equal(full.redirects[`/${slug}.html`], legacyFinal)
  assert.equal(Object.hasOwn(full.redirects, existing), false)
  assert.equal(routeToUrl(slug), legacyFinal, 'Existing legacy href still follows its confirmed301')
  assert.equal(routeToUrl(slug, existing), existing, 'Do not substitute a different source URL for lookup')
  const records = [
    { url: slug, title: 'Такси Краснодар Октябрьский', price_economy: 23500 },
    { url: 'krasnodar-oktyabrskij', title: 'Такси Краснодар Октябрьский', price_economy: 123000 },
  ]
  const before = JSON.stringify(records)
  assert.deepEqual(records.map(route => ({href: cityRouteToUrl('krasnodar', route.url), price: route.price_economy})), [
    {href: existing, price: 23500}, {href: legacyFinal, price: 123000},
  ])
  assert.equal(JSON.stringify(records), before)
  const renderLoader = createLoader({'next/image': () => null, '@/pages-list/region-hubs/ui/OrderButton': () => null})
  const CityPage = renderLoader('pages-list/mezhgorod-city/ui/MezhgorodCityHubPage.tsx').default
  const html = require('react-dom/server').renderToStaticMarkup(CityPage({
    city: {slug: 'krasnodar', name: 'Краснодар', nameGenitive: 'из Краснодара', nameLocative: 'в Краснодаре', foShortName: 'ЮФО'},
    data: {routes: records.map((route, index) => ({...route, ID: index + 1, distance_km: null})), totalCount: 2, minPrice: 23500},
    neighborCities: [],
  }))
  assert.match(html, /href="\/mezhgorod\/krasnodar\/oktyabrskij-7"/)
  assert.match(html, /href="\/mezhgorod\/krasnodar\/oktyabrskij"/)
  assert.match(html.replace(/[\s\u00a0\u202f]+/g, ''), /23500₽/)
  assert.match(html.replace(/[\s\u00a0\u202f]+/g, ''), /123000₽/)
})

test('an existing city hierarchy resolves only its own exact map entry, never synthetic legacy lookup', () => {
  const exactSource = '/mezhgorod/kazan/reviewed'
  const exactTarget = '/mezhgorod/kazan/exact-final'
  const custom = createLoader({'../data/verified-route-redirects.json': {redirects: {
    [exactSource]: exactTarget,
    '/kazan-reviewed.html': '/mezhgorod/kazan/different-legacy-final',
    '/kazan-unreviewed.html': '/mezhgorod/kazan/legacy-only-final',
  }}})('shared/lib/route-url.ts')
  assert.equal(custom.cityRouteToUrl('kazan', 'kazan-reviewed'), exactTarget)
  assert.equal(custom.cityRouteToUrl('kazan', 'kazan-unreviewed'), '/mezhgorod/kazan/unreviewed')
  assert.equal(custom.routeToUrl('kazan-reviewed'), '/mezhgorod/kazan/different-legacy-final')
})

function namedNode(source, name) {
  const parsed = ts.createSourceFile('source.tsx', source, ts.ScriptTarget.Latest, true)
  let found
  function visit(node) {
    if ((ts.isFunctionDeclaration(node) || ts.isVariableDeclaration(node)) && node.name?.getText(parsed) === name) found = node.getText(parsed)
    ts.forEachChild(node, visit)
  }
  visit(parsed)
  assert.ok(found, `Missing named source declaration: ${name}`)
  return found
}

test('metadata/robots/middleware and calculator data are unchanged by the link-only delivery', () => {
  for (const file of ['middleware.ts', 'whitelist.json', 'package.json', 'package-lock.json', 'shared/data/excludes-page.ts', 'pages-list/mezhgorod-root/config/content.ts', 'pages-list/region-hubs/config/registry.ts', 'feature/calculator/ui/calculator-default/CalculatorDefault.tsx', 'pages-list/home/ui/Price/Price.tsx']) {
    assert.equal(read(file), read(file, baseline), file)
  }
  for (const file of ['app/(root)/[region]/page.tsx', 'app/(root)/mezhgorod/[city]/[dest]/page.tsx', 'app/(root)/mezhgorod/page.tsx']) {
    assert.equal(namedNode(read(file), 'generateMetadata'), namedNode(read(file, baseline), 'generateMetadata'), file)
  }
  assert.equal(namedNode(read('pages-list/home/ui/PopularDirections/PopularDirections.tsx'), 'DIRECTIONS'), namedNode(read('pages-list/home/ui/PopularDirections/PopularDirections.tsx', baseline), 'DIRECTIONS'))
  const city = read('pages-list/mezhgorod-city/ui/MezhgorodCityHubPage.tsx')
  assert.match(city, /allRoutes\.filter\(r => r\.url\.startsWith\(`\$\{city\.slug\}-`\)\)/)
  assert.doesNotMatch(city, /cityToDbSlug|dbCitySlug/)
  assert.doesNotMatch(read('shared/lib/route-url.ts'), /routeCanonicalPath|routeRobots|buildRouteSeoText/)
})

test('breadcrumb schema changes navigation URL only and resolves reviewed legacy city aliases', () => {
  const fresh = createLoader()
  const { generateRouteBreadcrumbSchema } = fresh('shared/services/seo-utils.ts')
  const old = createLoader({ '../lib/public-route-url': { resolvePublicRoutePath: value => value } })('shared/services/seo-utils.ts')
  const data = { url: 'krasnodar-anapa', title: 'Такси Краснодар Анапа', city_seo_data: 'из Краснодара,в Анапу', regions_data: { url: 'taxi777-mezhgorod-moscow' } }
  const result = generateRouteBreadcrumbSchema(data)
  const unchanged = old.generateRouteBreadcrumbSchema(data)
  const expected = full.redirects['/taxi777-mezhgorod-moscow.html']
  assert.ok(expected)
  assert.equal(new URL(result.itemListElement[1].item).pathname, expected)
  result.itemListElement[1].item = unchanged.itemListElement[1].item
  assert.deepEqual(result, unchanged)
})

test('full map cannot be reached through any local client import graph', () => {
  const roots = ['app', 'shared', 'entities', 'pages-list', 'feature', 'widgets']
  function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(dir, e.name)] : []) }
  const sources = roots.flatMap(dir => files(path.join(root, dir)))
  const edges = new Map(), clients = []
  function resolve(from, request) {
    const base = request.startsWith('@/') ? path.join(root, request.slice(2)) : request.startsWith('.') ? path.resolve(path.dirname(from), request) : null
    return base && [base, `${base}.ts`, `${base}.tsx`, `${base}.json`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')].find(f => fs.existsSync(f) && fs.statSync(f).isFile())
  }
  for (const file of sources) {
    const parsed = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
    if (parsed.statements.some(n => ts.isExpressionStatement(n) && ts.isStringLiteral(n.expression) && n.expression.text === 'use client')) clients.push(file)
    const refs = []
    function visit(node) {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && !node.isTypeOnly && !node.importClause?.isTypeOnly) refs.push(node.moduleSpecifier.text)
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteralLike(node.arguments[0])) refs.push(node.arguments[0].text)
      ts.forEachChild(node, visit)
    }
    visit(parsed)
    edges.set(file, refs.map(request => resolve(file, request)).filter(Boolean))
  }
  const forbidden = path.join(root, 'shared/data/verified-route-redirects.json')
  for (const clientRoot of clients) {
    const queue = [[clientRoot]], seen = new Set()
    while (queue.length) {
      const chain = queue.pop(), file = chain.at(-1)
      assert.notEqual(file, forbidden, chain.map(p => path.relative(root, p)).join(' -> '))
      if (seen.has(file)) continue
      seen.add(file)
      for (const next of edges.get(file) || []) queue.push([...chain, next])
    }
  }
})
