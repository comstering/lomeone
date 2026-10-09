# 라이프커브 (LifeCurve)

나이·월 실수령액·순자산 세 숫자로 90세까지의 자산 곡선을 그리는 웹 서비스.
기획·진행 현황은 [docs/lifecurve](docs/lifecurve/plan.md)에 있다.

## 구조

```
apps/web/          Next.js 앱 — 페이지, 화면, 저장, 계측
packages/engine/   계산 엔진 — 순수 함수 (런타임 의존성 0개, DOM·Node API 사용 불가)
packages/rules/    세제 룰셋 — 스키마, 요율 데이터
```

`rules`(값) → 주입 → `engine`(계산) → `web`(화면). 엔진은 룰셋 타입만 import하고 데이터는 호출 측이 넘긴다.

## 개발

pnpm(버전은 `package.json`의 `packageManager`)과 Node 24 이상이 필요하다.

```bash
pnpm install
pnpm dev          # apps/web 개발 서버
pnpm typecheck    # 전체 타입 검사
pnpm lint
pnpm test
pnpm build
```

특정 패키지만: `pnpm --filter @lifecurve/engine test`
