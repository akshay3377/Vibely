"use client";

import { BackIcon } from "@/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function ChatSectionHeader({ otherUserInfo }) {
  const router = useRouter();

  return (
    <div className="py-2 px-2 md:p-4 border-b border-gray-500 text-lg font-semibold  shadow-sm flex gap-1 items-center">
      <button
        onClick={() => router.push("/conversation")}
        className="text-primary md:hidden p-2 "
      >
        <BackIcon className="fill-white h-6 w-6" />{" "}
      </button>

      <div className="flex items-center gap-2">
        {otherUserInfo.photoURL ? (
          <Image
            src={otherUserInfo.photoURL}
            alt={otherUserInfo.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : null}

        <div className="flex flex-col">
          <span className="text-md "> {otherUserInfo.name}</span>
          {/* <span className="text-xs">Online</span> */}
        </div>
      </div>
    </div>
  );
}
