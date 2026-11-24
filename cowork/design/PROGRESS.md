# PROGRESS — 디자인 작업 진행 기록 (세션 인수인계)

> **새 세션은 이 파일부터 읽는다.** 그다음 `QUESTIONS.md`(답변 반영 여부), `DESIGN-SPEC.md`(핸드오프).
> **작업 규칙:** 작업 단위가 끝날 때마다 아래 §5 로그와 §3 현황·§4 다음 할 일을 **그 자리에서** 갱신한다. 세션은 언제 끊길지 모른다.

## 0-a. 4차 시안 (2026-11-09, 브랜치 `feat/design-v3`) — Q-23~29 답변 반영 완료, PR 대기
- 기획 답변(PRD v1.3, 2026-11-05)을 읽고 반영: 모임 수정 화면(`screens/edit.html` 6상태, C-29 `mode="edit"`), 재방문 응답자 "새 날짜가 추가됐어요", 100명 가득, FAQ·방침 문구 키(`COPY`), 컴포넌트 C-33~37, 문구 수정(Q-25), 사용성 테스트 준비물(`USABILITY-TEST.md`).
- 새 질문: `QUESTIONS.md` §I **Q-30~32**. 아래 §0은 4차 이전 스냅샷이라 "막힘 Q-23·Q-26"은 해소됨.
- **못 한 것:** 사용성 테스트 실시, 카톡 인앱 실기기, VoiceOver/TalkBack, 모임 수정 화면의 320px·인앱 580px 실측(헤드리스 500px 캡처만 확인), 100명 응답자 시트 별도 상태.
- 다음: 기획자 Q-30~32 답, 개발 세션이 테스트 URL 배포 → 11/9–11 테스트 → 11/12 D-8 판정(결과 반영), 카카오 심볼·법률 본문 도착 시 교체.

## 0. ⭐ 세션 인수인계 스냅샷 (2026-11-04 마지막 갱신) — 4차 이전 기준

**한 줄 요약:** 로미원 1단계 시안 v0.3(3차)까지 완료. 기획 답변 Q-01~22 모두 반영. 지금은 **기획자의 새 답변(§H Q-23~29)을 기다리는 중**이고, 막힌 건 Q-23(모임 수정 범위)·Q-26(FAQ·방침 수치) 두 가지.

### 저장소·PR 상태 (작성 시점)
| 항목 | 상태 |
| --- | --- |
| 현재 브랜치 | `feat/design-v2-1` (작업 트리 clean, 전부 push됨, HEAD `fcc1774`) |
| **PR #14** (우리 것, 열림) | `feat/design-v2-1` → `main`. 3차 시안(Q-19~22) + 기획 답변 + §H 열린 질문 요약 포함. 머지·pull은 사용자가 한다 |
| PR #13 (남의 것, 열림) | `docs/architecture` — 개발 쪽 프론트엔드 아키텍처 초안. **우리 작업과 무관, 건드리지 않는다** |
| 머지 이력 | #7 PRD · #8 시안 v0.1 · #9 진행기록 · #10 검수 수정 · #11 시안 v0.2(2차) · #12 개발 컨텍스트(남의 것) |
| 다른 사람 작업 | `docs/develop-context`, `docs/architecture` 등 개발 컨텍스트 문서는 개발 쪽이 올린다. 우리는 `cowork/prd`(기획자) · `cowork/design`(우리)만 |

### 새 세션 첫 행동 (순서대로)
1. `git fetch && git status && git branch --show-current` 로 상태 확인.
   - **PR #14가 머지됐으면** `git switch main && git pull` 후 새 작업은 `git switch -c <새 브랜치> origin/main`.
   - 아직 열려 있으면 `feat/design-v2-1`에서 이어 작업(같은 PR에 쌓임) 또는 새 브랜치.
2. **`git status`에 `cowork/prd/*` 또는 `cowork/design/QUESTIONS.md` 수정이 보이면 기획자가 작업 트리에서 직접 고친 것**이다 (지금까지 항상 이 방식으로 답변이 왔다). `git diff`로 읽고 → 반영 → 기획자 수정은 **별도 커밋**(`docs: Apply planner answers …`)으로 먼저 올린 뒤 시안 커밋. 절대 되돌리지 않는다.
3. `QUESTIONS.md` §H 표의 `답변` 칸이 채워졌는지 확인.
4. 이 파일 §4 "다음 할 일"과 아래 "답이 오면 할 일"을 따른다.

