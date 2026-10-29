import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LAN address used to open the dev server. Required so hot reload
  // requests from that host are not blocked.
  allowedDevOrigins: ["10.107.46.158"],
};

export default nextConfig;
