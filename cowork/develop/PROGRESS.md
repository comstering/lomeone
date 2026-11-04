# PROGRESS — 개발 진행 기록 (세션 인수인계)

> **새 세션은 이 파일부터 읽는다.** 그다음 `DECISIONS.md` → `OPEN-QUESTIONS.md` → `ARCHITECTURE.md` → `CLAUDE.md`(규칙).
> 작업 단위가 끝날 때마다 §3·§4·§6을 **그 자리에서** 갱신한다. 세션은 언제 끊길지 모른다.
> 최종 갱신: 2026-11-04 (세션 종료 직전 정리)

## 0. 30초 요약
- **무엇**: 로미원(lomeone) 1단계 "약속"(가능 시간 칠하기 → 모두 되는 시간 추천) **프론트엔드**를 만든다. 기획 `cowork/prd/`(PRD v1.1), 시안 `cowork/design/`(v0.2).
- **스택(확정)**: Next.js 16 App Router · Vercel · Tailwind 4 · SWR 폴링 · OpenAPI 계약 + MSW 목. **백엔드는 사용자가 따로 구현해 API로 제공**(이 레포는 프론트 전용).
- **지금 단계**: 설계 합의 끝, **코드는 아직 0줄.** `ARCHITECTURE.md` 초안이 PR #13에서 사용자 검토 대기.
- **다음에 할 일**: §4 참고. 가장 먼저 PR #13 머지 여부 확인.

## 1. 역할과 사용자 선호
- 나(Claude)는 전문 개발자. 사용자와 **논의하며 하나씩 결정**하는 방식을 선호한다 (질문을 설명해 주면 항목별로 답함). 결정은 즉시 `DECISIONS.md`에 `DEV-n`으로 기록.
- 사용자는 비용 최소·OSS·k8s self-host를 선호한다(분석 도구 논의). DevOps가 Observability/이벤트 수집 도구(Segment, Amplitude 등)를 별도로 검증 중이다.
- 사용자가 "기존 라이프커브 프로젝트는 전부 지우고 새로 시작해도 된다"고 승인함 (DEV-4). 단, **지우는 건 설계 승인 후 별도 PR**.
- 카톡 인앱 실기기 확인은 자동화 불가라 범위에서 제외하기로 함(DEV-12) → 수동 체크리스트로 남긴다.

## 2. 규칙·환경 함정 (꼭 읽을 것)
- `main` 직접 커밋·push 금지. `origin/main`에서 새 브랜치 → push → `gh pr create --base main`. **머지·로컬 main pull은 사용자가 한다** (사용자가 "pull해줘"라고 명시하면 `git fetch origin main:main`으로 체크아웃을 건드리지 않고 갱신).
- 커밋 메시지 `feat:`/`refactor:`/`fix:`/`docs:` + 시스템이 주는 Co-Authored-By 줄. PR 본문 끝에 Generated with 줄.
- **작업 트리가 둘이다.** 메인 체크아웃 `~/Programming/lomeone`은 디자인 세션이 브랜치를 계속 바꾼다(최근 `feat/design-v2-1`). **개발 문서/코드는 worktree `~/Programming/lomeone-develop`에서 작업**한다. worktree가 없으면: `git worktree add ../lomeone-develop -b <새브랜치> origin/main`.
- 디자인 세션은 `cowork/design/PROGRESS.md`로 따로 인수인계한다. 디자인이 바뀌면 `cowork/design/DESIGN-SPEC.md`를 다시 읽을 것(현재 v0.2).
- `apps/web/AGENTS.md`: Next 16은 기존 지식과 다르다 → **코딩 전 `apps/web/node_modules/next/dist/docs/`의 관련 문서를 먼저 읽는다**. 루트 `AGENTS.md`: Turborepo도 설치 버전 문서(`turbo` 패키지 `docs/README.md`)를 먼저 읽는다. (라이프커브 삭제 후 새 앱 기준으로 다시 확인)
- 스킬은 `.claude/skills/`(design-taste-frontend, impeccable, vercel-react-best-practices, web-design-guidelines, playwright-best-practices 등). UI 구현 단계에서 활용. 새 스킬은 설치 전 사용자 확인.

## 3. 현재 상태

