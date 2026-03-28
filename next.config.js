import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  // Enable build cache
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Disable build output cleaning to preserve cache
  cleanDistDir: false,
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };
    // Enable caching for webpack compilation
    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.resolve(__dirname, '.next/cache/webpack'),
      buildDependencies: {
        config: [__filename],
      },
    };
    return config;
  },
};

export default nextConfig;
