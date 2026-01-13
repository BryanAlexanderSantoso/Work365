import type { NextConfig } from "next";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === "development" && process.env.TEST_PWA !== "true", // Disable in dev unless TEST_PWA=true
  register: true,
  scope: "/",
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
