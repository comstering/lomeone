import type { NextConfig } from "next";

// CSP (PRD FR-31, review B-2). 정적 생성(FR-32)을 유지하려고 논스 대신 헤더 하나로 고정한다.
// Next가 HTML에 넣는 인라인 스크립트(RSC 페이로드)는 페이지마다 달라 해시로 허용할 수 없어서
// script-src에 'unsafe-inline'이 필요하다. 대신 데이터가 밖으로 나갈 수 있는 경로
// (connect-src·img-src·form-action·frame-ancestors)는 자기 도메인으로 묶는다.
// 분석 도구(US-026)를 붙일 때 그 도메인만 script-src·connect-src에 추가한다.
const isDev = process.env.NODE_ENV === "development";
const csp = [
  "default-src 'self'",
  // 개발 모드의 React는 디버깅 정보에 eval을 쓴다
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  // 워크스페이스 패키지는 TS 원본으로 배포되므로 Next가 직접 트랜스파일한다
  transpilePackages: ["@lifecurve/engine", "@lifecurve/rules"],
  cacheComponents: true,
  async headers() {
    return [{ source: "/(.*)", headers: [{ key: "Content-Security-Policy", value: csp }] }];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
