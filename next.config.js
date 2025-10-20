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

  // Добавьте форматы для автоматической конвертации PNG в современные форматы
  formats: ['image/webp', 'image/avif'],

  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_STAGE === 'production',
  },

  output: 'standalone',
  compress: true,
  swcMinify: true,

  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig