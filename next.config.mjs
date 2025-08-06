/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export configuration for GitHub Pages
  ...(process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true' && {
    output: 'export',
    basePath: '/2kcodes',
    assetPrefix: '/2kcodes',
  }),
  
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Images configuration
  images: {
    // Disable image optimization for static export
    unoptimized: process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true',
    domains: ['localhost', 'kevin-kabore.github.io'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  
  // Webpack config for client-side compatibility
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;