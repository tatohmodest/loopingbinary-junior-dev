import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'loopingbinary.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/looping-binary/**',
      },
    ],
  },
}



export default nextConfig;
