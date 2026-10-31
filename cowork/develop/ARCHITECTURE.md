# ARCHITECTURE — 로미원 프론트엔드 설계 (초안, 사용자 검토 대기)

기준: PRD `LM-PRD-00/01` **v1.1**, 디자인 시안 **v0.2** (`../design/DESIGN-SPEC.md`), 결정 `DECISIONS.md` DEV-1~12.
이 문서는 "어떻게 만들지"의 뼈대다. 상세 API는 `openapi` 작성 단계에서, 구현 순서는 `ROADMAP.md`에서 다룬다.

## 1. 큰 그림
```
브라우저 ── (CORS 직접 호출, DEV-6) ──▶ 백엔드(별도, 사용자 구현)
  │  Next.js 16 (Vercel)
  │   ├ 랜딩 /, /meet, /meet/for/*, /about, /legal/*  → 정적(SSG)
  │   ├ /m/[id]  → 껍데기 정적 + 데이터 CSR(SWR 폴링) + generateMetadata/OG는 서버가 백엔드 "공개 요약" 호출(DEV-10)
  │   └ /my, /meet/new → CSR
  └ localStorage: 총무 키, 응답자(기기) 토큰, 내 모임 목록
```
- 서버 상태의 원천은 백엔드. 프론트는 캐시(SWR)와 낙관적 업데이트(DEV-9)만 가진다.
- 추천·히트맵 계산은 프론트 순수 함수(DEV-8).

## 2. 모노레포 구조 (pnpm + Turborepo, 스코프 `@lomeone/*`)
```
apps/web/                  Next.js 16 앱
packages/core/             순수 도메인 로직 — 타입, 슬롯 모델, 추천, 히트맵, 뷰 결정, 날짜/ics
packages/api/              OpenAPI 스펙(openapi.yaml) + 생성된 TS 타입·클라이언트 (DEV-5)
packages/mocks/            MSW 핸들러 + 픽스처 (개발 서버·Vitest·Playwright 공용, DEV-7)
packages/config/           tsconfig/eslint 공유 설정 (필요 시)
cowork/                    기획·디자인·개발 문서 (유지)
```
- 의존 방향: `web → core, api, mocks(dev only)`, `mocks → api(core)`, `core → (없음)`. 역방향·순환 금지.
- **`core` 규칙**(라이프커브 engine 패턴 계승): 런타임 의존성 0, DOM·Node 타입 없음, `Date.now`/`new Date()`/`Math.random` 금지(ESLint). 현재 시각·시간대·난수는 인자로 받는다 → 결정적 테스트.
- 워크스페이스 패키지는 TS 원본을 `exports`로 노출, web `transpilePackages`로 트랜스파일(별도 빌드 없음).
- analytics 어댑터는 1단계엔 `apps/web/src/lib/analytics`(Q-7 결정 후 패키지 분리 여부 판단).

## 3. 도메인 모델 (`packages/core`)
- `MeetMode = 'datetime' | 'date_only'`, 날짜 선택 방식 `dates | weekdays`(요일 모드). → 조합 3종: 날짜+시간, 날짜만, 요일(+시간).
- **슬롯 표현**: 날짜 인덱스 × 30분 인덱스의 정수 좌표. 전송/저장 포맷(비트맵 vs 인덱스 배열)은 OpenAPI 협의(Q-9). core는 내부적으로 `Set<number>`/비트셋으로 다루고 `encode/decode`를 한 곳에 둔다.
- 날짜만 모드 응답은 3단계(돼요/애매/안돼요).
- 함수(전부 순수, 단위 테스트 필수 — AC-04-1 12건+):
  - `buildHeatmap(meet, responses)` → 칸별 count, 단계(`ceil(c/N·5)`), 전원 여부
  - `recommend(meet, responses, {minSlots})` → 같은 사람 집합이 유지되는 최대 연속 구간 후보 → 정렬(인원↓, 길이↓, 이른 날짜) → 같은 날 겹침 제거 → 최대 3 → 공동 순위(1·1·3), 1시간 구간에 2명 겹침이 없으면 30분 폴백 플래그
  - `recommendDateOnly`(돼요 1 + 애매 0.5), `recommendWeekday`
  - `resolveView({role, meetStatus, hasMyResponse})` → SCR-05~09/11 선택 (PRD §5.3 표 그대로)
  - `buildIcs`(단발 / 요일 모드 RRULE 매주 반복), 구글 캘린더 링크