### Git / PR (2026-11-04 기준)
| 항목 | 상태 |
| --- | --- |
| PR #12 (개발 컨텍스트·결정·분석 비교) | ✅ 머지됨, 로컬 `main` = `f8c7e5e` |
| **PR #13** `docs/architecture` (ARCHITECTURE.md 초안 + 이 PROGRESS 갱신) | 🟡 **열림, 사용자 검토 대기** |
| 나머지 로컬 브랜치(`design`, `prd`, `feat/*`, `fix/design-review`, `docs/design-progress`) | 모두 머지 완료(미머지 커밋 0). 삭제는 사용자 지시 시 |
| 코드 | 없음. 라이프커브 코드(`apps/`, `packages/engine`, `packages/rules`, `docs/lifecurve/`)는 아직 그대로 |

### 결정 현황 (상세는 `DECISIONS.md`)
| ID | 요지 |
| --- | --- |
| DEV-1 | 프론트 전용, 백엔드는 별도(사용자), Vercel |
| DEV-2 | Next.js 16 App Router |
| DEV-3 | 실시간 = SWR 폴링 5~10초 (훅 뒤에 숨겨 SSE 교체 가능) |
| DEV-4 | 라이프커브 전부 삭제 후 새 pnpm+Turborepo 모노레포 |
| DEV-5 | OpenAPI 스펙 단일 출처 → 타입/클라이언트 생성 |
| DEV-6 | 브라우저→백엔드 직접 호출(CORS), BFF 없음 |
| DEV-7 | MSW 목 + 계약 먼저 (E2E에도 같은 목) |
| DEV-8 | 추천 계산 = 클라이언트 순수 함수(`packages/core`) |
| DEV-9 | 낙관적 업데이트 + 멱등 PUT, 실패 시 선택 유지·재시도, 모임 생성만 비낙관적 |
| DEV-10 | OG = Next 서버가 백엔드 공개 요약 API 호출 → `next/og` |
| DEV-11 | Tailwind 4 + 토큰 이식, 컴포넌트 직접 구현(Sheet/Dialog만 Radix), SlotGrid 직접 |
| DEV-12 | 테스트 = Vitest + Playwright(+MSW) + 그리드 컴포넌트. 카톡 인앱 실기기 제외 |

