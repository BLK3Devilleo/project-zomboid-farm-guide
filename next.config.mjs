/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.e2b.app', '*.e2b.dev', 'localhost'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      { source: '/servers', destination: '/?view=servers' },
      { source: '/servidores', destination: '/?view=servers' },
      { source: '/guide', destination: '/?view=guide' },
      { source: '/guia', destination: '/?view=guide' },
      { source: '/forum', destination: '/?view=forum' },
      { source: '/foro', destination: '/?view=forum' },
      { source: '/loot', destination: '/?view=loot' },
      { source: '/radio', destination: '/?view=radio' },
      { source: '/missions', destination: '/?view=missions' },
      { source: '/misiones', destination: '/?view=missions' },
      { source: '/onboarding', destination: '/?view=onboarding' },
    ];
  },
};

export default nextConfig;
