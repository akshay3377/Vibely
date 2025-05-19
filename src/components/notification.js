"use client";

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { onMessageListener, requestForToken } from "@/lib/firebase";

const playMessageSound = () => {
  const audio = new Audio("/audio/notification.mp3");
  audio.play().catch((err) => {
    console.warn("Audio play was blocked:", err);
  });
};

const Notification = () => {
  
  requestForToken();

  const [notification, setNotification] = useState({ title: "", body: "" });

  const notify = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                📩
              </div>
            </div>
            <div className="ml-3 ">
              <p className="text-sm font-medium text-white">
                {notification.title}
              </p>
              <p className="mt-0.5 text-sm text-gray-300 truncate w-full max-w-[220px] overflow-hidden whitespace-nowrap">
                {notification.body}
              </p>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  useEffect(() => {
    if (notification?.title) {
      notify();
      playMessageSound();
    }
  }, [notification]);

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster position="top-right" reverseOrder={false} />;
};

export default Notification;
