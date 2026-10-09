// 룰셋 스키마 (PRD §11.1). 빌드 시 검증(scripts/check-rules.ts)과 테스트에서만 쓴다.
// 런타임 코드는 zod를 import하지 말고 `import type`으로 타입만 가져간다 (번들 예산, review B-4).
import { z } from "zod";

const isoDate = z.iso.date();

/** 모든 수치 필드는 값·출처·확인일을 함께 가진다 (FR-10). */
function sourced<T extends z.ZodType>(value: T) {
  return z.object({
    value,
    /** 공식 문서 URL. 값이 정해져 있으면 필수 (validate.ts) */
    source: z.url().nullable(),
    /** 공식 출처와 대조한 날짜. null이면 프로덕션 빌드가 실패한다 */
    verifiedAt: isoDate.nullable(),
    /** 확인 범위·미확인 사유 등 사람을 위한 메모 */
    note: z.string().optional(),
  });
}

const rate = z.number().min(0).max(1);
const won = z.number().int().nonnegative();

/** 끝전 처리: unit 미만을 절사한다. 예: 10 → 10원 미만 절사 */
const truncateUnit = z.union([z.literal(1), z.literal(10), z.literal(100), z.literal(1000)]);

export const taxBracketSchema = z.object({
  /** 과세표준 상한(이하). 마지막 구간은 null */
  upTo: won.nullable(),
  rate,
});

export const rulesetSchema = z.object({
  country: z.literal("KR"),
  version: z.string().regex(/^\d{4}\.\d{2}\.\d+$/),
  effectiveFrom: isoDate,
  effectiveTo: isoDate,
  socialInsurance: z.object({
    nationalPension: z.object({
      /** 근로자 부담률 (사업장가입자 보험료율의 절반) */
      employeeRate: sourced(rate),
      baseMonthlyIncomeMin: sourced(won),
      baseMonthlyIncomeMax: sourced(won),
      /** 기준소득월액 끝전 절사 단위 */
      baseIncomeTruncateUnit: sourced(truncateUnit),
      /** 보험료 끝전 절사 단위 */
      premiumTruncateUnit: sourced(truncateUnit.nullable()),
    }),
    health: z.object({
      /** 직장가입자 보험료율 (근로자+사용자 합계) */
      totalRate: sourced(rate),
      employeeRate: sourced(rate),
      premiumTruncateUnit: sourced(truncateUnit.nullable()),
    }),
    longTermCare: z.object({
      /** 소득 대비 장기요양보험료율 (합계) */
      incomeRate: sourced(rate),
      /** 건강보험료 대비 비율 (공단 공표값) */
      rateOfHealthPremium: sourced(rate),
    }),
    employment: z.object({
      /** 실업급여 근로자 부담률 */
      employeeRate: sourced(rate),
    }),
  }),
  incomeTax: z.object({
    localIncomeTaxRate: sourced(rate),
    /** 종합소득세 기본세율. 간이세액표 최상단 구간 산식(US-004)과 계산 기준 페이지에 쓴다 */
    brackets: sourced(z.array(taxBracketSchema).min(1)),
  }),
  nonTaxable: z.object({
    mealAllowanceMonthly: sourced(won),
  }),
  pension: z.object({
    replacementRate: sourced(rate),
    /** 전체 가입자 평균소득월액(A값). 미확정이면 null */
    aValueMonthly: sourced(won.nullable()),
  }),
  acquisitionTax: z.object({
    /** 1주택·전용 85㎡ 이하 유상거래 가정 (PRD §11.3) */
    housing: sourced(
      z.object({
        /** 이 금액 이하는 lowRate */
        lowThreshold: won,
        lowRate: rate,
        /** 이 금액 초과는 highRate. 사이 구간은 (취득가액 × 2/3억 − 3)% 직선 */
        highThreshold: won,
        highRate: rate,
        /** 지방교육세 = 취득세 × 이 비율 */
        localEducationTaxRatio: rate,
      }),
    ),
  }),
});

export type Ruleset = z.infer<typeof rulesetSchema>;
export type TaxBracket = z.infer<typeof taxBracketSchema>;
