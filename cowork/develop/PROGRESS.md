# PROGRESS — 개발 진행 기록 (세션 인수인계)

> **새 세션은 이 파일부터 읽는다.** 그다음 `DECISIONS.md` → `OPEN-QUESTIONS.md` → `CLAUDE.md`(규칙).
> 작업 단위가 끝날 때마다 §3·§4·§5를 **그 자리에서** 갱신한다.

## 1. 역할과 목표
- 나(Claude)는 전문 개발자. `../prd/`(기획)와 `../design/`(시안, `DESIGN-SPEC.md`)를 보고 로미원 1단계 "약속"을 구현한다.
- 이 레포는 **프론트엔드(Next.js 16)**. 백엔드는 사용자가 별도 구현·API 제공(DEV-1).
- 지금 단계: **스택·설계를 사용자와 함께 정하는 중.** 코드 작성 전.

## 2. 규칙 요약
- 작업 트리: 다른 세션(디자인)이 메인 체크아웃 브랜치를 바꾸므로 개발 브랜치는 worktree(`../lomeone-develop`, 브랜치 `docs/develop-context`)에서 작업한다.
- `main` 직접 작업 금지 → 브랜치 → PR(`--base main`) → 사용자가 머지·pull.
- 자세한 건 `CLAUDE.md`.

## 3. 현재 상태
- 확정: DEV-1~12 (`DECISIONS.md`).
- 미결: Q-7 분석 도구 (`ANALYTICS-COMPARISON.md`, DevOps 검증과 연동 — 사용자가 고민 중) (`OPEN-QUESTIONS.md`).
- 코드: 아직 없음. 기존 라이프커브 코드(`apps/`, `packages/`, `docs/lifecurve/`)는 아직 안 지웠다 (설계 확정 후 별도 PR로 삭제).
- 기획서 읽음: `LM-PRD-00` §5~10 핵심, `LM-PRD-01`·`design/PROGRESS.md`·`DESIGN-SPEC.md` 목차까지. 디자인 시안 파일 본문은 구현 시점에 읽는다.

### 아직 안 한 것
- 카톡 인앱 실기기 확인 (자동화 불가, DEV-12로 범위 제외 — 출시 전 수동 체크리스트로 남김)
- 설계 문서(`ARCHITECTURE.md`) 작성, API 계약, 초기화 PR, 구현 전부.

## 4. 다음 할 일
1. 사용자와 Q-1~8 논의 → `DECISIONS.md` 확정.
2. `ARCHITECTURE.md` 작성(디렉터리 구조·데이터 흐름·모듈 경계).
3. `BACKEND-REQUESTS.md` 완성해 사용자에게 전달.
4. Q-7 결정 후 `ARCHITECTURE.md`에 analytics 어댑터 반영
5. 초기화 PR: 라이프커브 삭제 + 새 모노레포 골격 + CI.
6. 구현 순서 계획(`ROADMAP.md`).

## 5. 로그 (최신이 위)
| 날짜 | 내용 |
| --- | --- |
| 2026-10-30 | Q-4~6 확정(DEV-10~12). Q-7 분석 도구 비교 분석 작성. main 최신화(a6d6a95), develop 브랜치 rebase → PR |
| 2026-10-30 | 추천 계산 A 확정(DEV-8), 낙관적 업데이트 패턴 합의(DEV-9). Q-4~7 설명 제공 |
| 2026-10-28 | API 계약(OpenAPI)·직접 호출(CORS)·MSW 목 확정(DEV-5~7). Q-8 장단점 정리 |
| 2026-10-28 | PRD·디자인 읽음. 스택 1차 합의(DEV-1~4). `cowork/develop` 인수인계 체계 생성 |
