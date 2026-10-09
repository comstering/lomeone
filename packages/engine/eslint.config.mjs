import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

// 엔진은 순수 함수만 둔다. 같은 입력이면 항상 같은 출력이어야 한다 (PRD §10.1).
const impure = "엔진은 순수 함수만 허용한다. 기준 연도·날짜는 입력으로 받는다.";

export default defineConfig([
  tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        { selector: "NewExpression[callee.name='Date']", message: impure },
        { selector: "MemberExpression[object.name='Date'][property.name='now']", message: impure },
        { selector: "MemberExpression[object.name='Math'][property.name='random']", message: impure },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: ["../../*"], message: "엔진은 다른 패키지 경로를 직접 참조하지 않는다." },
            { regex: "^@lifecurve/rules$", allowTypeImports: true, message: "룰셋은 타입만 import하고 데이터는 호출 측이 주입한다." },
          ],
        },
      ],
    },
  },
]);
