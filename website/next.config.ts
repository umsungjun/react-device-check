import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Linting is owned by the repo root; the website has no eslint install of its own
  eslint: { ignoreDuringBuilds: true },
  // The repo root has its own lockfile — pin tracing here so Next doesn't infer the wrong root
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
