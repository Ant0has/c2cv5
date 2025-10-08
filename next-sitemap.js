const isProduction = process.env.NEXT_PUBLIC_STAGE === 'production';


module.exports = {
  siteUrl: isProduction ? 'https://city2city.ru' : 'https://localhost:3000',
  generateRobotsTxt: isProduction, // создаст файл robots.txt автоматически
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin/**',
    '/admin/calculator',
    '/admin/other-hidden-page',
    '/calculator',
  ],
  generateIndexSitemap: isProduction,
}