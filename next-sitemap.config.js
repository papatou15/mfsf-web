/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://www.maisonfamillestfrancois.com',
    generateRobotsTxt: true, // Automatically generate a robots.txt file
    sitemapSize: 5000,
    exclude: ['/admin', '/dashboard', '/account'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/dashboard', '/account'],
        },
      ],
    },
  };
  