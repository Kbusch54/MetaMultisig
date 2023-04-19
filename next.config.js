/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "localhost",
      "app.uniswap",
      "raw.githubusercontent",
      "seeklogo.com",
      "https://seeklogo.com/images/U/uniswap-uni-logo-7B6173C76E-seeklogo.com.png",
      "https://upload.wikimedia.org",
      "upload.wikimedia.org",
    ],
  },
};

module.exports = nextConfig;
