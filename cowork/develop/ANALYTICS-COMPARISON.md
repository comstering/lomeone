# ANALYTICS-COMPARISON — 이벤트 수집/분석 도구 비교 (Q-7)

작성: 2026-10-30. 근거: PRD F-19, §9.2 + 웹 검색 요약. **라이선스·기능·리소스 수치는 도입 전 각 프로젝트 저장소에서 재확인할 것** (검색 결과 일부는 벤더 블로그라 신뢰도가 낮다).

## 1. 우리가 필요한 것 (PRD F-19, SC-09)
- 이벤트 14종 + 속성(`source`, `method`, `rank` …). **이름·가능 시간 원값 전송 금지**, 쿠키 없음.
- **퍼널**: 랜딩 → 생성 → 공유 → 첫 응답 → 응답 5명 → 확정 / 성장 퍼널: 응답 제출 → 생성 유도 노출 → 클릭 → 생성(H-2). 8주 뒤 가설 H-1~5 판정에 쓴다 → **퍼널·속성 분해가 핵심**.
- 부수: 유입 경로(카톡 인앱 vs 검색), Web Vitals(SC-05: LCP/INP/CLS)와 오류 → 이건 분석이 아니라 **RUM/Observability 영역**.
- 제약: 비용 최소, OSS, k8s Self-Hosted 선호, 1인+AI 운영(PR-8).

## 2. 두 층으로 나눠서 보면 정리가 쉽다
| 층 | 질문 | 후보 |
| --- | --- | --- |
| 제품 분석(퍼널·이벤트) | 가설이 맞았나? | Umami / Plausible CE / Rybbit / OpenPanel / PostHog / Matomo / Amplitude·Segment(SaaS) |
| RUM·오류(Observability) | 느리거나 깨지나? | OpenTelemetry 브라우저 SDK / Grafana Faro(→Alloy→Loki·Tempo) / Sentry(PRD 언급) |

DevOps가 준비 중인 Observability와 겹치는 부분은 **두 번째 층**이다. 첫 번째 층(비즈니스 퍼널)은 RUM 도구로 하면 퍼널 UI가 불편하다.

## 3. 후보 비교
| 도구 | 라이선스 | 스토리지/구성 | 퍼널·이벤트 속성 | k8s 부담 | 비고 |
| --- | --- | --- | --- | --- | --- |
| **Umami** | MIT | Node + PostgreSQL(또는 MySQL) | 이벤트·속성, 퍼널/여정/리텐션 제공(v2~) | **낮음** (컨테이너 1 + PG) | 가볍고 라이선스 가장 관대. 커뮤니티 Helm 차트 존재(검증 필요) |
| Plausible CE | AGPLv3 | Elixir + PostgreSQL + **ClickHouse** (권장 2GB+ RAM) | 커스텀 이벤트·속성 가능. **퍼널 등 일부는 클라우드 전용**일 가능성(확인 필요) | 중간 (CH 운영) | 페이지뷰 중심 UX 최상. CE 업데이트가 연 2회 정도로 느림 |
| Rybbit | AGPL-3.0 | ClickHouse 기반 | 퍼널·리텐션·세션 리플레이 등 OSS에 포함(주장, 검증 필요) | 중간 | 신생, 커뮤니티·문서 작음. **세션 리플레이는 우리 PR-5(최소 수집)와 충돌 → 끌 것** |
| OpenPanel | (OSS, 라이선스 확인 필요) | ClickHouse 계열 | 웹+제품 분석 겸용, 이벤트 중심 | 중간 | 신생 |
| PostHog (self-host) | MIT(코어) | ClickHouse + Kafka + Redis + 워커 다수 | 최강(퍼널·A/B·플래그) | **높음** | 소규모엔 과함. 대규모 self-host 공식 지원 제약 있음(확인 필요) |
| Matomo | GPL | PHP + MySQL | 퍼널 등은 유료 플러그인 | 중간(PHP) | 무겁고 UI 구식 |
| Amplitude / Segment | 상용 SaaS | — | 최강 | 없음 | **비용**, 데이터가 외부로 나감(PR-5 부담). DevOps가 검증 중 |
| Jitsu (이벤트 파이프라인) | MIT | 수집→웨어하우스/DB | 분석 UI 없음(별도 BI 필요) | 중간 | Segment 대체 수집기. Observability 파이프라인과 결합 가능 |

## 4. 추천
**1순위 결정은 도구가 아니라 "프론트에서 어댑터 한 겹"이다.**
- `packages/analytics`(또는 `apps/web/src/lib/analytics`)에 `track(eventName, props)` 인터페이스 하나만 두고, 이벤트 이름·속성은 타입으로 고정(F-19 목록, **개인정보 필드는 타입에서 금지**).
- 구현체는 교체 가능: `console`(개발) / `umami` / `plausible` / `segment-compatible` / `noop`. DevOps 검증 결과가 나와도 프론트 수정은 어댑터 한 파일.
- 서버 이벤트(`meet_created`, `meet_confirmed`)는 백엔드가 같은 이벤트 스키마로 보낸다(스키마는 이 레포의 타입/JSON Schema를 단일 출처로).

**도구 추천(비용 최소·OSS·k8s):**
1. **Umami (Self-Hosted)** — 가볍고(PG만), MIT, 퍼널·속성 지원, k8s에 한두 개 파드. 1단계의 가설 판정(H-1~5)에 충분하다고 판단.
2. DevOps가 이미 ClickHouse 기반 스택을 준비한다면 **Plausible CE 또는 Rybbit**도 합리적 (퍼널 기능 가용 여부를 먼저 확인).
3. **PostHog self-host, Amplitude/Segment는 1단계엔 비추천** (운영 부담 또는 비용·외부 전송).

**RUM(Web Vitals·오류)은 분석 도구와 분리:** DevOps의 Observability가 OTel/Faro를 제공하면 거기에 붙이고, 그 전엔 Next/Vercel 기본 Web Vitals 리포트로 대체. Sentry는 PRD §9.5 언급이 있으나 비용/OSS 요건과 DevOps 방향에 맞춰 재논의.

## 5. 사용자에게 필요한 결정 (DevOps와 정렬)
1. 1단계 분석 도구를 임시로 Umami로 시작해도 되는가? (아니면 DevOps 결과 대기)
2. DevOps의 이벤트 수집 파이프라인(Segment 호환 등)의 **수집 엔드포인트 형식**이 정해지면 어댑터 구현체로 추가.
3. 프론트 이벤트와 서버 이벤트의 스키마 단일 출처 위치.
