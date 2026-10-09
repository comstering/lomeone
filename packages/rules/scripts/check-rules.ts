// 빌드 전 룰셋 검증 (US-003). 실패하면 빌드가 멈춘다.
// strict 모드(RULES_STRICT=1)에서는 확인일이 빈 필드도 오류다 (PRD §11.1).
// 출시 시 Vercel Production 환경 변수에 RULES_STRICT=1을 넣는다. 그 전에는 main 배포가 막히지 않도록 경고만 한다.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateRulesets, type RulesetFile } from "../src/validate.ts";

const RULESET_FILE = /^\d{4}-\d{2}\.json$/; // 세액표 등 다른 JSON은 제외

const root = join(import.meta.dirname, "..");
const files: RulesetFile[] = [];
for (const country of ["kr"]) {
  const dir = join(root, country);
  for (const name of readdirSync(dir).filter((n) => RULESET_FILE.test(n)).sort()) {
    files.push({ file: `${country}/${name}`, data: JSON.parse(readFileSync(join(dir, name), "utf8")) });
  }
}

const strict = process.env.RULES_STRICT === "1";
const { rulesets, errors, unverified } = validateRulesets(files, { strict });

console.log(`룰셋 ${rulesets.length}개 검사 (${strict ? "strict" : "preview"} 모드)`);
if (!strict && unverified.length > 0) {
  console.warn(`⚠️  공식 출처 확인 전 필드 ${unverified.length}개 — 프로덕션 빌드에서는 실패한다`);
  for (const f of unverified) console.warn(`   - ${f.path}${f.note ? ` (${f.note})` : ""}`);
}
if (errors.length > 0) {
  console.error(`❌ 오류 ${errors.length}개`);
  for (const e of errors) console.error(`   - ${e}`);
  process.exit(1);
}
console.log("✅ 룰셋 검증 통과");
