import { describe, expect, it } from "vitest";
import kr202601 from "../kr/2026-01.json";
import kr202607 from "../kr/2026-07.json";
import { getRuleset } from "./index";
import { collectSourcedFields, validateRulesets, type RulesetFile } from "./validate.ts";

const krFiles: RulesetFile[] = [
  { file: "kr/2026-01.json", data: kr202601 },
  { file: "kr/2026-07.json", data: kr202607 },
];

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

describe("getRuleset", () => {
  it("국민연금 기준소득월액 상한은 7월 1일에 바뀐다", () => {
    const june = getRuleset("KR", "2026-06-30");
    const july = getRuleset("KR", "2026-07-01");
    expect(june?.socialInsurance.nationalPension.baseMonthlyIncomeMax.value).toBe(6_370_000);
    expect(july?.socialInsurance.nationalPension.baseMonthlyIncomeMax.value).toBe(6_590_000);
  });

  it("기간의 첫날과 마지막 날을 포함한다", () => {
    expect(getRuleset("KR", "2026-01-01")?.version).toBe("2026.01.0");
    expect(getRuleset("KR", "2026-12-31")?.version).toBe("2026.07.0");
  });

  it("해당 기간 룰셋이 없으면 null", () => {
    expect(getRuleset("KR", "2025-12-31")).toBeNull();
    expect(getRuleset("KR", "2027-01-01")).toBeNull();
  });
});

describe("KR 룰셋 파일", () => {
  it("스키마·기간·출처 검사를 통과한다", () => {
    const { errors, rulesets } = validateRulesets(krFiles, { strict: false });
    expect(errors).toEqual([]);
    expect(rulesets).toHaveLength(2);
  });

  it("값이 있는 모든 필드에 출처 URL이 있다", () => {
    for (const { data } of krFiles) {
      for (const field of collectSourcedFields(data)) {
        if (field.value !== null) expect(field.source, field.path).toMatch(/^https:\/\//);
      }
    }
  });

  it("두 파일은 기준소득월액 상·하한과 기간만 다르다", () => {
    const strip = (r: typeof kr202607) => {
      const { version, effectiveFrom, effectiveTo, ...rest } = clone(r);
      const { baseMonthlyIncomeMin, baseMonthlyIncomeMax, ...pension } = rest.socialInsurance.nationalPension;
      return { ...rest, socialInsurance: { ...rest.socialInsurance, nationalPension: pension } };
    };
    expect(strip(kr202601)).toEqual(strip(kr202607));
  });
});

describe("validateRulesets", () => {
  it("출처 없는 값은 오류다", () => {
    const bad = clone(kr202607);
    bad.socialInsurance.health.totalRate.source = null as never;
    const { errors } = validateRulesets([{ file: "bad.json", data: bad }], { strict: false });
    expect(errors).toContainEqual(expect.stringContaining("socialInsurance.health.totalRate"));
  });

  it("적용 기간이 겹치면 오류다", () => {
    const overlap = clone(kr202607);
    overlap.version = "2026.06.0";
    overlap.effectiveFrom = "2026-06-01";
    const { errors } = validateRulesets(
      [krFiles[0]!, { file: "overlap.json", data: overlap }],
      { strict: false },
    );
    expect(errors).toContainEqual(expect.stringContaining("겹친다"));
  });

  it("스키마에 맞지 않는 값은 오류다", () => {
    const bad = clone(kr202607);
    bad.socialInsurance.employment.employeeRate.value = 9;
    const { errors } = validateRulesets([{ file: "bad.json", data: bad }], { strict: false });
    expect(errors.length).toBeGreaterThan(0);
  });

  it("strict 모드에서는 확인일이 빈 필드가 오류다", () => {
    const preview = validateRulesets(krFiles, { strict: false });
    const strict = validateRulesets(krFiles, { strict: true });
    expect(preview.unverified.length).toBeGreaterThan(0);
    expect(strict.errors).toHaveLength(preview.unverified.length);
  });
});