- 시각 표시는 `Intl.DateTimeFormat('ko-KR')`, 시간대는 모임의 `timezone`(기본 Asia/Seoul).

## 4. 데이터 계층 (`apps/web/src/data`)
- `packages/api` 클라이언트 위에 SWR 훅: `useMeet(id)`, `useResponses(id)`, `useMeetSummary`(OG용은 서버 fetch).
- **폴링**: 포커스 중 5~10초, 탭 숨김이면 중지. ETag/`updatedAt`로 304 활용. 구현은 훅 뒤에 숨겨 SSE로 교체 가능하게(DEV-3).
- **쓰기(DEV-9)**: `submitResponse`, `confirmMeet`, `unconfirm`, `deleteResponse`, `deleteMeet`.
  - 낙관적 반영 → 멱등 PUT → 성공 시 서버값으로 조용히 교체.
  - 전송 중(pending) 플래그가 있으면 폴링 결과로 덮어쓰지 않음.
  - 실패: 선택 유지 + "저장 안 됨/다시 시도" + 지수 백오프 자동 재시도, 새로고침 대비 **localStorage 아웃박스**(마지막 제출 1건).
  - 409(이름 중복)·410(만료)·확정됨 코드는 롤백 + 해당 안내(문구는 PRD §10.2).
  - **모임 생성만 비낙관적**(서버가 ID 발급), 입력값 유지 + 재시도.
- 응답자(기기) 토큰: 클라이언트가 생성(암호학적 난수)해 보내고 서버는 해시 저장(안, Q-9에서 확정). 총무 키는 `X-Admin-Key` 헤더.
- 에러 모델: 백엔드 에러 코드 → 프론트 `AppError` 유니온으로 한 곳에서 매핑.

## 5. 클라이언트 저장소 (`apps/web/src/lib/storage`)
- 키: `lm.adminKeys{meetId→key}`, `lm.responderTokens{meetId→token}`, `lm.myMeets[]`, `lm.outbox`.
- **모든 접근 try/catch + 메모리 폴백**(카톡 인앱·사파리 프라이빗에서 막힐 수 있음). 저장 실패 시 "이 브라우저에선 저장이 안 돼요. 총무 링크를 복사해 두세요" 안내.
- `/m/[id]?k=...` 진입 시 키 저장 후 `history.replaceState`로 주소창에서 제거(PRD §6.2). 총무 링크 붙여넣기 열기(R-06-7).
- 만료 모임은 내 모임 목록에서 상태 배지 처리, 일정 기간 뒤 자동 정리.

