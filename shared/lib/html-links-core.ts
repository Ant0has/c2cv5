/**
 * Patch only anchor href values; preserve every other byte of the existing HTML.
 * This is not an HTML sanitizer. Comments and raw-text elements must remain inert.
 */
export function rewriteAnchorHrefs(html: string, resolveHref: (href: string) => string): string {
  const space = (char: string) => /[\t\n\f\r ]/.test(char);
  const patchAnchor = (tag: string) => {
    const changes: Array<{start: number; end: number; value: string}> = [];
    let offset = 2;
    while (offset < tag.length - 1) {
      while (space(tag[offset])) offset++;
      if (tag[offset] === '>' || tag.slice(offset) === '/>') break;
      const nameStart = offset;
      while (offset < tag.length && !/[\t\n\f\r /=>"'<]/.test(tag[offset])) offset++;
      if (offset === nameStart) return tag;
      const name = tag.slice(nameStart, offset);
      while (space(tag[offset])) offset++;
      if (tag[offset] !== '=') continue;
      offset++; while (space(tag[offset])) offset++;
      const quote = tag[offset] === '"' || tag[offset] === "'" ? tag[offset++] : '';
      const start = offset;
      if (quote) {
        while (offset < tag.length && tag[offset] !== quote) offset++;
        if (offset === tag.length) return tag;
      } else {
        while (offset < tag.length && !/[\t\n\f\r >]/.test(tag[offset])) {
          if (/["'<=`]/.test(tag[offset])) return tag;
          offset++;
        }
        if (offset === start) return tag;
      }
      const end = offset;
      if (quote) offset++;
      if (name.toLowerCase() === 'href') {
        const value = resolveHref(tag.slice(start, end));
        if (value !== tag.slice(start, end)) changes.push({start, end, value});
      }
    }
    for (const change of changes.reverse()) tag = tag.slice(0, change.start) + change.value + tag.slice(change.end);
    return tag;
  };
  // Consume markup sequentially. Never resume searching inside a declaration,
  // end tag or an unterminated quoted attribute for anchor-looking substrings.
  let cursor = 0, result = '';
  while (cursor < html.length) {
    const start = html.indexOf('<', cursor);
    if (start === -1) return result + html.slice(cursor);
    result += html.slice(cursor, start);
    if (html.startsWith('<!--', start) || html.startsWith('<![CDATA[', start)) {
      const terminator = html.startsWith('<!--', start) ? '-->' : ']]>';
      const close = html.indexOf(terminator, start + 4);
      if (close === -1) return result + html.slice(start);
      cursor = close + terminator.length; result += html.slice(start, cursor); continue;
    }
    const opening = html.slice(start).match(/^<([a-z][a-z0-9:-]*)(?=[\t\n\f\r />])/i);
    if (!opening && !/^<\/?[a-z]|^<[!?]/i.test(html.slice(start, start + 4))) {
      result += '<'; cursor = start + 1; continue;
    }
    const doctype = /^<!doctype\b/i.test(html.slice(start, start + 12));
    let quote = '', brackets = 0, end = start + 1;
    for (; end < html.length; end++) {
      const char = html[end];
      if (quote) { if (char === quote) quote = ''; continue; }
      if (char === '"' || char === "'") { quote = char; continue; }
      if (doctype && char === '[') brackets++;
      else if (doctype && char === ']') brackets = Math.max(0, brackets - 1);
      else if (char === '>' && brackets === 0) break;
    }
    if (end === html.length) return result + html.slice(start);
    cursor = end + 1;
    const tag = html.slice(start, cursor), name = opening?.[1].toLowerCase();
    result += name === 'a' ? patchAnchor(tag) : tag;
    if (name === 'plaintext') return result + html.slice(cursor);
    if (name && /^(script|style|textarea|title|xmp|iframe|noembed|noframes)$/.test(name)) {
      const closing = new RegExp(`</${name}(?=[\\t\\n\\f\\r />])`, 'gi'); closing.lastIndex = cursor;
      const found = closing.exec(html);
      if (!found) return result + html.slice(cursor);
      // HTML5 script double-escaped state is ambiguous to this small scanner.
      // Leave the rest untouched instead of interpreting a nested script string as markup.
      if (name === 'script' && /<!--[\s\S]*<script(?=[\t\n\f\r />])/i.test(html.slice(cursor, found.index))) {
        return result + html.slice(cursor);
      }
      result += html.slice(cursor, found.index); cursor = found.index;
    }
  }
  return result;
}

/** Only site-root paths and explicit same-site URLs are eligible; no guessed slug migrations. */
export function resolveHtmlHref(href: string, resolvePath: (path: string) => string): string {
  if (href.startsWith('/') && !href.startsWith('//')) return resolvePath(href);
  const absolute = href.match(/^(https?:\/\/city2city\.ru|\/\/city2city\.ru)(\/[^\s]*)$/i);
  if (!absolute) return href;
  const path = absolute[2];
  const resolved = resolvePath(path);
  return resolved === path ? href : `https://city2city.ru${resolved}`;
}
