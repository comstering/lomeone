# 개발 핸드오프 — 로미원 1단계 웹디자인 시안

> 기준: `LM-PRD-01` **v1.1** (기획서는 `../prd/`) · 시안 버전 **v0.2 (2차, 2026-10-29)** — 기획 답변·창업자 결정 반영
> 이 문서는 **개발자가 시안을 보고 무엇을 어떻게 옮기면 되는지**를 적어요. 값이 PRD와 다르면 PRD가 우선이고, 다른 곳은 아래 §8에 모아 두었어요.
> 확정 전 항목은 `QUESTIONS.md`를 보세요.

## 1. 시안 보는 법

```
cowork/design/
├─ index.html              ← 시작점. 모든 화면을 360px 프레임으로 한눈에 (색·다크·인앱 높이 전환)
├─ screens/                ← 화면별 동작하는 HTML (프레임워크 없음)
├─ assets/css/tokens.css   ← 디자인 토큰 (CSS 변수, 라이트/다크, 브랜드 색 A/B)
├─ assets/css/components.css ← 컴포넌트 스타일 (C-xx)
├─ assets/js/              ← 시안용 보조 스크립트 (그대로 쓰지 말고 참고만)
├─ assets/logo/            ← 로고 SVG 시안
├─ QUESTIONS.md            ← 질문·제안·결정 필요
└─ DESIGN-SPEC.md          ← 이 문서
```

브라우저에서 `index.html`을 열기만 하면 돼요 (서버 불필요, Pretendard만 CDN).
URL 쿼리로 상태를 전환해요: `?theme=dark` · `?inapp=1`(카톡 인앱 높이 흉내).

### 화면 ↔ 파일 ↔ 상태

| PRD ID | 파일 | 상태 보기 (`?` 뒤) |
| --- | --- | --- |
| SCR-01 홈 | `screens/home.html` | |
| SCR-02 약속 랜딩 + 용도 6종 | `screens/meet.html` | `for=team-project \| club \| dinner \| reunion \| study \| trip` |
| SCR-03 모임 만들기 | `screens/new.html` | `state=net` (제출 시 네트워크 실패 배너) |
| SCR-04 공유 시트 | `screens/new.html` (생성 직후 시트) | `sheet=1` |
| SCR-05 이름 입력 | `screens/m.html` | `v=name` (이름에 `민수` 입력 → 중복 오류) |
| SCR-06 칠하기 | `screens/m.html` | `v=paint` · `alt=b`(D-8 B안) · `filled=0`(빈 그리드) · `days=8`(가로 넘김) · `coach=0` · `v=paint-dow`(요일 모드) · `v=paint-closed`(응답 마감) |
| SCR-06b 날짜만 | `screens/m.html` | `v=dateonly` |
| SCR-07 결과 | `screens/m.html` | `v=result` · `result-one` · `result-none`(전원 없음+동률, 순위 1·1·3) · `result-short`(30분 자동 폴백) · `result-date`(날짜만) · `result-dow`(요일 모드) · `result-many`(24명) · `sheet=list \| key` |
| SCR-08 총무 | `screens/m.html` | `v=admin` · `admin-empty` · `admin-date` · `admin-many` · `change=1`(확정 시간 바꾸기) · `sheet=confirm \| menu \| delete \| list \| delr` |
| SCR-09 확정 | `screens/m.html` | `v=confirmed` · `confirmed-part` · `confirmed-changed` · `confirmed-changed-admin` · `confirmed-admin` · `confirmed-date`(하루 종일) · `confirmed-dow`(매주) · `past` · `sheet=cal \| menu \| uncf` · `toast=uncf` |
| 로딩 | `screens/m.html`, `my.html` | `m.html?v=loading` · `my.html?loading=1` |
| SCR-10 내 모임 | `screens/my.html` | `empty=1` |
| SCR-11 없음·만료 | `screens/gone.html` | `k=404 \| expired \| deleted` |
| SCR-12 문서 | `screens/about.html` | `doc=privacy \| terms` |
| SCR-13·14 OG·카카오 | `screens/og.html` | |
| 토큰·컴포넌트·로고 | `screens/brand.html` | |

