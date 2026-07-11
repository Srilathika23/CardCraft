import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/create-card",
        destination: "/editor.html",
      },
    ]
  },
}

export default nextConfig
