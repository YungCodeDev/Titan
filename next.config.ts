import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "i.imgur.com",
      "imgur.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
