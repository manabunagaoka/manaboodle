/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The Tools section was replaced by Apps (/apps), which features apps
      // hosted at their own addresses. Old Tools links land there.
      // The old code under src/app/tools is kept for reference.
      { source: '/tools', destination: '/apps', permanent: false },
      { source: '/tools/:path*', destination: '/apps', permanent: false },
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
