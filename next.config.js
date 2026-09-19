/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Tools section is hidden until it can feature live tools again.
      // Code under src/app/tools is kept; remove these to bring it back.
      { source: '/tools', destination: '/', permanent: false },
      { source: '/tools/:path*', destination: '/', permanent: false },
      // Academic Portal is retired. Login, signup, password reset and admin
      // stay reachable because SSO for external apps and emails use them.
      { source: '/academic-portal', destination: '/', permanent: false },
      { source: '/academic-portal/dashboard', destination: '/', permanent: false },
      { source: '/academic-portal/clusters', destination: '/', permanent: false },
      { source: '/academic-portal/runway', destination: '/', permanent: false },
      { source: '/academic-portal/debug-session', destination: '/', permanent: false },
    ];
  },
};

module.exports = nextConfig;