## 6. 라우팅·렌더링 (Next 16 — 코딩 전 `node_modules/next/dist/docs/` 확인 필수)
| 경로 | 렌더링 | 비고 |
| --- | --- | --- |
| `/`, `/meet`, `/meet/for/[usecase]`(6), `/about`, `/legal/*` | SSG | JSON-LD `WebApplication`+`FAQPage`, 용도별 페이지는 기본값만 다르고 내용은 고유(F-21) |
| `/meet/new` | 정적 껍데기 + CSR 폼 | `?source=` `?usecase=` 로 기본값 |
| `/m/[id]` | 정적 껍데기 + CSR | `noindex`; `generateMetadata`가 공개 요약 API 호출 → OG 제목/설명; 이미지는 `opengraph-image`(`next/og`), `?v=` 로 카톡 캐시 갱신 |
| `/my` | CSR | localStorage 기반 |
| `/gone`, `not-found` | 정적 | `k=404|expired|deleted` |
- 보안 헤더(CSP, Referrer-Policy: strict-origin-when-cross-origin)는 이전 PR #6의 정적 CSP 패턴을 새 앱에 맞게 재도입(백엔드 origin, 카카오 SDK, 분석 도메인 허용).
- 환경변수: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_MOCKING=1`(MSW), `NEXT_PUBLIC_KAKAO_JS_KEY`, 분석 관련(미정).

## 7. UI 계층 (`apps/web/src/components`)
- 디자인 토큰: `tokens.css` 변수를 Tailwind 4 `@theme`으로 노출(라이트/다크는 `prefers-color-scheme`, 수동 전환 없음 — 시안 `[data-theme]`은 버리기).
- 컴포넌트 C-01~32를 `ui/`(Button, Field, Sheet, Toast, Banner, Badge …)와 `meet/`(SlotGrid, BestTimeCard, RespondentChips, ConfirmedCard, ShareSheet …)로 분리. Sheet/Dialog만 Radix 헤드리스(포커스 트랩·`inert`·복귀 포커스, DEV-11).
- **SlotGrid(C-08)**: 직접 구현. Pointer Events + `touch-action`, 드래그 사각형 칠하기/지우기 모드, 가장자리 자동 스크롤, roving tabindex 키보드 + **Shift+방향키 범위 선택(시안에 없음, 개발에서 추가)**, `role=grid` 라벨링, 자체 세로 스크롤 컨테이너 + sticky 날짜 헤더. 가장 먼저 프로토타입하고 INP ≤100ms를 실측한다. 초기 JS 예산(랜딩 ≤100KB, 모임 ≤150KB gzip) 때문에 그리드·ics·카카오 SDK는 동적 import로 쪼갠다.
- 시안의 `assets/js/*`는 참고용(그대로 복사 금지). 폰트는 Pretendard를 `next/font` 로컬 서빙으로 바꾼다(CDN 의존 제거).

## 8. 테스트·품질 (DEV-12)
- Vitest: `core` 전부(추천 12건+, 히트맵, 뷰 결정, ics), 낙관적 업데이트 상태기계, 스토리지 폴백.
- Playwright + MSW: 360×640·360×580(인앱 높이 흉내)·320×568 뷰포트 핵심 흐름(생성→공유→응답→결과→확정→gone), 에러·409·410·오프라인 재시도.
- 접근성: axe 자동 점검 + 키보드 시나리오. 번들 예산 검사 스크립트를 CI에 유지(이전 `feat/bundle-baseline` 아이디어 재도입).
- CI: typecheck · lint · test · build · bundle budget, main 대상 PR과 main push.
- **자동화 불가(수동 체크리스트로 남김)**: 카톡 인앱 실기기, 카톡 미리보기 캐시/썸네일, 색각 실사용자.

## 9. 라이프커브 제거 계획 (별도 PR, 설계 승인 후)
- 삭제: `apps/web` 기존 소스, `packages/engine`, `packages/rules`, `docs/lifecurve/`, 라이프커브 전용 CI 단계, `CLAUDE.md`의 라이프커브 섹션.
- 유지: `cowork/`, `.claude/skills`·`skills-lock.json`, `AGENTS.md`(Turborepo), `tsconfig.base.json`, `turbo.json`·`pnpm-workspace.yaml`(이름만 교체), `.github/` 틀.
- 새로 작성: 루트 `CLAUDE.md`(로미원용), 워크스페이스 이름 `lomeone`.

## 10. 열린 설계 항목
- Q-9 슬롯 전송 포맷, 응답자 토큰 발급 주체 → OpenAPI 초안에서 확정
- Q-10 엔드포인트 목록·에러 코드 표준(RFC 9457 problem+json 여부)
- Q-7 분석 도구(사용자가 추후 검증 후 선택, 어댑터로 대비)
