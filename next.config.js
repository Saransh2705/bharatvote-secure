/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lucide-react'],
  // Enable build cache
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Optimize for caching
  experimental: {
    incrementalCacheHandlerPath: undefined,
    isrMemoryCacheSize: 0, // disable in-memory caching in favor of filesystem
  },
  // Disable build output cleaning to preserve cache
  cleanDistDir: false,
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './'),
    };
    // Enable caching for webpack compilation
    config.cache = {
      type: 'filesystem',
      cacheDirectory: require('path').resolve(__dirname, '.next/cache/webpack'),
      buildDependencies: {
        config: [__filename],
      },
    };
    return config;
  },
};

module.exports = nextConfig;
