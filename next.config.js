// next.config.js
const { tourSlugs } = require('./data/slugs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.waytoindia.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'www.waytoindia.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dbagut2mvh0lo.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'dbagut2mvh0lo.cloudfront.net',
        pathname: '/**',
      },
    ],
  },

  async redirects() {
    return tourSlugs.map(slug => ({
      source: `/${slug}`,
      destination: `/tours/${slug}`,
      permanent: true,
    }));
  },
};

module.exports = nextConfig;
