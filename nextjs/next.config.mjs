/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/canvas/:rest*',
        destination: 'https://snow.instructure.com/api/v1/:rest*',
      },
    ]
  },
};

export default nextConfig;
