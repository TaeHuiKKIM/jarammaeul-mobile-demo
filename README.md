# 자람마을 모바일 데모

2026-09-14 원티드 제출 준비용 인터랙티브 프로토타입으로 개선했습니다. AI는 예시 기반 시뮬레이션이며 실제 결제·거래는 없습니다.

## 최신 실행·빌드

- 2026-09-14 후속 개선: 생활감 있는 중고 의류 이미지 교체, 홈/PC 체험 안내·초기화 링크 제거. 상세 기록: `docs/2026-09-14-realistic-clothing.md`.

- 개발: `npx vite --config vite.prototype.config.ts --host 127.0.0.1` → `http://127.0.0.1:3013/prototype.html`
- Vercel용 동일 UI 빌드: `node scripts/build-prototype.mjs` → `vercel-static-v3/index.html`
- Sites/React 앱: `npm run build`
- 핵심 계산 검증: `node --test tests/prototype.test.mjs`
- 타입 검사: `npx tsc --noEmit`
- 화면 소스: `components/market-prototype.tsx`, `app/prototype.css`
- 설계·회귀예방: `docs/2026-09-13-wanted-prototype.md`
- 구버전 `vercel-static/`는 과거 제출용으로 보존하며 새 배포에는 사용하지 않습니다.

## 새 체험 흐름

1. 검색·사이즈 필터·찜으로 옷 탐색
2. 낱개/소묶음 선택과 10% 할인 계산, 상태 동의 후 구매 체험
3. 구매 이력 옷장 반영과 남은 상품 선택 관리
4. 특정 옷 기다림 등록, 판매 알림 도착 체험
5. 예시 사진 분석 → 사이즈/얼룩 확인 → 수정한 판매글 등록
6. 옷장 성장 확인 → 이전 정보 재사용 → 재판매

상태는 현재 브라우저에 저장됩니다. 업로드 이미지는 브라우저 미리보기만 제공하며 실제 AI 인식 결과로 사용하지 않습니다. 홈의 체험 안내·초기화 링크는 제거했습니다.

- 공개 주소: https://jarammaeul-growth-loop.tae1043.chatgpt.site
- Vercel 주소: https://jarammaeul-mobile-demo.vercel.app
- GitHub 저장소: https://github.com/TaeHuiKKIM/jarammaeul-mobile-demo
- 모바일: 전체 화면
- PC: 중앙 휴대폰 프레임
- 서체: 본문 Pretendard · 브랜드명 Jua
- 홈 피드: 생활권 매물 12개와 `정리 → 판매 → 다음 사이즈 기다림` 흐름
- 브랜드 아이콘: 배경 없는 SVG 파비콘과 헤더 심벌
- 내비게이션: 알림·찜·홈·기다림·등록·옷장 선형 SVG 아이콘

## 시연 순서

1. 홈에서 성장꾸러미 선택
2. 상세 화면에서 다음 옷 기다림 확인
3. 하단 등록에서 AI 구조화 결과 확인
4. 판매글 확인 후 등록 완료
5. 옷장에서 다음 순환 확인

모든 상품과 사용자 정보는 화면 흐름을 설명하기 위한 가상 데이터입니다.
