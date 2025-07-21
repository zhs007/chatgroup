/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    PROXY_URL: process.env.PROXY_URL,
  },
}

module.exports = nextConfig
