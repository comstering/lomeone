# cowork/develop — 개발 작업 규칙 (Claude용)

1. **세션을 시작하면 먼저 `PROGRESS.md`를 읽는다.** 그다음 `DECISIONS.md`(확정/미결), `OPEN-QUESTIONS.md`(사용자 답변 대기)를 읽는다.
2. **작업 단위가 끝날 때마다 즉시** `PROGRESS.md`(§현황·§다음 할 일·§로그)를 갱신한다. 세션은 언제든 끊길 수 있으니 "나중에 정리"하지 않는다.
3. 결정이 나면 `DECISIONS.md`에 번호(`DEV-n`)로 기록한다. 번복할 땐 지우지 말고 "대체됨 → DEV-m"으로 남긴다.
4. 백엔드에 요청할 것은 `BACKEND-REQUESTS.md`에 모은다 (백엔드는 사용자가 별도 구현).
5. 기준 문서: `../prd/`(기획), `../design/`(시안·`DESIGN-SPEC.md`). 다르게 구현한 부분은 `DECISIONS.md`에 이유와 함께 적는다.
6. 브랜치·PR: `main` 직접 작업 금지. `origin/main`에서 새 브랜치 → push → `gh pr create --base main`. 머지·pull은 사용자가 한다.
7. 확인하지 않은 것을 "완료"라고 쓰지 않는다. 못 한 검증은 `PROGRESS.md`의 "아직 안 한 것"에 남긴다.
8. 커밋: `feat:` / `refactor:` / `fix:` / `docs:` 형식.
