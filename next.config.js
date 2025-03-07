/** @type {import('next').NextConfig} */
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'lapnghiepvoi1trieudong.com'],
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