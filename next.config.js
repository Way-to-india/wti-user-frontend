// module.exports = {
//   env: {
//     api_base_url: "http://localhost:4000/api/",
//   },
//   images: {
//     domains: ["lh3.googleusercontent.com", "www.waytoindia.com", "images.pexels.com"],
//   },
// };
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'www.waytoindia.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'chardhamtravel.com',
      },
    ],
  },
}

module.exports = nextConfig;
