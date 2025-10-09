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
  // async rewrites() {
  //   return [
  //     {
  //       source: '/index.html',
  //       destination: '/',
  //     },
  //     {
  //       source: '/:path*.html',
  //       destination: '/:path*',
  //     },
  //   ]
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path+((?!.*\\.html$).*)', // Исключаем корень и пути с .html
  //       destination: '/:path.html',
  //       permanent: true,
  //     },
  //   ]
  // },
}

module.exports = nextConfig