### 열린 질문 (`QUESTIONS.md` §H) — 기획자에게 전달 완료, 답 대기
| ID | 막힘? | 요약 | 답이 오면 할 일 |
| --- | --- | --- | --- |
| **Q-23** | 🔴 막힘 | 총무 ⋯ "모임 수정" 범위 (제안: 이름 · 날짜 추가(응답 있는 날짜 삭제 불가) · 시간 범위 넓히기만 · 마감 변경/해제, 모드 변경 불가) | **모임 수정 화면 시안** 신규 (`screens/`에 추가 또는 `m.html` 시트/페이지), 갤러리·SPEC·PRD 대조 |
| **Q-26** | 🔴 막힘 | FAQ 4개·소개 문구는 내 초안. "인원 제한 없음"은 PRD 근거 없음, "90일 뒤 삭제"는 PRD가 "마지막 날짜 후보 또는 확정일 + 90일"(D-3 법률 전) | `meet.html` FAQ, `about.html` 문구 교체. 인원 상한이 생기면 입력 한도 UI도 |
| Q-24 | 🟡 | PRD §8에 새 컴포넌트 ID 부여 (Switch · ResponderListSheet · DateBarList · Skeleton · FeatureIcon, 제안 C-33~37) | `DESIGN-SPEC.md` §3 표의 이름·ID를 PRD와 맞춤 |
| Q-25 | 🟡 | 시안에서 새로 쓴 문구 최종 확인(DAC-08) | 고칠 문구를 `create.js`·`m.html`·`new.html` 등에서 교체 (목록은 Q-25 행) |
| Q-27 | 🟡 | 사용성 테스트(D-8, DAC-02~04) 일정·참가자·시안 URL(Vercel preview 등)·진행자 | 필요하면 **테스트 시나리오·질문지** 작성(디자이너 준비 가능) |
| Q-28 | 🟢 | PRD SCR-07 샘플(금 19:00–20:00)과 시안(19:00–21:00) 중 어디에 맞출지 | 시안에 맞추면 PRD만 수정(기획), PRD에 맞추면 `grid.js` `PEOPLE` 수정 |
| Q-29 | 🟢 | 법적 문서 본문(D-3) · 카카오 앱/공식 심볼(D-4) · 개발 PRD `LM-PRD-02` 시점 | 도착 시 `about.html` 본문 · 카카오 심볼 교체 |

### 시안 완성도 한눈에 (v0.3)
- **완료:** SCR-01~12(+06b), OG·카카오 템플릿 SCR-13·14, 컴포넌트 C-01~32(C-26 제외) + 단일 선택 변형·Switch·스켈레톤·기능 아이콘 6종. 브랜드 확정(민트 틸 `#0B7F70` + 겹친 두 원 + Pretendard, 확정 카드 꽉 채움, "곧 나와요" 홈 하단 유지). 다크 모드, 코발트·로고 B는 `assets/archive/` 보관.
- **미작성:** 모임 수정 화면(Q-23).
- **못 한 검증(사람·기기 필요):** 사용성 테스트(D-8, 실제 폰 5명 — 판정: 5명 중 2명 이상 "스크롤하려다 칠함"이면 B안), 카톡 인앱 실기기(`.ics` 메뉴 이름 포함), VoiceOver/TalkBack, 카톡 썸네일 안 로고 실물. 이건 `QUESTIONS.md` §D에 정직하게 적혀 있다 — "완료"로 바꾸지 않는다.
- **검증된 것:** 헤드리스 Chrome 실측(360×640·360×580(인앱)·320×568: 주 버튼 첫 화면, 가로 넘침 없음, 그리드 8행 이상), 전 화면 JS 오류 없음, impeccable detector low-contrast 0건(잔여 15건은 의도한 줄무늬·오탐), 색각 이상 계산 시뮬레이션(히트맵 ΔE ≥ 5), 추천 알고리즘 케이스 5개.

