import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: process.env.NODE_ENV === 'development' ? false : true,
  turbopack: {
    root: process.cwd()
  },
  // 基础配置
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react']
  }
};

export default nextConfig;
