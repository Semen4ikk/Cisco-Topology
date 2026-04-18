import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    images: { unoptimized: true },
    basePath: '/Cisco-Topology',
    assetPrefix: '/frontend-challenge/',
    /* config options here */
};

export default nextConfig;