### 기획·창업자가 이미 확정한 것 (다시 묻지 않는다)
- D-5 브랜드(민트 틸 + 겹친 두 원 + Pretendard) · D-11 "곧 나와요" 유지 · Q-15 확정 카드 꽉 채움 · **스택: 프론트 Next.js + Vercel, 백엔드는 별도 서버**(언어·DB는 `LM-PRD-02`).
- 이 저장소가 로미원 서비스 저장소, 라이프커브 코드(`apps/`, `packages/`)는 정리될 예정이라 무시.
- Q-18 그리드는 **안쪽 스크롤 + scroll chaining**(`overscroll-behavior: contain` 쓰지 않음), 인앱 580px에서 8행 이상.
- Q-02 이 기기에서만 수정(덮어쓰기 불가), 총무가 응답 삭제. Q-19 확정 "바꾸는 중"은 총무만 보는 임시 상태(참여자·OG는 이전 확정 유지).
- 추천 규칙(PRD v1.2 R-04-2): 최소 길이 → 인원·길이·이른 시작 정렬 → 같은 날 30분 칸 공유 시 순위 높은 쪽만 → 3개까지 → 남은 카드 기준 공동 순위. 시안 `m.html` `candidates()`가 이 구현이다 (개발 참고용).

### 작업 방식 메모 (사용자 선호·지시)
- 응답·문서는 **한국어**, 간결하게. 안 한 것·못 한 검증은 숨기지 않고 말한다.
- **`main` 직접 작업 금지**, `origin/main`에서 브랜치 → push → `gh pr create --base main`. **머지·pull은 사용자가** 한다 (사용자가 "머지했어, pull해"라고 하면 pull).
- 디자인 skill: `impeccable`(`critique`/detect — `.claude/skills/impeccable/scripts/impeccable detect --json <파일들>`), `web-design-guidelines`를 사용했다. 서브에이전트는 사용자가 요청하지 않아 쓰지 않았다 (critique를 degraded 단일 컨텍스트로 수행했다고 보고함).
- 작업 단위가 끝날 때마다 이 파일(§0 스냅샷·§3·§4·§5)을 **바로** 갱신한다. 새 질문은 `QUESTIONS.md`에, 시안이 바뀌면 `DESIGN-SPEC.md`도.

---

## 1. 역할과 목표
- 나(Claude)는 웹디자인 전문가. 기획자의 PRD(`../prd/`)를 분석해 사용자가 가장 편하게 쓰는 사이트로 디자인한다.
- 산출물은 `cowork/design/`에 둔다. 모르는 것·새 의견·정할 것은 **바로 `QUESTIONS.md`에 질문으로 남긴다.**
- 이 시안과 PRD를 보고 개발자가 서비스를 개발한다 → 개발자가 읽을 문서(`DESIGN-SPEC.md`)도 같이 최신으로 유지.
- 기준 문서: `../prd/lomeone-01-mvp-web-design-prd.md` (LM-PRD-01 **v1.2**, 2026-10-31) — 화면 SCR, 컴포넌트 C-xx, 수용 기준 DAC, 결정 D-x. 상위: `lomeone-00-service-master-prd.md`.
- 제품: 로미원(lomeone) — 단톡방 총무용 링크형 모임 도구. 1단계 = "로미원 약속"(가능 시간 칠하기 → 모두 되는 시간).

## 2. 저장소·브랜치 규칙 (사용자 지시)
- `main` 직접 커밋·push 금지. `origin/main`에서 새 브랜치 → push → `gh pr create --base main`. 머지와 로컬 pull은 사용자가 한다.
- 커밋 메시지: `feat:` / `refactor:` / `fix:` / `docs:` 형식. 끝에 세션 시스템이 주는 Co-Authored-By 줄 추가.
- 사용자가 "기존 작업은 다 없어질 것, 완전히 새 프로젝트"라고 했다 → 이 저장소의 라이프커브(apps/, packages/ 등)는 신경 쓰지 않는다. 시안은 `cowork/` 아래에서만 작업.
- 파일 경로는 `/Users/comstering/Programming/lomeone/cowork/{prd,design}`. (처음엔 cwd에 `cowork/`가 없어 `~/Cowork/Lomeone/cowork/prd`를 찾았으나, 이 저장소의 `cowork/prd`가 정답.)

