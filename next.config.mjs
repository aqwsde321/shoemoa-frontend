/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["d3to55zvtt5gof.cloudfront.net"],
    unoptimized: true,
  },
 
}

export default nextConfig