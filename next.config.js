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
    optimizeCss: true,
  },

  compiler: {
    removeConsole: process.env.NEXT_PUBLIC_STAGE === 'production', // Удалите console.log в продакшене
  },

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