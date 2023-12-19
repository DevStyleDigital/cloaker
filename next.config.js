const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['hdkhzjrandokfvezogao.supabase.co'],
  },
};

module.exports = withNextra({ ...nextConfig });
