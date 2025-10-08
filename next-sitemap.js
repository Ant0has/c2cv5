module.exports = {
  siteUrl: 'https://city2city.ru',
  generateRobotsTxt: true, // создаст файл robots.txt автоматически
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/admin/**',
    '/admin/calculator',
    '/admin/other-hidden-page', 
    '/calculator',
     ]
  }