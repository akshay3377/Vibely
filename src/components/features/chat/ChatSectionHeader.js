"use client";

import {BackIcon} from "@/icons";
import { useRouter } from "next/navigation";
import React from "react";

export default function ChatSectionHeader({ otherUserName, otherUserInitial }) {
  const router = useRouter();

  return (
    <div className="py-2 px-2 md:p-4 border-b border-gray-500 text-lg font-semibold  shadow-sm flex gap-1 items-center">
      <button
        onClick={() => router.push("/chat")}
        className="text-primary md:hidden p-2 "
      >
       <BackIcon className="fill-white h-6 w-6" />{" "}
      </button>

      <div className="flex items-center gap-2">
        <div className="w-8 h-8   rounded-full bg-blue-500 text-white flex items-center justify-center text-sm ">
          {otherUserInitial}
        </div>

        <div className="flex flex-col">
          <span className="text-md "> {otherUserName}</span>
          {/* <span className="text-xs">Online</span> */}
        </div>
      </div>
    </div>
  );
}
