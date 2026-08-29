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
  'public/favicon.svg',
  'public/product-sprite.png',
  'public/product-sprite-2.png',
]) {
  assert.ok(fs.existsSync(path.join(root, file)), `Missing ${file}`);
  assert.ok(fs.statSync(path.join(root, file)).size > 0, `Empty ${file}`);
}

for (const token of [
  '--brand-green',
  '--brand-orange',
  'Pretendard',
  'Jua',
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
  '사진에서 정보를 읽었어요',
  '내 옷장',
]) {
  assert.ok(page.includes(copy), `Missing product copy: ${copy}`);
}

assert.ok(layout.includes("lang=\"ko\""), 'Root language must be Korean');
assert.ok(layout.includes('자람마을'), 'Metadata title must include brand');
assert.ok(page.includes('const newListingProduct'), 'New listing must not depend on filtered results');
assert.ok(page.includes("id: 12"), 'Home feed must include twelve distinct listings');
assert.ok(page.includes('cycle-flow'), 'Home must make the growth loop visible');
assert.ok(!page.includes('방금 등록'), 'Recent listing must use quiet metadata instead of a badge');
assert.ok(page.includes('function ProductVisual'), 'Generated product visual component is required');
assert.ok(!page.includes('Sparkles'), 'Decorative star icon must be removed');
assert.ok(css.includes('.product-visual'), 'Generated product sprite styles are required');
assert.ok(css.includes('.visual-12'), 'Second product sprite must expose all six new visuals');
assert.ok(css.includes("font-family: 'Jua'"), 'Wordmark must use a rounded Korean display face');
assert.ok(layout.includes('/favicon.svg'), 'Transparent favicon must be wired into metadata');
for (const forbidden of ['시연용 예시', '실제 AI 호출 없음', '92% 확신', 'AI 제안', 'AI가 정리한 정보']) {
  assert.ok(!page.includes(forbidden), `Remove synthetic copy: ${forbidden}`);
}
assert.ok(page.includes('사진에서 읽은 정보'), 'Photo extraction copy is required');
assert.ok(page.includes('확인 필요 1개'), 'Human review cue is required');
assert.equal(hosting.d1, null);
assert.equal(hosting.r2, null);

console.log('smoke: pass');