## 3. 현재 상태 (v0.3 — 3차 시안, PR #14 대기. v0.1·v0.2는 main에 머지됨: PR #7~#11)
- 시안: 동작하는 정적 HTML/CSS/JS (프레임워크 없음). 시작점 `index.html`.
- 화면: SCR-01~12, 06b, OG·카카오 템플릿(SCR-13·14) 완료. 컴포넌트 C-01~32 중 C-26(ToolNav) 제외 완료.
- 파일: `screens/{home,meet,new,m,my,gone,about,og,brand}.html`, `assets/css/{tokens,components}.css`, `assets/js/{shared,grid,create}.js`, `assets/logo/*.svg`.
- `m.html`은 `/m/[id]`의 모든 상태를 `?v=` 쿼리로 보여준다(name, paint, dateonly, result, result-one, result-none, admin, admin-empty, confirmed, confirmed-part, confirmed-changed, confirmed-admin, past). 기타 쿼리: `sheet=`, `alt=b`, `days=8`, `filled=0`, `coach=0`, `theme=dark`, `brand=b`, `inapp=1`. 전체 표는 `DESIGN-SPEC.md` §1.
- 브랜드 **확정(D-5, 2026-10-29)**: 민트 틸 `#0B7F70` + 겹친 두 원 로고 + Pretendard. 코발트·채워지는 칸은 `assets/archive/`에 보관만.

### 내가 내린 설계 결정 (PRD에 없거나 달라진 것)
1. 그리드는 자체 세로 스크롤 컨테이너(max 680px)에 넣고 날짜 헤더 sticky → `QUESTIONS` Q-18.
2. SCR-02(랜딩)도 만들기 버튼을 하단 고정 바로 (DAC-01 충족 위해).
3. 확정 카드는 브랜드 색 꽉 채움 (Q-15).
4. 이모지는 🎉만, 나머지 선형 아이콘. "곧 나와요" 카드 아이콘은 임시 이모지.
5. "빠지는 사람"은 호박색(`--warning`), 동률이면 둘 다 1위로 표시 (Q-05).
6. `--positive`를 `#166A2D`로 (배지 대비 4.5:1 확보).

### 아직 안 한 것 / 알려진 한계 (정직한 현황)
- 사용성 테스트(DAC-02·03·04, D-8), 실제 카톡 인앱 기기 확인, 색각 이상 시뮬레이션: **미실시**
- 미작성 화면/상태: 모임 수정 화면 (Q-19의 "바꾸는 중 참여자 화면"은 이전 확정 그대로라 별도 화면 없음, Q-20 마감 입력은 3차에서 완료)
- 그리드 Shift+방향키 범위 선택, 시트 포커스 트랩, 시트 드래그 닫기: 시안에 없음(개발에서 구현)
- 카카오 심볼은 일반 말풍선 아이콘(공식 자산 교체 필요), 파비콘 PNG·단색/다크 로고 미제작
- 법적 문서 본문·FAQ 답변은 내가 쓴 샘플

### 검수 결과 (2026-10-29, 2차) — 반영 완료
- **웹 인터페이스 가이드라인(`web-design-guidelines`)** + **impeccable `critique`(detector)** + 실측으로 검수 후 시안 수정:
  - 시트: 닫힌 시트가 Tab 포커스를 받던 버그 → `visibility:hidden`, 열리면 배경 `inert`(포커스 트랩) + 닫을 때 열었던 요소로 포커스 복귀, 첫 버튼 강제 포커스 제거. `overscroll-behavior: contain`.
  - 그리드 ARIA: `role=grid/row/columnheader/rowheader/gridcell`, 히트맵 셀 라벨에 "n/N명 가능".
  - 총무 추천 카드: 버튼 안 버튼 중첩 제거(div + 확정 버튼). 확정 취소에 확인 시트 추가(`?sheet=uncf`).
  - 대비 버그 2건: 다크 `danger` 버튼 글자(2.3:1 → `--danger-fg`), 선택된 칩 hover 시 글자 사라짐, 비활성 primary hover 색.
  - 320px 가로 넘침(달력) 수정, OG 페이지 모바일 넘침 수정, 말줄임(`min-width:0`), 칩 최대 폭.
  - `theme-color`·`color-scheme` 메타, 본문 바로가기 링크, safe-area(헤더), `touch-action: manipulation`, `text-wrap: balance`, 폼 `name/autocomplete`, 페이지 `h1`, `translate="no"`(브랜드명).
  - 결과 화면: **정답("가장 좋은 시간")을 응답자 칩보다 위로** (DAC-04 대비).
  - 히트맵 1단계 농도 16→20% (색각 이상 시뮬레이션에서 가장 약한 구간 개선).
