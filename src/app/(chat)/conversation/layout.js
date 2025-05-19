"use client";
import { usePathname } from "next/navigation";
import "../../../styles/globals.css";
import ChatSidebar from "@/components/features/chat/ChatSidebar";


export default function ChatLayout({ children }) {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith("/chat/") && /^[a-zA-Z0-9]+$/.test(pathname.split("/")[2]);
 

  return (
    // <div className="h-[95vh] w-full  py-12  overflow-hidden">
    <div className="h-full w-full    overflow-hidden">
      {/* container  */}
      <div className=" !p-0 w-full md:grid grid-cols-4 gap-3 h-full">
        <div
          className={`${
            isChatPage ? "hidden" : "block"
          } md:block col-span-1 h-full overflow-y-auto shadow-xl`}
        >
          <ChatSidebar />
        </div>
        <div className="col-span-3 h-full overflow-y-auto shadow-xl">
          {children}
        </div>
      </div>


    </div>
  );
}

