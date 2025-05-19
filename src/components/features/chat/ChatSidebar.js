"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ref, onValue, query, limitToLast, off } from "firebase/database";
import { deleteCookie, getCookie } from "cookies-next";
import { FirebaseAuth, realTimeDb } from "@/lib/firebase";
import Button from "@/components/button";


export default function ChatSidebar() {
  const { id: activeChatId } = useParams();
  const [users, setUsers] = useState([]);
  const currentUser = getCookie("USER");
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = ref(realTimeDb, "users");
    const unsubscribeFns = [];

    const usersListener = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const userList = Object.values(data).filter((u) => u.id !== currentUser);

      setUsers(userList); // base list

      userList.forEach((user) => {
        const chatId = [user.id, currentUser].sort().join("_");
        const chatQuery = query(
          ref(realTimeDb, `chats/${chatId}`),
          limitToLast(1)
        );

        const unsub = onValue(chatQuery, (chatSnap) => {
          const messages = chatSnap.val();
          if (!messages) return;

          const last = Object.values(messages)[0];

          setUsers(
            (prevUsers) =>
              prevUsers
                .map((u) =>
                  u.id === user.id
                    ? {
                        ...u,
                        lastMessage: last.text,
                        timestamp: last.timestamp,
                      }
                    : u
                )
                .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) // sort by latest
          );
        });

        unsubscribeFns.push(() => off(chatQuery));
      });
    });

    return () => {
      off(usersRef);
      unsubscribeFns.forEach((unsub) => unsub());
    };
  }, [currentUser]);

  const getColorFromName = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-full md:rounded-lg bg-white dark:bg-ghost shadow-xl flex flex-col">
      <div className="flex justify-between items-center w-full p-2">
        <h2 className="text-md font-semibold p-4">Users</h2>
        <Button
          className="bg-red-500 text-white text-sm rounded transition"
          onClick={() => {
            deleteCookie("USER");
            FirebaseAuth.signOut();
            router.push("/");
          }}
        >
          Sign Out
        </Button>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {users.map((u) => {
          const isActive = u.id === activeChatId;
          const avatarColor = getColorFromName(u.name || "");

          return (
            <li
              key={u.id}
              className="border-b border-gray-200 dark:border-gray-700 transition-all"
            >
              <Link
                href={`/conversation/${u.id}`}
                className={`flex items-center gap-3 p-3 transition ${
                  isActive
                    ? "border-r-4 border-primary bg-gray-100 dark:bg-gray-800"
                    : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center text-lg font-semibold ${avatarColor}`}
                >
                  {u.name?.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-md font-medium truncate">{u.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {u.lastMessage || "No messages yet"}
                  </div>
                </div>

                <div className="text-xs text-gray-400 ml-auto whitespace-nowrap">
                  {formatTime(u.timestamp)}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
