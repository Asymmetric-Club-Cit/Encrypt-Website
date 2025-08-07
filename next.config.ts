import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip linting and all checking
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