- **실측(Chrome 헤드리스, iframe):** 360×640·360×580(인앱)·320×568에서 SCR-01·02·03·05·06·07·08·09 주 버튼이 첫 화면에 보임, 320px 가로 넘침 없음(수정 후). SCR-04는 캡처로 카톡 버튼 노출 확인.
- **색각 이상 시뮬레이션(Machado, 계산):** 히트맵 7단계 인접 ΔE ≥ 5 (라이트/다크, A/B, 1·2·3형). 전원 칸은 색 + 테두리 + 줄무늬 추가.
- detector 잔여 15건은 의도/오탐: `repeating-gradient`(전원 칸 줄무늬 = 색각 이상 대응, 의도), `cramped-padding`(섹션 배경 전폭 + `.wrap` 안쪽 여백 구조, 오탐).
- **위 검수는 코드·캡처 기준이다. 실제 기기·스크린리더(VoiceOver/TalkBack) 검증, 사용성 테스트는 여전히 미실시.**

### 2차 시안 반영 결과 (2026-10-29)
- 추천 시간은 **데이터에서 계산**한다(`m.html`의 `candidates()`): 인원 → 연속 길이 → 이른 날짜, 같은 날 겹침 제외, 최대 3개, 공동 순위(1·1·3), 1시간 겹침이 없으면 30분 폴백. 결과/총무/확정 화면은 같은 샘플 응답(`PEOPLE`)을 쓴다 → E-02 해결. (예: 금 추천이 PRD 예시 19:00–20:00 대신 19:00–21:00으로 나옴 — 데이터 일관성 우선)
- 새 화면 상태(`m.html?v=`): `paint-dow` `paint-closed` `result-short` `result-date` `result-dow` `result-many` `admin-date` `confirmed-date` `confirmed-dow` `confirmed-changed-admin` `loading`, 시트 `list` `delr` `key` `uncf`. 갤러리 `index.html` 갱신.
- **실측**(헤드리스 Chrome iframe, 360×640/360×580/320×568): SCR-01·02·03·05·06·07·08·09 주 버튼 첫 화면, SCR-06 그리드 8행 이상(580px 인앱에서 9행). 공유 시트는 캡처로 카톡 + '나와의 채팅 저장' 버튼이 첫 화면 안에 들어옴(E-08). detector: low-contrast 0건, 잔여는 의도(줄무늬)·오탐.
- 못 한 것: 사용성 테스트(D-8, 실제 폰 5명), 카톡 인앱 실기기, 스크린리더 실기, 모임 수정 화면, (응답 마감 입력의 날짜 선택기는 3차에서 C-05·C-06 변형으로 해결) 요일 모드 그리드 "1–5 / 7" 위치 안내 갱신.

## 4. 다음 할 일 (우선순위 순)

### 2차 시안 진행 중 (브랜치 `feat/design-v2`, 시작 2026-10-29) — 기획 답변 반영
기획자 답변은 `QUESTIONS.md`(✅ 표시)와 PRD v1.1(`../prd/`)에 있다. **창업자 결정: 색 A 민트 틸 + 로고 A(겹친 두 원) + Pretendard, 확정 카드 꽉 채움, "곧 나와요" 유지, 스택 = Next.js(Vercel) + 별도 백엔드.** 저장소는 로미원 서비스 저장소(라이프커브 무시).
체크리스트 (끝낸 항목은 [x]로 바꾸고 §5 로그에도 남긴다):
- [x] A. D-5 반영: 색 B·로고 B 제거(보관만 `assets/archive/`), 로고 단색·다크 SVG, 파비콘 16/32/180 PNG
- [x] B. E-01 SCR-06 안내문 "(D-8…)" 삭제 · E-02 결과/총무/확정 샘플 데이터 통일 + 히트맵 첫 화면에 정답 구간 노출
- [x] C. E-03 헤더 줄바꿈(nowrap) · E-04 배지 늘어남 · E-05 비활성 버튼 이유 안내 · E-06 총무에게 "응답 수정은 총무에게" 숨김 · E-07 SPEC §8에 헤더 1줄 차이 기록
- [x] D. E-08 공유 시트 첫 화면에 "카톡 나와의 채팅에 저장"까지 + Q-09 버튼
- [x] E. Q-02 중복 이름 문구(덮어쓰기 불가) · E-09 총무 응답 삭제(칩 → 시트 → 확인) · S-06 20명+ 목록 시트
- [x] F. Q-04 날짜만 결과·확정, 요일 모드 응답·결과·확정
- [x] G. Q-05/06 공동 순위(1·1·3, 최대 3개), 최소 길이 칩 3개 + 30분 자동 폴백 캡션
- [x] H. Q-07 확정 시간 바꾸기·바뀐 시간 알리기·확정 취소 토스트(알리기)
- [x] I. Q-08 "총무 링크로 열기" 시트 · Q-10 `/my` 안내 문구 · Q-11 응답 마감 상태 + "더 설정하기"
- [x] J. Q-16 기능 아이콘 6종 · S-05 빠른 날짜 칩 · 로딩 스켈레톤
- [x] K. Q-18 그리드 scroll chaining(`overscroll-behavior: contain` 제거) + 인앱 높이에서 8행 이상 확인
- [x] L. index.html·DESIGN-SPEC·QUESTIONS("반영됨" 표시)·PROGRESS 갱신, 검증(JS 오류·360/320 실측), PR

