import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-img.thethao247.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bqn.1cdn.vn",
        port: "",
        pathname: "/**",
      }
    ],
    qualities: [75, 100],
  },
};

export default nextConfig;
