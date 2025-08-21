const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose'
  },
  transpilePackages: [
    '@telegram-apps/sdk-react',
    '@telegram-apps/telegram-ui',
    '@tonconnect/ui-react'
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Исправляем проблемы с ES модулями
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
  // Отключаем строгий режим для совместимости
  reactStrictMode: false,
  // Настройки для Vercel
  output: 'standalone',
};

module.exports = withNextIntl(nextConfig);
