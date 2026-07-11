/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    esmExternals: 'loose',
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
