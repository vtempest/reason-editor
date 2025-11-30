/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only build API routes, not pages
  pageExtensions: ['api.ts', 'api.tsx'],

  // Disable static page generation since we only serve APIs
  output: 'standalone',

  // Custom server configuration
  experimental: {
    serverActions: {
      enabled: true,
    },
  },

  // CORS headers for frontend access
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:5173' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
