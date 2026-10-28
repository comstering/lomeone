# cowork/design — 작업 규칙 (Claude용)

1. **세션을 시작하면 먼저 `PROGRESS.md`를 읽는다.** 그다음 `QUESTIONS.md`에서 사용자가 답을 적었는지 확인한다.
2. **작업 단위가 끝날 때마다 즉시** `PROGRESS.md`의 §3 현황 / §4 다음 할 일 / §5 로그를 갱신한다. 세션은 언제든 끊길 수 있으니 "나중에 정리"하지 않는다.
3. 새 질문·의견·결정 필요는 바로 `QUESTIONS.md`에 추가하고, 답이 반영되면 "반영됨"으로 표시한다.
4. 시안이 바뀌면 `DESIGN-SPEC.md`(개발 핸드오프)도 같이 고친다.
5. 기준 문서는 `../prd/`. PRD와 다르게 한 부분은 `DESIGN-SPEC.md` §8에 적는다.
6. 브랜치·PR 규칙: `main` 직접 작업 금지, `origin/main`에서 새 브랜치 → push → `gh pr create --base main`. 머지·pull은 사용자가 한다.
7. 확인하지 않은 것을 "완료"라고 쓰지 않는다. 못 한 검증은 `PROGRESS.md` §3 "아직 안 한 것"에 남긴다.
