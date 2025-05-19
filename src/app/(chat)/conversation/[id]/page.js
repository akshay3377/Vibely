"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ref, push, onValue, get } from "firebase/database";
import { getCookie } from "cookies-next";
import moment from "moment";
import Image from "next/image";
import { realTimeDb } from "@/lib/firebase";
import ChatInputMessage from "@/components/features/chat/ChatInputMessage";
import ChatSectionHeader from "@/components/features/chat/ChatSectionHeader";

const ChatPage = () => {
  const { id: otherUserId } = useParams();
  const [otherUserInfo, setOtherUserInfo] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const bottomRef = useRef(null);
  const chatContainerRef = useRef(null);

  console.log("messages", messages);

  const [currentUser, setCurrentUser] = useState(null);

  // Parse user from cookie once
  useEffect(() => {
    try {
      const userCookie = getCookie("USER");
      if (userCookie) {
        setCurrentUser(JSON.parse(userCookie));
      }
    } catch (error) {
      console.error("Failed to parse USER cookie:", error);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const generateChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

  const [chatBgColor, setChatBgColor] = useState("");

  // Listen for chat messages
  useEffect(() => {
    if (!currentUser?.id || !otherUserId) return;

    const chatId = generateChatId(currentUser.id, otherUserId);
    const messagesRef = ref(realTimeDb, `chats/${chatId}`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(data ? Object.values(data) : []);
    });

    return () => unsubscribe();
  }, [currentUser?.id, otherUserId]);

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMsg = messages[messages.length - 1];

    setChatBgColor(lastMsg.emotions.color);
  }, [messages]);

  // Fetch other user info
  useEffect(() => {
    if (!otherUserId) return;

    const userRef = ref(realTimeDb, `users/${otherUserId}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setOtherUserInfo(data);
    });

    return () => unsubscribe();
  }, [otherUserId]);

  // Send a message
  const sendMessage = async () => {
    if (!message.trim() || !currentUser?.id || !otherUserId) return;

    const chatId = generateChatId(currentUser.id, otherUserId);
    const messagesRef = ref(realTimeDb, `chats/${chatId}`);

    let summary = "";
    let emotions = {};

    try {
      const res = await fetch("/api/gemini-emotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await res.json();

      console.log("data", data);
      emotions = data;
    } catch (err) {
      console.error("Emotions API failed:", err);
    }

    // 1. Get summary from Gemini API if message is long
    if (message.length > 80) {
      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: message }),
        });

        const data = await res.json();
        if (data?.output) {
          summary = data.output.trim();
        }
      } catch (err) {
        console.error("Failed to generate summary:", err);
      }
    }

    const newMessage = {
      senderId: currentUser.id,
      receiverId: otherUserId,
      text: message,
      summary: summary || null,
      emotions: emotions || null,
      timestamp: new Date().toISOString(),
    };

    console.log("summary", summary);

    await push(messagesRef, newMessage);
    setMessage("");

    // Send FCM push notification if token exists
    const tokenSnap = await get(ref(realTimeDb, `fcmTokens/${otherUserId}`));

    const fcmToken = tokenSnap.val();

    console.log("fcmTokeneee", tokenSnap, fcmToken);

    if (fcmToken) {
      await fetch("/api/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: fcmToken,
          title: otherUserInfo.name || "New Message",
          body: message,
        }),
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const date = moment(msg.timestamp).startOf("day").format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full bg-ghost md:rounded-lg">
      <ChatSectionHeader otherUserInfo={otherUserInfo} />

      <div
        ref={chatContainerRef}
        style={{ backgroundColor: chatBgColor }}
        className="flex-1  overflow-y-auto px-2 md:px-4 py-2 space-y-3"
      >
        {Object.entries(groupedMessages).map(([date, msgs]) => {
          const isToday = moment(date).isSame(moment(), "day");
          const isYesterday = moment(date).isSame(
            moment().subtract(1, "day"),
            "day"
          );
          const label = isToday
            ? "Today"
            : isYesterday
            ? "Yesterday"
            : moment(date).format("MMMM D, YYYY");

          return (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <div className="flex-grow border-t border-gray-500" />
                <span className="mx-2 text-xs text-white whitespace-nowrap">
                  {label}
                </span>
                <div className="flex-grow border-t border-gray-500" />
              </div>

              {msgs.map((msg, index) => {
                const isMe = msg.senderId === currentUser?.id;
                const isLastInGroup =
                  index === msgs.length - 1 ||
                  msgs[index + 1].senderId !== msg.senderId;

                const senderUser = isMe ? currentUser : otherUserInfo;

                const avatar = (user) =>
                  user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.name || "Avatar"}
                      height={100}
                      width={100}
                      className="rounded-full object-cover w-6 h-6 md:w-8 md:h-8"
                    />
                  ) : (
                    <></>
                  );

                const avatarSpacer = <div className="w-6 h-6 md:w-8 md:h-8" />;

                return (
                  <div
                    key={index}
                    className={`flex mb-3 items-end gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe &&
                      (isLastInGroup ? avatar(senderUser) : avatarSpacer)}
                    <div
                      className={`max-w-[80%] md:max-w-[60%] px-4 py-4 rounded-xl shadow-lg ${
                        isMe
                          ? "bg-primary text-white rounded-full"
                          : "bg-ghost dark:text-white rounded-full"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm">
                        {msg.text}

                        {msg.summary && currentUser?.id !== msg.senderId ? (
                          <div className="text-xs  text-white mt-4">
                            <b>Summary :</b>{" "}
                            <p className="italic">{msg.summary}</p>
                          </div>
                        ) : (
                          <></>
                        )}
                      </p>
                      <div className="text-[11px] text-right mt-1 opacity-70">
                        {moment(msg.timestamp).format("hh:mm A")}
                      </div>
                    </div>
                    {isMe &&
                      (isLastInGroup ? avatar(senderUser) : avatarSpacer)}
                  </div>
                );
              })}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <ChatInputMessage
        setMessage={setMessage}
        sendMessage={sendMessage}
        message={message}
      />
    </div>
  );
};

export default ChatPage;
