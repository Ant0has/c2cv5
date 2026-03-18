const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'city2city.ru',
        port: '',
        pathname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['heavy-package'],
  },

  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_STAGE === 'production',
  },

  output: 'standalone',
  compress: true,
  swcMinify: true,

  async redirects() {
    return [
      {
        source: '/index.:ext*',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
    })
  : nextConfig;
