import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const page = read('app/page.tsx');
const css = read('app/globals.css');
const layout = read('app/layout.tsx');
const hosting = JSON.parse(read('.openai/hosting.json'));

for (const file of [
  'public/jarammaeul-logo.png',
  'public/jarammaeul-symbol.png',
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing ${file}`);
  assert.ok(fs.statSync(path.join(root, file)).size > 0, `Empty ${file}`);
}

for (const token of [
  '--brand-green',
  '--brand-orange',
  '.phone-shell',
  '@media (max-width: 767px)',
  'overflow-y: auto',
]) {
  assert.ok(css.includes(token), `Missing CSS token: ${token}`);
}

for (const route of ['home', 'detail', 'sell', 'review', 'waitlist', 'closet']) {
  assert.ok(page.includes(`'${route}'`), `Missing route: ${route}`);
}

for (const copy of [
  '자람마을',
  '대구 북구 · 생활권',
  '성장꾸러미',
  '다음 옷 기다림',
  'AI가 사진을 정리했어요',
  '시연용 예시',
  '내 옷장',
]) {
  assert.ok(page.includes(copy), `Missing product copy: ${copy}`);
}

assert.ok(layout.includes("lang=\"ko\""), 'Root language must be Korean');
assert.ok(layout.includes('자람마을'), 'Metadata title must include brand');
assert.ok(page.includes('const newListingProduct'), 'New listing must not depend on filtered results');
assert.equal(hosting.d1, null);
assert.equal(hosting.r2, null);

console.log('smoke: pass');
