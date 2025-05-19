// components/LottiePlayer.tsx
"use client";

import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

// Import Lottie dynamically with SSR disabled
// const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

export default function LottiePlayer({ options }) {
  return (


    <Lottie
    style={{ pointerEvents: "none" }}
    options={options}
    className="w-[100%]"
  />
  );
}
