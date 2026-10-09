// 초기 JS 예산 검사 (PRD FR-34, review B-3). `next build` 다음에 돈다.
// 프리렌더된 HTML이 <script src>로 불러오는 청크를 gzip 크기로 합산한다.
// noModule 폴리필은 구형 브라우저만 받으므로 제외한다.
// 인라인 스크립트(RSC 페이로드)는 HTML 문서에 포함되므로 예산과 별도로 표시만 한다.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const KB = 1024;
// 경로 접두어가 긴 것부터 맞춘다. 시뮬레이터(/sim)는 250KB, 나머지는 170KB
const BUDGETS: { prefix: string; limit: number }[] = [
  { prefix: "/sim", limit: 250 * KB },
  { prefix: "/", limit: 170 * KB },
];

const root = join(import.meta.dirname, "..");
const appDir = join(root, ".next/server/app");
if (!existsSync(appDir)) {
  console.error("❌ .next/server/app이 없다. 먼저 `next build`를 실행한다");
  process.exit(1);
}

const gz = (buf: Buffer | string) => gzipSync(buf, { level: 9 }).length;
const fmt = (bytes: number) => `${(bytes / KB).toFixed(1)}KB`;

function* htmlFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html") && !entry.name.startsWith("_global-error")) yield path;
  }
}

function routeOf(file: string) {
  const route = "/" + relative(appDir, file).replace(/\.html$/, "");
  return route === "/index" ? "/" : route.replace(/\/index$/, "");
}

let failed = false;
const rows: string[] = [];
for (const file of htmlFiles(appDir)) {
  const html = readFileSync(file, "utf8");
  const srcs = [...html.matchAll(/<script([^>]*)\ssrc="([^"]+)"[^>]*>/g)]
    .filter((m) => !/\snoModule/i.test(m[0]))
    .map((m) => m[2]!);
  const external = srcs.reduce((sum, src) => {
    const path = join(root, ".next", src.replace(/^\/_next\//, ""));
    return sum + gz(readFileSync(path));
  }, 0);
  const inline = gz([...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(""));

  const route = routeOf(file);
  const { limit } = BUDGETS.find((b) => route.startsWith(b.prefix))!;
  const over = external > limit;
  failed ||= over;
  rows.push(
    `${over ? "❌" : "✅"} ${route.padEnd(24)} 초기 JS ${fmt(external).padStart(8)} / ${fmt(limit)}` +
      `  (청크 ${srcs.length}개, 인라인 ${fmt(inline)})`,
  );
}

console.log("초기 JS 예산 (gzip)");
for (const row of rows) console.log(row);
if (failed) {
  console.error("❌ 예산 초과");
  process.exit(1);
}
