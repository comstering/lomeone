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

## 3. 현재 상태 (v0.1, main에 머지됨: PR #7 prd, #8 design)
- 시안: 동작하는 정적 HTML/CSS/JS (프레임워크 없음). 시작점 `index.html`.
- 화면: SCR-01~12, 06b, OG·카카오 템플릿(SCR-13·14) 완료. 컴포넌트 C-01~32 중 C-26(ToolNav) 제외 완료.
- 파일: `screens/{home,meet,new,m,my,gone,about,og,brand}.html`, `assets/css/{tokens,components}.css`, `assets/js/{shared,grid,create}.js`, `assets/logo/*.svg`.
- `m.html`은 `/m/[id]`의 모든 상태를 `?v=` 쿼리로 보여준다(name, paint, dateonly, result, result-one, result-none, admin, admin-empty, confirmed, confirmed-part, confirmed-changed, confirmed-admin, past). 기타 쿼리: `sheet=`, `alt=b`, `days=8`, `filled=0`, `coach=0`, `theme=dark`, `brand=b`, `inapp=1`. 전체 표는 `DESIGN-SPEC.md` §1.
- 브랜드 색 2안(A 민트 틸 `#0B7F70` 기본 / B 코발트 `#2F55D4`), 로고 2안(A 겹친 두 원 권장 / B 채워지는 칸). 아직 창업자 선택 전(D-5).

### 내가 내린 설계 결정 (PRD에 없거나 달라진 것)
1. 그리드는 자체 세로 스크롤 컨테이너(max 680px)에 넣고 날짜 헤더 sticky → `QUESTIONS` Q-18.
2. SCR-02(랜딩)도 만들기 버튼을 하단 고정 바로 (DAC-01 충족 위해).
3. 확정 카드는 브랜드 색 꽉 채움 (Q-15).
4. 이모지는 🎉만, 나머지 선형 아이콘. "곧 나와요" 카드 아이콘은 임시 이모지.
5. "빠지는 사람"은 호박색(`--warning`), 동률이면 둘 다 1위로 표시 (Q-05).
6. `--positive`를 `#166A2D`로 (배지 대비 4.5:1 확보).

### 아직 안 한 것 / 알려진 한계 (정직한 현황)
- 사용성 테스트(DAC-02·03·04, D-8), 실제 카톡 인앱 기기 확인, 색각 이상 시뮬레이션: **미실시**
- 미작성 화면/상태: 날짜만·요일 모드 결과(Q-04), 총무 키 없음 안내(Q-08), 모임 수정, 응답 마감(P1), 응답자 20명+ 펼치기(S-06), 로딩 스켈레톤
- 그리드 Shift+방향키 범위 선택, 시트 포커스 트랩, 시트 드래그 닫기: 시안에 없음(개발에서 구현)
- 카카오 심볼은 일반 말풍선 아이콘(공식 자산 교체 필요), 파비콘 PNG·단색/다크 로고 미제작
- 법적 문서 본문·FAQ 답변은 내가 쓴 샘플

## 4. 다음 할 일 (우선순위 순)
1. 사용자(기획자/창업자)가 `QUESTIONS.md` 답변 칸에 적은 것을 읽고 → 시안·`DESIGN-SPEC.md` 반영, 반영한 질문은 `QUESTIONS.md`에 "반영됨" 표시.
2. 답이 오면 2차 시안: Q-04(날짜만·요일 결과), Q-08, Q-11, S-06 화면 추가.
3. D-5 확정 후: 로고 단색/다크 SVG, 파비콘 16/32/180 PNG, 확정 색을 `tokens.css` 기본값으로 고정(안 고른 쪽은 제거 또는 보관).
4. 최종: DAC 체크리스트(`DESIGN-SPEC.md` §9) 갱신, `lomeone-90-design-system-spec.md`(PRD README가 예고한 확정 토큰 문서) 작성 여부 사용자와 합의.

## 5. 작업 로그 (최신이 위. 작업 끝날 때마다 한 줄 이상 추가)
| 날짜 | 내용 | 산출물/PR |
| --- | --- | --- |
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
