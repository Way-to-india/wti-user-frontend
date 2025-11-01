// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizeCss: true,
    optimizeFonts: true,
  },
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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
