// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['city2city.ru'],
  },
  experimental: {
    optimizePackageImports: ['heavy-package'],
  },
  async rewrites() {
    return [
      {
        // index.html → корень
        source: '/index.html',
        destination: '/',
      },
      {
        // любые другие .html → рендерим без него
        source: '/:path*.html',
        destination: '/:path*',
      },
    ]
  },
  // async redirects() {
  //   return [
  //     {
  //       // с / редиректим на /index.html
  //       source: '/',
  //       destination: '/index.html',
  //       permanent: true,
  //     },
  //     {
  //       // редиректим только если нет .html на конце
  //       source: '/:path((?!.*\\.html$).*)',
  //       destination: '/:path.html',
  //       permanent: true,
  //     },
  //   ]
  // },
}

module.exports = nextConfig
