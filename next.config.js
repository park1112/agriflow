const fs = require('fs');
const path = require('path');

const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'serviceAccountKey.json'), 'utf-8')
);

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
  experimental: {
    forceSwcTransforms: true,
  },
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });
    return config;
  },
  env: {
    FIREBASE_SERVICE_ACCOUNT: JSON.stringify(serviceAccount),
  },
};
