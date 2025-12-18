/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Vercel deployment
  output: 'standalone',

  // Disable static page generation since we're only using API routes
  // and serving the Vite frontend separately
  distDir: '.next',

  // Turbopack config with @ alias pointing to project root
  turbopack: {
    resolveAlias: {
      '@': './',
    },
  },

  // Custom server configuration
  experimental: {
    serverActions: {
      enabled: true,
    },
  },

  // Exclude better-sqlite3 from webpack bundle (we're using Turso instead)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('better-sqlite3');
    }

    // Override @ alias to point to project root instead of src/
    const path = require('path');
    config.resolve.alias['@'] = path.resolve(__dirname);

    return config;
  },

  // CORS headers for frontend access
  async headers() {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.NEXT_PUBLIC_APP_URL || '',
    ].filter(Boolean);

    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: allowedOrigins.join(',') },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
