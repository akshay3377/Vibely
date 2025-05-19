"use client";

const Lottie = dynamic(() => import("react-lottie"), { ssr: false });
import BoyAnimation from "../../../../public/animation/chat.json";
import dynamic from "next/dynamic";

export default function Page() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: BoyAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <section className="hidden md:flex w-full bg-white dark:bg-ghost rounded-md h-full justify-center items-center">
      <div className="h-[300px] md:h-[500px]">
        <Lottie
          style={{ pointerEvents: "none" }}
          options={defaultOptions}
          className="w-full"
        />
      </div>
    </section>
  );
}
