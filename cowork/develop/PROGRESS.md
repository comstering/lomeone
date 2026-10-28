# PROGRESS — 개발 진행 기록 (세션 인수인계)

> **새 세션은 이 파일부터 읽는다.** 그다음 `DECISIONS.md` → `OPEN-QUESTIONS.md` → `CLAUDE.md`(규칙).
> 작업 단위가 끝날 때마다 §3·§4·§5를 **그 자리에서** 갱신한다.

## 1. 역할과 목표
- 나(Claude)는 전문 개발자. `../prd/`(기획)와 `../design/`(시안, `DESIGN-SPEC.md`)를 보고 로미원 1단계 "약속"을 구현한다.
- 이 레포는 **프론트엔드(Next.js 16)**. 백엔드는 사용자가 별도 구현·API 제공(DEV-1).
- 지금 단계: **스택·설계를 사용자와 함께 정하는 중.** 코드 작성 전.

## 2. 규칙 요약
- `main` 직접 작업 금지 → 브랜치 → PR(`--base main`) → 사용자가 머지·pull.
- 자세한 건 `CLAUDE.md`.

## 3. 현재 상태
- 확정: DEV-1~7 (`DECISIONS.md`).
- 미결: Q-4~8 (Q-8은 비교표 제시, 답 대기) (`OPEN-QUESTIONS.md`).
- 코드: 아직 없음. 기존 라이프커브 코드(`apps/`, `packages/`, `docs/lifecurve/`)는 아직 안 지웠다 (설계 확정 후 별도 PR로 삭제).
- 기획서 읽음: `LM-PRD-00` §5~10 핵심, `LM-PRD-01`·`design/PROGRESS.md`·`DESIGN-SPEC.md` 목차까지. 디자인 시안 파일 본문은 구현 시점에 읽는다.

### 아직 안 한 것
- 설계 문서(`ARCHITECTURE.md`) 작성, API 계약, 초기화 PR, 구현 전부.

## 4. 다음 할 일
1. 사용자와 Q-1~8 논의 → `DECISIONS.md` 확정.
2. `ARCHITECTURE.md` 작성(디렉터리 구조·데이터 흐름·모듈 경계).
3. `BACKEND-REQUESTS.md` 완성해 사용자에게 전달.
4. 초기화 PR: 라이프커브 삭제 + 새 모노레포 골격 + CI.
5. 구현 순서 계획(`ROADMAP.md`).

## 5. 로그 (최신이 위)
| 날짜 | 내용 |
| --- | --- |
| 2026-10-28 | API 계약(OpenAPI)·직접 호출(CORS)·MSW 목 확정(DEV-5~7). Q-8 장단점 정리 |
| 2026-10-28 | PRD·디자인 읽음. 스택 1차 합의(DEV-1~4). `cowork/develop` 인수인계 체계 생성 |
