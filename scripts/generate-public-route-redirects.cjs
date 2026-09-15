const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')

const root = path.join(__dirname, '..')
const sourceRoots = ['app', 'shared', 'entities', 'pages-list', 'feature', 'widgets']

function sourceFiles(directory) {
  if (!fs.existsSync(directory)) return []
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name)
    return entry.isDirectory() ? sourceFiles(filename) : /\.(ts|tsx)$/.test(filename) ? [filename] : []
  })
}

function finalPath(source, redirects) {
  const seen = new Set()
  let current = source
  while (Object.hasOwn(redirects, current)) {
    if (seen.has(current)) throw new Error(`Cycle in verified navigation map at ${source}`)
    seen.add(current)
    const target = redirects[current]
    if (typeof target !== 'string' || !/^\/(?!\/)/.test(target) || /[?#\s\\]/.test(target)) {
      throw new Error(`Invalid verified navigation target at ${source}`)
    }
    current = target
  }
  return current
}

function collectPublicPaths(projectRoot, redirects) {
  const used = new Set()
  for (const file of sourceRoots.flatMap(directory => sourceFiles(path.join(projectRoot, directory)))) {
    const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
    function visit(node) {
      // Static JSX/config/call arguments only; never evaluate source or infer a route from a city prefix.
      if (ts.isStringLiteralLike(node) && /^\/(?!\/)/.test(node.text)) {
        used.add(node.text.split(/[?#]/, 1)[0])
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
  // Client city navigation and the shared breadcrumb schema receive city identifiers dynamically.
  // Include only exact reviewed aliases whose final destination is an existing city hub, not all routes.
  for (const source of Object.keys(redirects)) {
    if (/^\/mezhgorod\/[^/]+$/.test(finalPath(source, redirects))) used.add(source)
  }
  return used
}

function generatePublicManifest(projectRoot = root) {
  const full = JSON.parse(fs.readFileSync(path.join(projectRoot, 'shared/data/verified-route-redirects.json'), 'utf8'))
  const used = collectPublicPaths(projectRoot, full.redirects)
  const redirects = {}
  for (const source of [...used].sort()) {
    const target = finalPath(source, full.redirects)
    if (target !== source) redirects[source] = target
  }
  return {
    source: 'Exact subset of the reviewed redirect map: static source paths and dynamic city-hub navigation only',
    redirects,
  }
}

if (require.main === module) {
  const output = generatePublicManifest()
  fs.writeFileSync(path.join(root, 'shared/data/public-route-redirects.json'), `${JSON.stringify(output, null, 2)}\n`)
  console.log(`Public navigation manifest: ${Object.keys(output.redirects).length} exact mappings`)
}

module.exports = { collectPublicPaths, generatePublicManifest, finalPath }
