/** @type {import('next').NextConfig} */
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'lapnghiepvoi1trieudong.com'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-subdomain' },
        ],
      },
    ];
  },
  // Thêm xử lý domain
  async rewrites() {
    return {
      beforeFiles: [
        // Xử lý truy cập subdomain
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<subdomain>[^.]+).lapnghiepvoi1trieudong.com',
            },
          ],
          destination: '/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;