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
      },
      {
        protocol: "https",
        hostname: "image.sggp.org.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdnmedia.webthethao.vn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.vietqr.io",
        port: "",
        pathname: "/**",
      },
    ],
    qualities: [75, 100],
  },
};

export default nextConfig;
