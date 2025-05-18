const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd && {
    output: 'export',
    trailingSlash: true, // esse pode continuar
  }),
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
