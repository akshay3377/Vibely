/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: 'https://akshay13.vercel.app/', // Replace with your real domain
    generateRobotsTxt: true, // Creates robots.txt file
    generateIndexSitemap: true,
    // Optional
    exclude: ["/private", "/secret"], // if you have routes to exclude
  };