import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },

  // Required for DuckDB WASM to work in Next.js
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Enable async WebAssembly
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      }

      // Handle .wasm files
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      })

      // Fallbacks for browser environment
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    return config
  },
}

export default nextConfig
