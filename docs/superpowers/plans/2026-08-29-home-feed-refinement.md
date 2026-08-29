# Home Feed Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 자람마을 홈에서 12개 매물과 성장순환 흐름을 자연스럽게 보여주고 브랜드 서체·파비콘을 정리한다.

**Architecture:** 기존 단일 React 화면과 Vercel 정적 미러를 함께 수정한다. 두 개의 3×2 이미지 스프라이트를 CSS 위치값으로 재사용하고, 별도 서버나 저장소는 추가하지 않는다.

**Tech Stack:** Vinext, React, TypeScript, CSS, vanilla JavaScript, Node smoke tests

## Global Constraints

- 민감정보와 `.env` 파일은 커밋하지 않는다.
- 기존 공개 URL과 해시 기반 시연 흐름을 유지한다.
- 본문 Pretendard, 워드마크 Jua를 사용한다.

---

### Task 1: 화면 계약 추가

**Files:** `tests/smoke.mjs`, `vercel-static/smoke.mjs`

- [ ] 투명 파비콘, 두 번째 스프라이트, 12개 매물, 성장순환, Jua 워드마크를 요구하는 테스트를 작성한다.
- [ ] `node tests/smoke.mjs`와 `node vercel-static/smoke.mjs`가 새 요구사항 때문에 실패하는지 확인한다.

### Task 2: React/Sites 화면 구현

**Files:** `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `public/*`

- [ ] 새 자산을 복사하고 12개 상품 데이터 및 스프라이트 위치를 추가한다.
- [ ] 새 글 배지를 상태점 메타데이터로 바꾸고 성장순환 줄을 추가한다.
- [ ] 워드마크 전용 Jua와 투명 파비콘을 연결한다.
- [ ] smoke test와 `pnpm build`를 통과시킨다.

### Task 3: Vercel 정적 미러 및 문서

**Files:** `vercel-static/index.html`, `vercel-static/app.js`, `vercel-static/styles.css`, `README.md`

- [ ] React 버전과 같은 12개 데이터·성장순환·서체·파비콘을 적용한다.
- [ ] 정적 smoke test를 통과시키고 README에 디자인 변경점을 기록한다.

### Task 4: 공개 배포 검증

- [ ] GitHub main에 소스를 푸시한다.
- [ ] Sites와 Vercel 프로덕션에 새 버전을 배포한다.
- [ ] 두 공개 주소에서 홈, 등록 완료, 흐름 표시, 12개 상품, 파비콘을 확인한다.
