import type { NextConfig } from "next";

/**
 * セキュリティヘッダー（dev-requirements-addendum.md §4.4）。
 * CSPは、DuckDB-Wasm(jsDelivr CDN + WebWorker/Wasm)とMonaco Editor(WebWorker)の
 * 動作要件を洗い出した上でPhase 10で追加する（TODO）。それまでは基本的なヘッダーのみ設定する。
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
