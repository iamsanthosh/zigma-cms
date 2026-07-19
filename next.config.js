/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // produces .next/standalone for lean deploys on Hostinger Node hosting
  images: {
    // Local /public/uploads plus any external CDN host you point media at later.
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  experimental: {
    serverActions: { bodySizeLimit: '15mb' } // allow reasonably large media metadata payloads
  }
};

module.exports = nextConfig;
