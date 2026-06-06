/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "figma-alpha-api.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

module.exports = nextConfig;