`m.html` 한 파일이 `/m/[id]`의 여러 상태를 다 보여줘요. 실제로는 **서버/클라이언트가 (보는 사람 × 모임 상태)로 화면을 고르는 규칙**(PRD §5.3)을 구현해야 해요.

## 2. 디자인 토큰 (`assets/css/tokens.css`)

토큰 이름은 PRD §7.2 그대로예요. **브랜드 색은 D-5 확정(창업자, 2026-10-29): 민트 틸 `#0B7F70` + 겹친 두 원 로고 + Pretendard.** 미채택한 코발트 B안은 `assets/archive/brand-b.css`에 보관만 해요(개발에 쓰지 않음).

| 토큰 | 라이트 | 다크 | 용도 |
| --- | --- | --- | --- |
| `--bg` / `--bg-subtle` / `--surface` | #FFF / #F5F7F7 / #FFF | #0F1514 / #172120 / #1A2423 | 페이지 / 구역 / 카드 |
| `--text` / `--text-muted` / `--text-subtle` | #121817 / #4A5654 / #66726F | #EEF3F2 / #B4C0BD / #93A19E | 본문 / 보조 / 캡션 |
| `--border` / `--border-strong` | #E1E6E5 / #8A9693 | #2C3938 / #6E7D7A | 구분선 / 입력·정시선 |
| `--accent` / `--accent-fg` | #0B7F70 / #FFF | #3FCBB6 / #06201C | **브랜드 색 (확정)** |
| `--accent-subtle` / `--accent-ink` | #E3F4F1 / #075A4F | #17403B / #8FE9DA | 강조 배경 / 그 위 글자 |
| `--positive` / `--warning` / `--danger` | #166A2D / #9A5B00 / #C62828 | #5FD07F / #F2B550 / #FF8A80 | 성공 / 경고·빠지는 사람 / 오류·삭제 |
| `--danger-fg` | #FFF | #3A0D0D | danger 버튼 글자 |
| `--kakao-bg` / `--kakao-fg` | #FEE500 / #191919 | 동일 | 카카오 가이드 값 |
| `--heat-1`~`5` | `--accent`를 surface에 20·32·50·70·88% 섞음 (`color-mix`) | 동일 규칙 | 히트맵 6단계 (`--heat-0` = 0명) |
| `--heat-all` + `--heat-all-ring` | `--accent` + 검정 2px 테두리 + 줄무늬 | 흰 테두리 | 전원 가능 (**색만으로 구분 금지**) |
| `--focus-ring` | #1A5FD0 | #7AA8FF | 2px |

**대비 확인 (계산값, WCAG 상대 휘도 기준):** 본문 18:1 · muted 7.6:1 · subtle 5.0:1 (bg-subtle 위 4.65:1) · 흰 글자/accent 4.9:1 · accent-ink/accent-subtle 7.2:1 · warning/bg 5.4:1 · danger/bg 5.6:1 · border-strong/bg 3.06:1(UI 3:1 통과, 여유 작음) · 다크: 본문 16.5:1, accent-fg/accent 8.5:1. 전수 검사는 아직이에요.

**Tailwind 4로 옮길 때:** `tokens.css`의 변수를 `@theme { --color-bg: var(--bg); … }`로 노출하면 돼요. 다크는 `prefers-color-scheme`이 기본이고 `[data-theme]`는 시안 미리보기용이에요 (서비스에서 수동 전환을 안 쓰면 삭제).

타이포(`components.css`의 `.t-*`)는 PRD §7.3 표 그대로: `display 28/36 → 44/52`, `h1 22/30 → 28/36`, `h2 18/26 → 20/28`, `confirm-xl 32/40 → 40/48`, `body 16/24`, `label 15/22 600`, `grid 12/16 → 13/18`, `caption 13/18`. 숫자는 `font-variant-numeric: tabular-nums`(body 전체).

