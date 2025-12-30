
const fs = require('fs');
const path = require('path');

const pages = [
  '',
  'about',
  'services',
  'work',
  'gallery',
  'contact',
];

const sitemap = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages.map(page => `
      <url>
        <loc>${`https://www.adahcreatives.com/${page}`}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${page === '' ? '1.0' : '0.8'}</priority>
      </url>
    `).join('')}
  </urlset>
`;

const sitemapPath = path.resolve(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap.trim());

console.log('Sitemap generated successfully!');
