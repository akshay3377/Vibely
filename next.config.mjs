import nextPwa from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile photos
      "firebasestorage.googleapis.com" // Firebase Storage
    ],
  },
};

const withPWA = nextPwa({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // or true in dev
});

export default withPWA(nextConfig); // ✅ ES Module syntax
