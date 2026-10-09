// 룰셋 데이터와 선택 함수. 런타임 번들에 들어가므로 zod를 import하지 않는다.
// 데이터 형식은 빌드 시 scripts/check-rules.ts가 스키마로 검증한다.
import type { Ruleset } from "./schema";
import kr202601 from "../kr/2026-01.json";
import kr202607 from "../kr/2026-07.json";

export type { Ruleset, TaxBracket } from "./schema";

export type Country = Ruleset["country"];

export interface Sourced<T> {
  value: T;
  source: string | null;
  verifiedAt: string | null;
  note?: string;
}

// JSON import는 리터럴 타입이 넓어지므로 단언한다. 형식 보장은 빌드 시 검증이 맡는다.
export const rulesets = [kr202601, kr202607] as unknown as readonly Ruleset[];

/**
 * 계산 기준일에 적용되는 룰셋을 고른다 (FR-9).
 * @param date YYYY-MM-DD. 현재 시각은 호출 측이 정해서 넘긴다.
 * @returns 해당 기간 룰셋이 없으면 null
 */
export function getRuleset(country: Country, date: string): Ruleset | null {
  return (
    rulesets.find(
      (r) => r.country === country && r.effectiveFrom <= date && date <= r.effectiveTo,
    ) ?? null
  );
}
