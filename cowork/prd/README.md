# prd/ — 로미원(Lomeone) 기획서 디렉토리

이 디렉토리는 로미원(Lomeone, lomeone.com) — 단톡방 총무를 위한 링크형 모임 도구 — 의 모든 제품 기획서(PRD)를 관리한다.
웹디자이너는 화면·컴포넌트·디자인 요구사항을, 개발자는 기능·동작·완료 기준을 이 문서들에서 확인한다.

## 파일명 규칙

```
{제품}-{NN}-{범위}-{종류}.md
```

| 요소 | 규칙 | 예 |
| --- | --- | --- |
| 제품 | 제품 슬러그 (영문 소문자) | `lomeone` |
| NN | `00` 서비스 마스터, `01–09` 1단계(약속) 디자인·개발 PRD, `10–89` 기능 영역·단계 PRD, `90–99` 디자인·운영 명세 | `00`, `01`, `20`, `90` |
| 범위 | 다루는 기능·단계 (케밥케이스) | `service-master`, `mvp-web-design` |
| 종류 | `prd` (요구사항) / `spec` (확정 명세) | `prd` |

- 문서 버전은 파일명이 아니라 문서 상단 표와 **변경 이력**에서 관리한다 (링크가 깨지지 않게).
- 문서 간 참조는 문서 ID(`LM-PRD-00`)와 섹션 번호(§8)로 한다.
- ID 체계: 기능 `F-xx` · 요구사항 `R-xx-n` · 수용 기준 `AC-xx-n` · 성공 기준 `SC-xx` · 가설 `H-n` · 화면 `SCR-xx` · 컴포넌트 `C-xx` · 디자인 수용 기준 `DAC-xx` · 결정 `D-x`.

## 문서 위계

1. **서비스 마스터 PRD (`00`)** — 범위·원칙·브랜드·성공 기준·IA·기능. 충돌 시 범위·원칙은 00이 우선.
2. **단계/기능 PRD (`01`~`89`)** — 화면·컴포넌트·구현 세부. 충돌 시 화면·숫자 세부는 하위 PRD가 우선.
3. **디자인·운영 명세 (`90`~)** — 확정 디자인 토큰, 운영 절차.

## 문서 목록

| 파일 | ID | 내용 | 상태 |
| --- | --- | --- | --- |
| [lomeone-00-service-master-prd.md](lomeone-00-service-master-prd.md) | LM-PRD-00 | 서비스 전체 기획: 원칙 PR-1~8 · 브랜드(로미원) · 사용자 · 게이트·가설 H-1~5 · SC-01~16 · IA · 기능 F-01~21 · 성장 모델 · 로드맵 | ✅ v1.0 (2026-10-28) |
| [lomeone-01-mvp-web-design-prd.md](lomeone-01-mvp-web-design-prd.md) | LM-PRD-01 | 1단계 웹디자인 기획서: 화면 SCR-01~14 · 컴포넌트 C-01~32 · 디자인 시스템 요구사항 · 문구 · 산출물·QA | ✅ v1.0 (2026-10-28) |
| lomeone-02-mvp-dev-prd.md | LM-PRD-02 | 1단계 개발 명세: API·DB·추천 알고리즘·유저 스토리 | 예정 (스택 결정 D-2 후) |
| lomeone-20-random-tools-prd.md | LM-PRD-20 | 사다리·팀 나누기·돌림판·자리배치 | 예정 (3개월차) |
| lomeone-30-rolling-paper-prd.md | LM-PRD-30 | 롤링페이퍼·신고·필터 | 예정 (6개월차) |
| lomeone-40-monetization-prd.md | LM-PRD-40 | 광고·총무 프로 | 예정 |
| lomeone-60-global-prd.md | LM-PRD-60 | 영어·일본어 | 예정 (12개월차) |
| lomeone-90-design-system-spec.md | LM-DS-90 | 디자인 토큰 확정값·시안 링크 | 예정 (디자인 확정 시) |

## 원본·관련 문서

- Claude Docs: "로미원(Lomeone) — 서비스 메인 기획서 v0.2" — https://claude.ai/artifact/XN2R5SbcZaPcbG2QAUVv1e
- Claude 프로젝트 "Lomeone 프로젝트": `claude/아이템-리서치-v3-제로베이스.md` (아이템 선정 경위·후보 스코어)
