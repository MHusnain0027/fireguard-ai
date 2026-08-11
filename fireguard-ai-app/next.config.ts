import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives inside a repository subdirectory. Without an explicit root,
  // Turbopack can select the repository-level package-lock.json and skip this
  // app's PostCSS/Tailwind pipeline, which leaves the page completely unstyled.
  turbopack: {
    root: __dirname,
  },
  experimental: {
    turbopackLocalPostcssConfig: true,
  },
};

export default nextConfig;