## 3. 컴포넌트 ↔ 클래스 (PRD §8)

| ID | 이름 | 시안 클래스 / 위치 | 비고 |
| --- | --- | --- | --- |
| C-01 | SiteHeader | `.site-header` (`default` / `compact` / `back` 3종, `shared.js`가 생성) | 56px, sticky |
| C-02 | SiteFooter | `.site-footer` | |
| C-03 | Button | `.btn.primary \| secondary \| ghost \| danger \| kakao` + `.lg`(52px) `.block` `.loading` | 기본 44px |
| C-04 | TextField | `.field` + `.input` (+ `.hint` `.err` `.counter`) | 입력 16px 고정 |
| C-05 | DatePickerMulti | `.cal` / `.dow-toggles` / `.day` | 탭 + 드래그 다중 선택, 31일 제한 |
| C-06 | TimeRangeSelect | `.time-range` + `.select` | 시안은 `<select>`. 모바일 네이티브 피커 권장 |
| C-07 | ModeSegmented | `.seg` (`role="radiogroup"`) | |
| C-08 | SlotGrid | `.slot` `data-mode="input \| heatmap \| highlight"` → §4 | 핵심 |
| C-09 | GridLegend | `.legend` | |
| C-10 | BestTimeCard | `.best` (`.first` = 1위) + `.all-badge` | 총무 모드는 `.cta` 버튼 포함 |
| C-11 | RespondentChips | `.resp-chips` + `.chip` | |
| C-12 | ShareSheet | `create.js` `mountShareSheet()` | |
| C-13 | KakaoShareButton | `.btn.kakao` | SDK 연동은 개발 |
| C-14 | Toast | `.toast` (+ 액션 버튼 `.toast-act`, 6초 유지) | 하단 고정 바 위. 확정 취소 직후 "알리기" |
| C-15 | BottomSheet/Dialog | `.sheet` + `.scrim` | 모바일 하단 시트 / ≥768px 가운데 모달 440px |
| C-16 | ConfirmedCard | `.confirmed` (`.past`) | |
| C-17 | CalendarAddMenu | `#sh-cal` (`.menu`) | |
| C-18 | CreateCTA | `.create-cta` (점선·회색 배경 = 주 버튼보다 약한 위계) | |
| C-19 | MeetListItem | `.meet-item` | |
| C-20 | EmptyState | `.empty` | |
| C-21 | Banner | `.banner.info \| warning \| error` | |
| C-22 | StatusBadge | `.badge.progress \| confirmed \| expired \| admin` | |
| C-23 | MeetSummaryHeader | `.summary` | |
| C-24 | OGImageTemplate | `screens/og.html` | |
| C-25 | DateOnlyChoice | `.date-choice` | |
| C-27 | HowItWorks | `.how` | |
| C-28 | HeroDemo | `home.html`의 `.demo` | CSS 애니메이션, reduced-motion 대응 |
| C-29 | MeetCreateForm | `create.js` `createForm()` | SCR-02·03 공통 |
| C-30 | FAQAccordion | `.faq` (`<details>`) | JS 없음 |
| C-31 | SubmitBar | `.submit-bar` | `env(safe-area-inset-bottom)` 포함, ≥1024px에서는 흐름 안으로 |
| C-32 | AdminActions | `m.html`의 `#sh-menu` `#sh-confirm` `#sh-del` | |
| 기능 아이콘 6종 | `shared.js` `featureIcon(name)` · `brand.html` §5 | 약속·사다리·팀나누기·돌림판·자리배치·롤링페이퍼 (선 2.25px · 채움 1톤). 1단계는 약속만, "곧 나와요" 카드에 4종 |
| 로딩 | `.skeleton` | 모임 페이지·내 모임 |
| C-26 | ToolNav | **미작성** (1단계는 홈 "곧 나와요"만) | |

## 4. SlotGrid 구현 메모 (C-08) — 가장 중요한 컴포넌트

시안 코드는 `assets/js/grid.js`. 규칙은 PRD §6 SCR-06 그대로예요.

