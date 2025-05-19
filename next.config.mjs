import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {};

const withPWA = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // or true in dev
});

export default withPWA(nextConfig);
