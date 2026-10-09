// 룰셋 파일 검증. scripts/check-rules.ts(빌드)와 테스트가 함께 쓴다.
import { rulesetSchema, type Ruleset } from "./schema.ts";

export interface RulesetFile {
  file: string;
  data: unknown;
}

export interface SourcedField {
  path: string;
  value: unknown;
  source: string | null;
  verifiedAt: string | null;
  note?: string;
}

export interface ValidationReport {
  rulesets: Ruleset[];
  errors: string[];
  /** 확인일이 비어 있는 필드. strict 모드에서는 errors로 올라간다 */
  unverified: SourcedField[];
}

function isSourced(node: unknown): node is SourcedField {
  return (
    typeof node === "object" &&
    node !== null &&
    "value" in node &&
    "source" in node &&
    "verifiedAt" in node
  );
}

/** 룰셋 안의 출처 달린 필드를 모두 모은다 */
export function collectSourcedFields(node: unknown, path = ""): SourcedField[] {
  if (isSourced(node)) return [{ ...node, path }];
  if (typeof node !== "object" || node === null || Array.isArray(node)) return [];
  return Object.entries(node).flatMap(([key, child]) =>
    collectSourcedFields(child, path ? `${path}.${key}` : key),
  );
}

export function validateRulesets(
  files: RulesetFile[],
  { strict }: { strict: boolean },
): ValidationReport {
  const errors: string[] = [];
  const unverified: SourcedField[] = [];
  const rulesets: Ruleset[] = [];

  for (const { file, data } of files) {
    const parsed = rulesetSchema.safeParse(data);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push(`${file}: ${issue.path.join(".")} — ${issue.message}`);
      }
      continue;
    }
    const ruleset = parsed.data;
    rulesets.push(ruleset);

    if (ruleset.effectiveFrom > ruleset.effectiveTo) {
      errors.push(`${file}: effectiveFrom(${ruleset.effectiveFrom})이 effectiveTo보다 늦다`);
    }

    for (const field of collectSourcedFields(ruleset)) {
      if (field.value !== null && field.source === null) {
        errors.push(`${file}: ${field.path} — 값이 있는데 출처(source)가 없다`);
      }
      if (field.verifiedAt === null) {
        unverified.push({ ...field, path: `${file}: ${field.path}` });
      }
    }
  }

  // 같은 나라 룰셋끼리 적용 기간이 겹치면 안 된다
  const byCountry = Map.groupBy(rulesets, (r) => r.country);
  for (const list of byCountry.values()) {
    const sorted = list.toSorted((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]!;
      const cur = sorted[i]!;
      if (cur.effectiveFrom <= prev.effectiveTo) {
        errors.push(`${prev.version}와 ${cur.version}의 적용 기간이 겹친다`);
      }
    }
  }

  if (strict) {
    for (const field of unverified) {
      errors.push(`${field.path} — 공식 출처 확인일(verifiedAt)이 없다`);
    }
  }

  return { rulesets, errors, unverified };
}