- **구조:** 날짜 열(헤더 sticky) × 30분 행. 셀 높이 32px, 날짜 열 최소 폭 56px, 시간축 44px. 정시 선 `--grid-hour-line`(진함), 30분 선 `--grid-half-line`(옅음).
- **입력:** Pointer Events. 셀에 `touch-action: none` (그 위에서 스크롤 안 됨), 시간축은 `touch-action: pan-y` (**세로 스크롤 손잡이**, D-8 A안). 시작 칸이 빈 칸이면 칠하기, 칠한 칸이면 지우기 모드. 드래그 범위는 사각형(날짜 × 시간), 드래그 중에는 `.prev-paint`/`.prev-erase` 미리보기, 손가락 위에 "수 19:00–21:00" 말풍선.
- **자동 스크롤:** 그리드 위·아래 가장자리 48px에 닿으면 스크롤 (시안은 `requestAnimationFrame`, 속도 8px/프레임).
- **날짜 헤더 탭 = 그 날 전부 토글.** "전부 가능"은 전체 칠하기 ↔ "전부 지우기".
- **D-8 B안:** `alt=b` → "칠하기 모드" 토글. 끄면 `.paint-off`로 셀도 `touch-action: pan-y`.
- **키보드(PRD §11):** 방향키 이동(roving tabindex) · Space/Enter 토글. **Shift+방향키 범위 선택은 시안에 없음** → 개발 때 추가.
- **스크린리더:** 셀 `aria-label="10월 29일 수요일 오후 7시"` + `aria-selected`. 히트맵 셀은 탭 시 말풍선에 "수 19:30 · 4/5명 · 민수 빠짐"(시안은 시각만; 라이브 리전 연결은 개발).
- **스크롤 방식(Q-18 확정, PRD v1.1):** 그리드는 **자체 세로 스크롤 컨테이너**(`max-height: min(680px, 100dvh − 250px)`) + 날짜 헤더 고정. 카톡 인앱 높이(약 580px)에서 8행 이상 보이고(실측 9행), 그리드 끝에 닿으면 페이지 스크롤로 이어지도록 **`overscroll-behavior: contain`은 쓰지 않아요**. 결과 화면은 처음에 정답 구간(19시 근처)이 보이게 `scrollTo`로 시작해요.
- **추천 시간 계산(시안 `m.html` `candidates()` — 개발 알고리즘 참고):** 같은 사람 집합이 유지되는 최대 연속 구간을 후보로 → 정렬 인원 ↓ → 연속 길이 ↓ → 이른 날짜 → 같은 날 겹치는 후보 제외 → 최대 3개 → 공동 순위(1·1·3). 최소 길이 필터 [30분|1시간|2시간], 1시간 이상 구간에 2명 이상 겹침이 없으면 30분으로 자동 폴백 + 캡션. 날짜만 모드는 점수 = 돼요 1 + 애매 0.5(동률 → 돼요 수 → 이른 날짜).
- **요일 모드:** `buildGrid({dow:true})` 헤더는 요일만("수"), 결과 "매주 수 19:00–21:00", 확정 "매주 수요일" + 캘린더는 매주 반복 일정.
- **히트맵:** 칸당 응답 수 `c`/전체 `N` → `ceil(c/N·5)`로 `--heat-1~5`, `c = N`이면 `.hAc`(전원). 같은 칸에서 색 + 2px 테두리 + 줄무늬로 표시.
- **큰 범위:** 6일 이상이면 가로 넘김 (`.slot-scroll` 가로 스크롤 + "1–5 / 8일" 안내. 시안의 안내 숫자는 고정 문구라서 스크롤 위치에 따라 바뀌게 구현 필요).

## 5. 레이아웃 · 반응형 (PRD §7.1, §9)

