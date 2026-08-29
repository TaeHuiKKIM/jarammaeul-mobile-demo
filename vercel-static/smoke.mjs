import assert from 'node:assert/strict';
import fs from 'node:fs';

for (const file of ['index.html', 'styles.css', 'app.js']) {
  assert.ok(fs.existsSync(new URL(file, import.meta.url)), `Missing ${file}`);
}

const html = fs.readFileSync(new URL('index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('styles.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('app.js', import.meta.url), 'utf8');

for (const route of ['home', 'detail', 'sell', 'review', 'waitlist', 'closet']) {
  assert.ok(app.includes(`'${route}'`), `Missing route ${route}`);
}
for (const copy of ['자람마을', '성장꾸러미', '사진에서 정보를 읽었어요', '다음 옷 기다림', '내 옷장']) {
  assert.ok(app.includes(copy) || html.includes(copy), `Missing copy ${copy}`);
}
assert.ok(css.includes('Pretendard'));
assert.ok(css.includes('Jua'));
assert.ok(css.includes('.visual-12'));
assert.ok(css.includes('.phone-shell'));
assert.ok(css.includes('@media (max-width: 767px)'));
assert.ok(!app.includes('Sparkles'));
assert.ok(!app.includes('새 글'));
assert.ok(app.includes('cycle-flow'));
assert.ok(app.includes("['100호 여름 상하의 4벌'"));
assert.ok(html.includes('favicon.svg'));
assert.ok(html.includes('viewport'));

console.log('vercel-static smoke: pass');
