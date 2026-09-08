import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "f1.dikidi.ru", pathname: "/**" },
      { protocol: "https", hostname: "f2.dikidi.ru", pathname: "/**" },
      { protocol: "https", hostname: "f1.dikidi.net", pathname: "/**" },
      { protocol: "https", hostname: "f2.dikidi.net", pathname: "/**" },
    ],
  },
};

export default nextConfig;
