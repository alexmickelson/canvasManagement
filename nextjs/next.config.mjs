/** @type {import('next').NextConfig} */

const token = process.env.NEXT_PUBLIC_CANVAS_TOKEN;
if (!token) {
  throw new Error("CANVAS_TOKEN not in environment");
}

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/canvas/:rest*",
        destination: "https://snow.instructure.com/api/v1/:rest*",
      },
    ];
  },
};

export default nextConfig;
