/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd && {
    output: 'export',
    basePath: '/n-dashboard-sistema-aulas',
    trailingSlash: true,
  }),
};

export default nextConfig;
