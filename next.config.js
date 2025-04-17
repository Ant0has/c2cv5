/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['city2city.ru'],
  },
  experimental: {
    optimizePackageImports: ['heavy-package'],
  },
  // exportPathMap: async function() {
  //   return {
  //     '/': { page: '/' },
  //     '/contacts.html': { page: '/contacts' },
  //     '/team.html': { page: '/team' },
  //     '/oferta.html': { page: '/oferta' },
  //     '/[id].html': { page: '/[id]' },  // для динамичных страниц
  //     // Добавьте другие страницы в том же формате
  //   };
  // },
    async rewrites() {
    return [
      {
        source: '/', // Главная страница
        destination: '/index', // Страница, на которую будет переадресован запрос
      },
      {
        source: '/contacts.html', // Перезапись для контактов с добавлением .html
        destination: '/contacts', // На какую страницу перенаправлять
      },
      {
        source: '/team.html', // Перезапись для команды с добавлением .html
        destination: '/team', // На какую страницу перенаправлять
      },
      {
        source: '/oferta.html', // Перезапись для оферты с добавлением .html
        destination: '/oferta', // На какую страницу перенаправлять
      },
      {
        source: '/:id.html', // Для динамических маршрутов с добавлением .html
        destination: '/:id', // Перенаправление на динамический маршрут без .html
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.htm',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:id.html',
        destination: '/:id',
        permanent: true,
      },
      {
        source: '/contacts.html',
        destination: '/contacts',
        permanent: true,
      },
      {
        source: '/team.html',
        destination: '/team',
        permanent: true,
      },
      {
        source: '/oferta.html',
        destination: '/oferta',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig; 