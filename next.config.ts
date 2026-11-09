import type { NextConfig } from "next";

// STATIC_EXPORT=1 — статическая версия для показа партнёрам (без сервера: форма в тестовом режиме).
const isStatic = process.env.STATIC_EXPORT === "1";
// BASE_PATH — подпапка сайта, например "/operiva" для GitHub Pages (username.github.io/operiva).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  ...(isStatic ? { output: "export", trailingSlash: process.env.NEXT_PUBLIC_CLEAN_URLS !== "1", images: { unoptimized: true }, ...(basePath ? { basePath } : {}) } : {}),
};

export default nextConfig;