### 3차 완료 (브랜치 `feat/design-v2-1`, 2026-10-31) — Q-19~22 기획 답변 반영 (PRD v1.2), PR 대기
기획 답변은 `QUESTIONS.md` §F 표(Q-19~22 ✅)와 PRD v1.2에 있다. 끝낸 항목은 [x]로 바꾸고 §5 로그에도 남긴다.
- [x] M. Q-19 확정 "바꾸는 중": 총무 배너 [바꾸기 그만두기], 현재 확정과 같은 시간은 확정 비활성 + "지금 확정된 시간이에요"
- [x] N. Q-20 응답 마감 입력: "응답 마감 정하기" 토글 → C-05 단일 날짜 + C-06 단일 시각(기본 22:00), 범위(지금+1h ~ 마지막 후보 23:30, 요일 모드 4주), 3상태(꺼짐·펼침·선택됨), `datetime-local` 제거
- [x] O. Q-21 날짜만 확정 시간: 기본 "하루 종일", 시간 정하기 → 빠른 칩 3개 + 직접 선택, 용도 랜딩이면 시작 시간 칩 맨 앞
- [x] P. Q-22 추천 알고리즘: `candidates()`가 PRD v1.2 R-04-2 순서와 같은지 검증(테스트), 다르면 수정
- [x] Q. index·DESIGN-SPEC·QUESTIONS(반영 표시, §F 표 갱신)·PROGRESS, 검증, PR

### 그 뒤 (2차 PR 머지 후)
1. 새 기획 답변이 오면 `QUESTIONS.md`에서 확인 → 반영. **열린 질문: §H Q-23~29** (막힘: Q-23 모임 수정 범위 → 답 오면 모임 수정 화면 시안, Q-26 FAQ·방침 수치 → 문구 교체).
2. 사용성 테스트(D-8, 실제 폰 5명) 결과로 A/B 확정 → 필요 시 B안 제거.
3. 최종: DAC 체크리스트(`DESIGN-SPEC.md` §9) 갱신, `lomeone-90-design-system-spec.md`(PRD README가 예고한 확정 토큰 문서) 작성 여부 사용자와 합의.

