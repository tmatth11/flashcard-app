import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.clerk.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        authInterrupts: true,
    },
    async rewrites() {
        return [
            {
                source: "/__clerk/:path*",
                destination: "https://clerk.flashcard-app-eight-theta.vercel.app/__clerk/:path*",
            },
        ];
    },
};

export default nextConfig;
