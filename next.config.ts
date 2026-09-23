import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const projectRoot = path.resolve(__dirname);
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  transpilePackages: ["react-syntax-highlighter"],
  outputFileTracingRoot: projectRoot,
  async redirects() {
    return [
      {
        source: "/soporte",
        destination: "/faq",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: projectRoot,
  },
};

export default withNextIntl(nextConfig);