## 5. 작업 로그 (최신이 위. 작업 끝날 때마다 한 줄 이상 추가)
| 날짜 | 내용 | 산출물/PR |
| --- | --- | --- |
| 2026-11-09 | **4차 시안**: Q-23~29 반영 — 모임 수정 화면 6상태, 새 날짜 알림, 100명 가득, 문구 키 `COPY`, Q-25 문구 3건·총무 링크 원문, C-33~37, 사용성 테스트 문서, 날짜 키 UTC 밀림 수정, SPEC·QUESTIONS §I | `feat/design-v3` |
| 2026-11-04 | 세션 종료 전 인수인계 스냅샷 작성(§0): PR/브랜치 상태, 열린 질문 표, 첫 행동 순서, 확정 사항 목록 | `feat/design-v2-1` |
| 2026-11-04 | 기획자 전달용 열린 질문 요약 작성(`QUESTIONS.md` §H, Q-23~29). 막힌 항목: Q-23 모임 수정 범위, Q-26 FAQ·방침 수치 | `feat/design-v2-1` (PR #14에 포함) |
| 2026-10-31 | **3차 시안**: Q-19~22 반영 — 확정 바꾸는 중([바꾸기 그만두기]·현재 확정 비활성), 응답 마감 입력(토글 + C-05/C-06 단일 변형), 날짜만 확정 시간 칩, 겹침 제외 규칙 검증(코드 변경 없음, 케이스 5개 통과). DESIGN-SPEC·QUESTIONS §G 갱신 | 브랜치 `feat/design-v2-1` |
| 2026-10-29 | **2차 시안**: 기획 답변(PRD v1.1) 반영 — 색 A·로고 A 확정(B안 `assets/archive/`), 단색·다크 로고, 파비콘, E-01~E-09, Q-02·04·05·06·07·08·09·10·11·16, S-05·06, 스켈레톤, Q-18 | 브랜치 `feat/design-v2` |
| 2026-10-29 | 검수(web-design-guidelines, impeccable critique/detector, 360/320 실측, 색각 시뮬레이션) 후 시안 수정, DESIGN-SPEC·QUESTIONS 갱신 | 브랜치 `fix/design-review` |
| 2026-10-28 | 인수인계 체계 추가: 이 파일 + `cowork/design/CLAUDE.md` | 이 PR |
| 2026-10-28 | PRD·디자인을 브랜치 `prd`/`design`으로 push, 머지 완료, 로컬 main pull | PR #7, #8 |
| 2026-10-28 | 1차 시안 완성(화면 전체, 토큰, 컴포넌트, 로고 2안, OG 템플릿), `QUESTIONS.md`(질문 18·제안 6)·`DESIGN-SPEC.md` 작성 | `cowork/design/` |

## 6. 작업 요령 (함정 메모)
- **미리보기 캡처:** `agent-browser`·playwright 없음. Google Chrome 헤드리스 사용: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=W,H --virtual-time-budget=3000 --screenshot=out.png file://…`. **헤드리스 최소 창 폭이 약 500px**이라 360px 확인은 iframe 360px 폭을 여러 개 넣은 래퍼 HTML을 캡처해야 한다. 시스템이 다크이면 `?theme=light`를 붙인다.
- 임시 파일은 스크래치패드(세션 한정)에 둔다. 저장소엔 산출물만.
- macOS `sed -i`는 `-i ''`가 필요해서 실패하기 쉽다 → 수정은 Edit 도구나 python 사용.
- JS 오류 점검: 헤드리스 `--enable-logging=stderr --dump-dom`에서 `Uncaught|SyntaxError|ReferenceError` grep.
- 색 대비는 상대 휘도 계산 스크립트로 확인하고 수치를 `DESIGN-SPEC.md` §2에 적는다 (주장하기 전에 계산).
- `assets/js/*`는 시안용 코드. 개발 핸드오프 문서에서도 "그대로 쓰지 말고 참고용"으로 안내 중.
- **헤드리스 캡처 함정:** 창 최소 폭 약 500px → 360px 확인은 `<iframe style="width:360px">`를 나란히 넣은 래퍼 HTML을 스크래치패드에 만들어 캡처. **시트(`?sheet=`)는 열림 애니메이션 때문에 `--virtual-time-budget`을 15000 이상**으로 줘야 완전히 열린 모습이 찍힌다(5000이면 상단만 보임). 다크 시스템이면 `?theme=light`.
- **실측 스크립트:** 래퍼 HTML에서 iframe `contentDocument`를 읽으려면 `--allow-file-access-from-files`. 가로 넘침은 `documentElement.scrollWidth > 폭`, 주 버튼은 `getBoundingClientRect().bottom <= 높이`. 시트 안 버튼 위치는 시트가 열리기 전에 재면 틀리니 **캡처로 확인**.
- 추천 알고리즘 검증은 `m.html`의 `function candidates`~`function best(` 구간을 잘라 Node로 실행하면 된다 (스크래치패드에 임시 스크립트).
- 파일 수정 시 "File has been modified since read" 오류가 나면 해당 파일을 `Read`로 한 번 읽은 뒤 다시 `Write`/`Edit`. 큰 문서 수정은 python 치환 스크립트가 안전(치환 문자열이 없으면 assert로 중단되니 메시지를 확인).
- 사용자가 `cowork/prd/*`·`QUESTIONS.md`를 작업 트리에서 직접 수정해 두면 브랜치를 바꿀 때 `git stash` → `git switch -c <새 브랜치> origin/main` → `git stash pop`으로 가져간다.