| 구간 | 시안 규칙 |
| --- | --- |
| 모바일 (기본, 360 → 320까지) | 1열, 거터 16px, 하단 고정 바 |
| ≥768px | 거터 24px, 시트 → 가운데 모달 |
| ≥1024px | 거터 32px, 결과/응답 2단 (`.split`: 왼쪽 그리드, 오른쪽 360px 패널), 하단 고정 바 → 흐름 안 |
| 콘텐츠 최대 | 1200px(홈), 모임 페이지 1100px, 폼 560px, 확정·이름 입력 600px, 문서 680px |

## 6. 모션 (PRD §7.6)

칠하기 0ms · 버튼 120ms ease-out · 시트 240ms `cubic-bezier(.2,.8,.2,1)` · 토스트 200ms/3초 · 확정 카드 종이조각 1.2초 1회. `prefers-reduced-motion`이면 전부 즉시, 종이조각·히어로 애니메이션 생략 (CSS 처리됨).
시안에서 **구현 안 된 것:** 응답 제출 → 결과 전환 300ms (페이지 이동으로 대체), 시트 드래그로 닫기.

## 7. 접근성 체크 (시안 기준)

- 모든 입력에 보이는 라벨. placeholder는 예시용.
- 정보는 색만으로 전달하지 않음: 전원 칸 = 색 + 테두리 + 줄무늬, 빠지는 사람 = 색 + 이름 글자, 상태 배지 = 색 + 글자, 날짜 선택 = 색 + 채움 + 굵기.
- 포커스 링 2px (`--focus-ring`) 전 요소. 시트는 ESC로 닫고 열릴 때 첫 요소에 포커스 (**포커스 트랩은 시안에 없음 → 개발 구현**).
- 터치 타깃 44px (예외: 그리드 셀 32px, 날짜 칸 40px).

### 7-1. 2차 검수에서 시안에 반영한 개발 요구사항
- 시트(C-15): 열리면 배경 `inert`, 닫힐 때 열었던 요소로 포커스 복귀, 닫힌 시트는 `visibility:hidden`(Tab 제외). 시트 열림 시 **시트 자체**에 포커스(첫 버튼 아님).
- SlotGrid: `role="grid"` > `row` > `columnheader/rowheader/gridcell`. 히트맵 셀 라벨은 "날짜 시각, n/N명 가능".
- 버튼 안에 버튼/링크를 중첩하지 않는다 (총무용 BestTimeCard = 컨테이너 + 별도 "이 시간으로 확정" 버튼).
- 파괴적 동작(모임 삭제·확정 취소)은 확인 시트를 거친다.
- 다크 모드: `<meta name="color-scheme">`, `theme-color`(라이트/다크 각각). `--danger-fg` 토큰 추가(다크 danger 버튼 글자색).
- 날짜·숫자 표기는 하드코딩 대신 `Intl.DateTimeFormat('ko-KR')` / `Intl.NumberFormat`.
- 브랜드명 `lomeone`은 `translate="no"`. 이름·모임 이름 입력은 `spellcheck="false"`, 이름은 `autocomplete="nickname"`.

## 8. PRD와 다르거나 PRD에 없는 부분 (시안이 결정한 것)

