#!/usr/bin/env node
/**
 * Best-effort check for potential raw strings in TSX (no i18n).
 * Looks for JSX text nodes that look like literal text (e.g. >Label<).
 * May have false positives (e.g. >{variable}< or numeric content).
 * Run: npm run i18n:check
 */
import { readFileSync, readdirSync } from 'fs';
import { join, relative } from 'path';

const srcDir = join(process.cwd(), 'src');
const ext = ['.tsx'];

function* walk(dir, base = '') {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') {
      yield* walk(join(dir, e.name), rel);
    } else if (e.isFile() && ext.some((x) => e.name.endsWith(x))) {
      yield { path: join(dir, e.name), rel };
    }
  }
}

// Match "> " or ">\n" followed by letters (Latin/Cyrillic) — possible raw text node
const rawTextRe = />\s*[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё0-9\s.,!?:;-]*</g;
const excludeRe = /^\s*\{/; // exclude { t('...') } etc.

const results = [];
for (const { path: filePath, rel } of walk(srcDir)) {
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    const lineNum = i + 1;
    let m;
    rawTextRe.lastIndex = 0;
    while ((m = rawTextRe.exec(line)) !== null) {
      const snippet = m[0].slice(0, 50);
      if (excludeRe.test(m[0])) continue;
      results.push({ file: rel, line: lineNum, snippet });
    }
  });
}

if (results.length > 0) {
  console.log('Potential raw strings in TSX (review manually):');
  results.forEach((r) => console.log(`  ${r.file}:${r.line}  ${r.snippet}`));
  process.exit(1);
}
console.log('No obvious raw strings found.');