### 미결 (`OPEN-QUESTIONS.md`)
- **Q-7 분석/이벤트 도구**: 사용자가 DevOps 검증 후 직접 선택(보류). 비교 분석은 `ANALYTICS-COMPARISON.md`(Umami 임시 추천, 어댑터 구조 권고). 프론트는 `track()` 어댑터로 대비.
- **Q-9** 슬롯 전송 포맷(비트맵/인덱스 배열), 응답자 토큰 발급 주체(클라이언트 생성 권장) / **Q-10** 에러 포맷(problem+json?)·엔드포인트 목록 → OpenAPI 초안에서 확정.
- **Q-11** `ARCHITECTURE.md` 초안 승인 (PR #13).

### 최신 기획 포인트 (구현 시 놓치기 쉬운 것)
- 응답 수정은 **응답한 기기(응답자 토큰)에서만**. 같은 이름이 이미 있으면 막는다(덮어쓰기 불가). 총무는 응답 삭제 가능.
- 모드 3종: 날짜+시간 / 날짜만(돼요·애매·안돼요, 점수 1/0.5) / 요일(매주 반복, .ics RRULE).
- 추천: Top3, 공동 순위(1·1·3), 최소 길이 필터 기본 1시간 → 겹침 없으면 30분 자동 폴백.
- 총무 키: URL `?k=` 진입 시 저장 후 주소창에서 제거. 총무 링크 붙여넣기 열기, 카톡 "나와의 채팅 저장" 안내.
- `/m/[id]` 화면은 (보는 사람 × 모임 상태)로 결정 (PRD-01 §5.3). 모임 페이지는 전부 noindex.
- 성능 예산: 초기 JS 랜딩 ≤100KB / 모임 ≤150KB gzip, 칠하기 INP ≤100ms, LCP ≤2.0s.

### 아직 안 한 것
- 카톡 인앱 실기기, 카톡 미리보기 캐시/썸네일, 색각 실사용자 확인 (수동, 출시 전 체크리스트)
- OpenAPI 초안, `BACKEND-REQUESTS.md` 최종본(현재는 요구 메모 수준), `ROADMAP.md`
- 라이프커브 삭제 + 새 모노레포 골격 + CI, `core`·`web` 구현 전부
- 루트 `CLAUDE.md` 로미원용으로 재작성 (현재는 라이프커브 내용)

## 4. 다음 할 일 (순서대로)
1. **PR #13 상태 확인.** 머지됐으면 `git fetch origin main:main` 후 새 브랜치로 진행. 사용자가 수정 요청을 남겼으면 `ARCHITECTURE.md`에 반영(Q-11 해소 → `DECISIONS.md`에 DEV-13 기록).
2. **OpenAPI 초안 작성** (`packages/api/openapi.yaml` 위치는 모노레포 생성 전이라면 `cowork/develop/openapi-draft.yaml`로 먼저): 엔드포인트(모임 생성/조회/확정/확정취소/삭제, 응답 PUT/삭제, 공개 요약, (P1) 장소·마감), 에러 코드(409 이름 중복, 410 만료·삭제, 확정됨), ETag/`updatedAt`, 헤더(`X-Admin-Key`, 응답자 토큰). Q-9·Q-10 결정을 사용자와 확인하며 확정. 끝나면 `BACKEND-REQUESTS.md`를 완성해 사용자에게 전달.
3. **초기화 PR**: 라이프커브 삭제(ARCHITECTURE §9 목록) + 새 모노레포 골격(`apps/web`, `packages/core|api|mocks`) + CI(typecheck·lint·test·build·번들 예산) + 루트 `CLAUDE.md` 재작성. 시작 전에 Next 16·Turborepo 설치 버전 문서 확인.
4. **`core` 구현(TDD)**: 슬롯 모델 → 히트맵 → 추천(AC-04-1 12건+) → resolveView → ics.
5. **SlotGrid 프로토타입** + INP 실측 → 이후 화면(홈/랜딩 → 생성 → 공유 → 응답 → 결과 → 총무/확정 → 내 모임 → gone).
6. `ROADMAP.md`로 구현 순서·스토리 분해를 문서화(체크리스트 형태, 끝낼 때마다 갱신).
7. Q-7 결정이 나면 analytics 어댑터 구현체 추가.

## 5. 이 세션에서 만든 파일 (`cowork/develop/`)
| 파일 | 용도 |
| --- | --- |
| `CLAUDE.md` | 이 디렉터리 작업 규칙 |
| `PROGRESS.md` | 이 문서 (인수인계 단일 출처) |
| `DECISIONS.md` | 확정 결정 DEV-1~12 + 근거(Q-8 비교표 보존) |
| `OPEN-QUESTIONS.md` | 대기 질문 Q-7, Q-9~11 |
| `BACKEND-REQUESTS.md` | 백엔드에 요청할 API 요구(초안) |
| `ANALYTICS-COMPARISON.md` | Q-7 분석 도구 비교(웹 검색 요약 기반 → 도입 전 각 저장소에서 재확인) |
| `ARCHITECTURE.md` | 프론트 설계 초안 |
| 메모리 | `develop-handoff-progress.md`(시작 시 이 파일 읽기 규칙) — 사용자 홈 `.claude/projects/.../memory/` |

## 6. 로그 (최신이 위)
| 날짜 | 내용 |
| --- | --- |
| 2026-11-04 | 세션 종료 전 인수인계 정리: 이 파일을 전면 재작성(0. 요약, 함정, Git/PR 현황, 다음 할 일). PR #13 열림 확인 |
| 2026-10-31 | PR #12 머지 확인·main 최신화. Q-7 보류 기록. `ARCHITECTURE.md` 초안 작성 → PR #13 |
| 2026-10-30 | Q-4~6 확정(DEV-10~12). Q-7 분석 도구 비교 분석 작성. develop 브랜치 rebase → PR #12 |
| 2026-10-30 | 추천 계산 A 확정(DEV-8), 낙관적 업데이트 패턴 합의(DEV-9) |
| 2026-10-28 | API 계약(OpenAPI)·직접 호출(CORS)·MSW 목 확정(DEV-5~7) |
| 2026-10-28 | PRD·디자인 읽음. 스택 1차 합의(DEV-1~4). `cowork/develop` 인수인계 체계 생성 |
