# CLAUDE.md

@AGENTS.md

## 프로젝트 개요

- Next.js 16.4 (App Router, Turbopack, Cache Components) + React 19 + TypeScript 5
- Tailwind CSS 4 (`@import "tailwindcss"` 방식, `src/app/globals.css`에서 `@theme`으로 토큰 정의)
- 패키지 매니저: yarn (1.22)
- 소스는 `src/app/`, 경로 별칭은 `@/*` → `src/*`
- 2026-10-09에 기존 Next 13 Pages Router 보일러플레이트를 지우고 `create-next-app@latest`로 새로 생성함

```bash
yarn dev      # 개발 서버
yarn build    # 프로덕션 빌드
yarn lint     # ESLint (.claude/** 는 제외됨)
```

## 브랜치 전략 (Trunk-based)

- `main` 하나가 트렁크다. `develop` 브랜치는 쓰지 않는다.
- 기능은 `main`에서 짧은 브랜치를 따서 개발하고 `main`에 바로 머지한다.
- `main`에 머지되면 dev/preview 환경에 자동 배포한다.
- 운영 배포는 원하는 시점의 `main` 커밋을 골라 내보낸다.

## 커밋 메시지 규칙

```
feat: Add message          # 기능 추가
refactor: Refactor message # 기능 수정 (개선)
fix: Fix message           # 기능 수정 (고침)
```

## 라이프커브(LifeCurve) MVP

이 레포의 사이트 루트(`/`)는 라이프커브 서비스다 (Vercel 배포).

- 기획서: `docs/lifecurve/prd-v1.0.md` — 엔진 알고리즘은 §10, 요율은 §11이 기준
- 검토 메모·결정 대기 항목: `docs/lifecurve/review.md`
- 진행 현황(단일 출처): `docs/lifecurve/plan.md` — 스토리를 끝내면 상태를 바로 갱신한다

**Next.js 16은 기존 지식과 다른 점이 많다.** 코드를 쓰기 전에 `node_modules/next/dist/docs/`의 관련 문서를 먼저 읽는다 (`yarn install` 후 존재).

## 설치된 Skills (웹페이지 제작용)

모두 `npx skills` CLI(skills.sh)로 **프로젝트 레벨**(`.claude/skills/`)에 Claude Code 전용으로 설치했다.
설치 이력은 `skills-lock.json`에도 기록된다. 스킬이 지워지면 아래 중 하나로 복구한다.

**전체 복구 (권장):**

```bash
npx skills experimental_install      # skills-lock.json 기준으로 전부 복원
```

**전체를 명령어로 재설치 (lock 파일도 없을 때):**

```bash
A="-a claude-code -y"
npx skills add vercel-labs/skills --skill find-skills $A
npx skills add Leonxlnx/taste-skill --skill design-taste-frontend $A
npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max $A
npx skills add pbakaus/impeccable --skill impeccable $A
npx skills add vercel-labs/agent-browser --skill agent-browser $A
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices $A
npx skills add vercel-labs/agent-skills --skill web-design-guidelines $A
npx skills add anthropics/skills --skill frontend-design $A
npx skills add anthropics/skills --skill webapp-testing $A
npx skills add currents-dev/playwright-best-practices-skill --skill playwright-best-practices $A
npx skills add cloudflare/skills --skill web-perf $A
npx skills add coreyhaines31/marketingskills --skill seo-audit $A
npx skills add wshobson/agents --skill tailwind-design-system $A
```

### 스킬 목록

| Skill | 용도 | 출처 (`owner/repo`) |
|---|---|---|
| find-skills | 필요한 스킬 검색/설치 안내 | `vercel-labs/skills` ([SKILL.md](https://github.com/vercel-labs/skills/blob/main/skills/find-skills/SKILL.md)) |
| design-taste-frontend | 웹 디자인 (taste skill v2, 안티 슬롭) | `Leonxlnx/taste-skill` ([tasteskill.dev](https://www.tasteskill.dev/)) |
| ui-ux-pro-max | UI/UX 가이드 (스타일, 팔레트, 폰트, 접근성) | `nextlevelbuilder/ui-ux-pro-max-skill` ([ui-ux-pro-max-skill.com](https://ui-ux-pro-max-skill.com/)) |
| impeccable | 프론트엔드 디자인/리뷰/폴리싱 | `pbakaus/impeccable` ([impeccable.style](https://impeccable.style/)) |
| agent-browser | 브라우저 자동화, 웹앱 테스트/QA | `vercel-labs/agent-browser` ([agent-browser.dev/skills](https://agent-browser.dev/skills)) |
| vercel-react-best-practices | Next.js/React 성능·패턴 | `vercel-labs/agent-skills` |
| web-design-guidelines | UI 접근성·웹 디자인 규칙 검수 | `vercel-labs/agent-skills` |
| frontend-design | Anthropic 공식 프론트엔드 디자인 | `anthropics/skills` |
| webapp-testing | Playwright 기반 웹앱 테스트 | `anthropics/skills` |
| playwright-best-practices | E2E 테스트 작성 규칙 | `currents-dev/playwright-best-practices-skill` |
| web-perf | 웹 성능 점검 | `cloudflare/skills` |
| seo-audit | SEO 점검 | `coreyhaines31/marketingskills` |
| tailwind-design-system | Tailwind 디자인 시스템 구축 | `wshobson/agents` |

### 설치 후 참고

- `impeccable`: 처음 한 번 `/impeccable init`으로 제품/디자인 방향 컨텍스트를 만들고, 필요하면 `/impeccable hooks on`으로 자동 디자인 체크를 켠다.
- `agent-browser`: 스킬은 얇은 안내 문서이고, 실제 동작은 `agent-browser` CLI가 필요하다 (CLI는 아직 미설치). 상세 지침은 `agent-browser skills get core`, 목록은 `agent-browser skills list`.
- 이 프로젝트는 **Tailwind v4**(CSS 우선 설정, `tailwind.config.js` 없음)다. 토큰은 `globals.css`의 `@theme`에 정의한다.
- 같은 이름의 스킬이 사용자 전역 플러그인(`anthropic-skills:*`)에도 있다. 프로젝트 쪽이 우선이니 중복 시 하나를 정리한다.
- 스킬 업데이트: `npx skills update`, 목록: `npx skills list`, 제거: `npx skills remove <name>`.
- `.claude/skills/` 안의 번들 JS가 린트에 걸리지 않도록 `eslint.config.mjs`에서 `.claude/**`를 제외했다.

## 스킬 설치 규칙

- 새 스킬은 `find-skills`(`npx skills find <키워드>`)로 찾고, **설치 전에 반드시 사용자에게 확인받는다.**
- 설치하면 위 목록·재설치 명령과 `skills-lock.json`에 바로 기록한다.

## 미설치 / 보류

- **GSD** (https://github.com/gsd-build/gsd-2): 링크된 문서(`docs/user-docs/skills.md`)는 스킬 설치 방식을 설명하는 페이지다. GSD 도구 자체를 설치할지는 사용자 확인 대기 중.
- **agent-browser CLI**: 스킬만 설치됨. 실제 브라우저 자동화를 쓰려면 CLI 설치 필요 (사용자 확인 후 진행).
