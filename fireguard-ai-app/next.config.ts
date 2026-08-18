import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  experimental: {
    turbopackLocalPostcssConfig: true,
  },

  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value:
              "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value:
              "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
