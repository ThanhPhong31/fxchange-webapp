import million from 'million/compiler'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  images: {
    domains: [
      'source.unsplash.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'storage.googleapis.com',
    ],
  },
}
export default million.next(nextConfig)
