// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/auth/login',
        permanent: false,
      },
    ];
  },
};
