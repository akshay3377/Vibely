"use client";
import React, { useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {SendIcon} from "@/icons";

export default function ChatInputMessage({ setMessage, sendMessage, message }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="px-2 py-3 flex gap-2 items-end sticky bottom-0 z-10  border-t border-gray-500  ">
      <div className="relative">
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-lg px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          😊
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-20">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme="light"
            />
          </div>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow  rounded-2xl bg-ghost border border-gray-500 text-md px-3 py-2 focus:outline-none resize-none overflow-y-auto max-h-40"
        rows={1}
        onInput={(e) => {
          const target = e.target;
          target.style.height = `${target.scrollHeight}px`;
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            setTimeout(() => {
              e.target.style.height = "auto";
            }, 0);
          }
        }}
      />

      <button
        onClick={sendMessage}
        className="bg-primary p-2 rounded-full shadow-md disabled:opacity-50"
        disabled={!message.trim()}
      >
        <SendIcon className=" h-5 w-5 fill-white" />
      </button>
    </div>
  );
}