1. **그리드 스크롤 컨테이너(확정됨, Q-18)** — 위 §4. 날짜 헤더를 sticky로 두려고 자체 세로 스크롤로 만들었어요. 페이지 스크롤로 바꾸면 날짜 헤더는 `position: sticky; top: 56px`(사이트 헤더 아래)로 두면 되지만, 가로 넘김(`overflow-x`)이 있는 컨테이너 안에서는 sticky가 깨져서 **헤더를 별도 가로 스크롤 동기화**해야 해요.
2. **SCR-02 만들기 버튼** — 360×640 첫 화면에 달력 2주까지 넣으면 버튼이 밀려서, 랜딩에서도 **하단 고정 바**로 뒀어요 (DAC-01 충족 방식).
3. **하단 고정 바 높이** 72px (버튼 52 + 위아래 10 여백). 카톡 인앱에서는 상·하단 카톡 바가 더 가리므로 `?inapp=1`로 확인하세요.
4. **확정 카드** 브랜드 색 꽉 채움 (Q-15).
5. **이모지** 🎉만 사용, 그 외 선형 아이콘 (PRD §10.1이 허용).
6. **버튼 위계** — 화면당 primary 1개. 생성 유도(C-18)는 점선 카드 + secondary 버튼으로 약하게.
7. **`--warning` 호박색**으로 "빠지는 사람" 표시 (빨강 금지 원칙).
8. **그리드 날짜 헤더 1줄 (E-07)** — PRD §7.4는 "월/일 + 요일" 2줄이지만 시안은 "10/29수" 1줄이에요. 5열(열 폭 56px)·320px에서 안 잘려서 유지하고, 요일 모드는 요일 한 글자만 크게 보여줘요. 개발에서 2줄로 바꿔도 되지만 헤더 높이가 늘어 그리드 가시 행이 1행 줄어요.
9. **샘플 응답 하나를 모든 화면이 공유 (E-02)** — 금 추천이 PRD 예시(19:00–20:00)와 달리 19:00–21:00으로 나와요. 같은 데이터로 계산한 값이라 일관성을 우선했어요.
10. **총무 카드는 버튼 중첩 금지** — 총무 모드 BestTimeCard는 `div` + 별도 "이 시간으로 확정" 버튼 (참여자 모드는 `button`: 탭 → 히트맵 하이라이트).
11. **"이 이름으로 수정하기" 링크 삭제 (Q-02)** — 다른 기기에서 같은 이름은 막고(덮어쓰기 불가), 같은 기기는 기기 토큰으로 "내 응답 수정". 총무가 응답 삭제 (응답 관리 시트 → 확인 시트).
12. **공유 시트(E-08·Q-09)** — 썸네일을 가로 배치로 줄여 360×640 첫 화면에 [카카오톡으로 보내기]와 [카톡 '나와의 채팅'에 저장]이 보여요. 나와의 채팅 저장은 로그인 필요한 "나에게 보내기" API가 아니라 일반 카카오 공유로 총무 링크를 보내고 받는 곳을 '나와의 채팅'으로 고르게 하는 방식 (개발은 D-4 확인).

## 9. QA 체크 (PRD §13) — 현재 상태

| 항목 | 상태 |
| --- | --- |
| DAC-01 360×640 주 버튼 첫 화면 | **실측 완료**(헤드리스 Chrome, 360×640·360×580·320×568): SCR-01·02·03·05·06·07·08·09 통과. SCR-04는 캡처로 카톡 버튼 노출 확인(2차: 총무 링크 영역의 "나와의 채팅 저장"까지 첫 화면 안). 실제 기기 미확인 |
| DAC-02·03·04 사용성 테스트 | **미실시** (사용자 필요) |
| DAC-05 대비 | 주요 조합 계산 (§2). 전수 검사 미실시 |
| DAC-06 색각 이상 | 계산 시뮬레이션 완료(Machado 1·2·3형, 라이트/다크): 히트맵 인접 단계 ΔE ≥ 5. 전원 칸은 테두리 + 줄무늬 병행. 실사용자 확인 미실시 |
| DAC-07 상태 체크리스트 | 주요 상태 + 2차 추가 상태(마감·요일·날짜만·20명+·로딩) 구현. 눌림(active) 상태는 버튼만, 나머지 일부 누락 |
| DAC-08 문구 | PRD §10.2 문구 사용. 임시 문구 없음 (법적 문서 샘플 본문과 FAQ 답변은 예외 — FAQ는 제가 쓴 초안) |
| DAC-09 카톡 미리보기 실제 크기 | `og.html`에 정사각 크롭·최장 이름 케이스 포함, 실제 카톡 확인 **미실시** |
| DAC-10 로고 16px | 파비콘 16/32/180 PNG + SVG 제작(`assets/favicon/`), `brand.html`에서 확인. 카톡 썸네일 실물 확인 미실시 |
| 320px / 최장 이름 | 모임 이름 40자·이름 20자 샘플은 `brand.html`에 일부. 320px 전수 확인 미실시 |
