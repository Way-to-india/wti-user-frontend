// next.config.js

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
        hostname: 'waytoindia.com',
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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect /tours/:slug to /:slug
      {
        source: '/tours/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // Redirect waytoindia.shop to waytoindia.com
      {
        source: '/:slug',
        has: [{ type: 'host', value: 'waytoindia.shop' }],
        destination: 'https://waytoindia.com/:slug',
        permanent: true,
      },
      // Redirect www.waytoindia.com to waytoindia.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.waytoindia.com' }],
        destination: 'https://waytoindia.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
