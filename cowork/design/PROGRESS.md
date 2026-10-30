# PROGRESS — 디자인 작업 진행 기록 (세션 인수인계)

> **새 세션은 이 파일부터 읽는다.** 그다음 `QUESTIONS.md`(답변 반영 여부), `DESIGN-SPEC.md`(핸드오프).
> **작업 규칙:** 작업 단위가 끝날 때마다 아래 §5 로그와 §3 현황·§4 다음 할 일을 **그 자리에서** 갱신한다. 세션은 언제 끊길지 모른다.

## 1. 역할과 목표
- 나(Claude)는 웹디자인 전문가. 기획자의 PRD(`../prd/`)를 분석해 사용자가 가장 편하게 쓰는 사이트로 디자인한다.
- 산출물은 `cowork/design/`에 둔다. 모르는 것·새 의견·정할 것은 **바로 `QUESTIONS.md`에 질문으로 남긴다.**
- 이 시안과 PRD를 보고 개발자가 서비스를 개발한다 → 개발자가 읽을 문서(`DESIGN-SPEC.md`)도 같이 최신으로 유지.
- 기준 문서: `../prd/lomeone-01-mvp-web-design-prd.md` (LM-PRD-01 v1.0) — 화면 SCR, 컴포넌트 C-xx, 수용 기준 DAC, 결정 D-x. 상위: `lomeone-00-service-master-prd.md`.
- 제품: 로미원(lomeone) — 단톡방 총무용 링크형 모임 도구. 1단계 = "로미원 약속"(가능 시간 칠하기 → 모두 되는 시간).

## 2. 저장소·브랜치 규칙 (사용자 지시)
- `main` 직접 커밋·push 금지. `origin/main`에서 새 브랜치 → push → `gh pr create --base main`. 머지와 로컬 pull은 사용자가 한다.
- 커밋 메시지: `feat:` / `refactor:` / `fix:` / `docs:` 형식. 끝에 세션 시스템이 주는 Co-Authored-By 줄 추가.
- 사용자가 "기존 작업은 다 없어질 것, 완전히 새 프로젝트"라고 했다 → 이 저장소의 라이프커브(apps/, packages/ 등)는 신경 쓰지 않는다. 시안은 `cowork/` 아래에서만 작업.
- 파일 경로는 `/Users/comstering/Programming/lomeone/cowork/{prd,design}`. (처음엔 cwd에 `cowork/`가 없어 `~/Cowork/Lomeone/cowork/prd`를 찾았으나, 이 저장소의 `cowork/prd`가 정답.)

## 3. 현재 상태 (v0.2 — 2차 시안, PR 대기. v0.1은 main에 머지됨: PR #7~#10)
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
- 미작성 화면/상태: 모임 수정 화면, 응답 마감 입력의 전용 날짜 선택기(Q-20), 확정 시간 바꾸기 중 참여자 화면(Q-19)
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
- 못 한 것: 사용성 테스트(D-8, 실제 폰 5명), 카톡 인앱 실기기, 스크린리더 실기, 모임 수정 화면, 응답 마감 입력의 실제 날짜 선택기 디자인(브라우저 기본 `datetime-local`), 요일 모드 그리드 "1–5 / 7" 위치 안내 갱신.

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

### 그 뒤 (2차 PR 머지 후)
1. 새 질문 Q-19~22(`QUESTIONS.md` §F)에 기획 답변이 오면 반영.
2. 사용성 테스트(D-8, 실제 폰 5명) 결과로 A/B 확정 → 필요 시 B안 제거.
3. 최종: DAC 체크리스트(`DESIGN-SPEC.md` §9) 갱신, `lomeone-90-design-system-spec.md`(PRD README가 예고한 확정 토큰 문서) 작성 여부 사용자와 합의.

## 5. 작업 로그 (최신이 위. 작업 끝날 때마다 한 줄 이상 추가)
| 날짜 | 내용 | 산출물/PR |
| --- | --- | --- |
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
