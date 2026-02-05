const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/',
        destination: '/allCourses/main',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;