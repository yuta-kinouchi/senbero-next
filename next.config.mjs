/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose',
    // /api/admin/seed が実行時にCSVを読むため、サーバーレス関数の
    // バンドルに data/ を含める(これがないとVercel上でファイルが見つからない)
    outputFileTracingIncludes: {
      '/api/admin/seed': ['./data/restaurants.csv'],
      '/api/admin/seed/route': ['./data/restaurants.csv'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'senbero-next.s3.ap-northeast-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
