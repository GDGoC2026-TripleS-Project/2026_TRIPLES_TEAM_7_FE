import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    // ✅ 기존 svg 로더가 있다면 ?react 요청에 안 걸리도록 제외
    const fileLoaderRule = config.module.rules.find((rule: any) => {
      return rule?.test instanceof RegExp && rule.test.test(".svg");
    });

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // ✅ /icons/xxx.svg?react 형태로 React 컴포넌트 import 지원
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: /react/, // ?react
      use: ["@svgr/webpack"],
    });

    // ✅ ?react 없는 svg는 파일로 취급(기존 next/image 등과 호환)
    config.module.rules.push({
      test: /\.svg$/i,
      type: "asset/resource",
      resourceQuery: { not: [/react/] },
    });

    return config;
  },
};

export default nextConfig;
