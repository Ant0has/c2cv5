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

module.exports = nextConfig