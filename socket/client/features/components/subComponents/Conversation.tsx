import { useGetMessages } from "@/features/hooks/queries";
import { useGetUser } from "@/features/profile/hooks/useGetUser";
import { useDashboard } from "@/store/dashboard.store";
import Image from "next/image";
import defaultImage from "@/assets/images/default.png";
import { useEffect, useRef } from "react";

function Conversation() {
  const selectedUser = useDashboard((state) => state.selectedUser);
  const messages = useDashboard((state) => state.messages);
  const scrollRef = useRef(null);

  const { data: singleUser } = useGetUser();
  const { data: persistedMessages } = useGetMessages(selectedUser?.id || "");

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [persistedMessages]);

  // Messages pastdan tepaga qarab qo‘shiladigan qilib sort qilindi
  const allMessages = [...(persistedMessages?.conversation || []), ...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  ); [
    ...(persistedMessages?.conversation || []),
    ...messages,
  ];

  return (
    <div className="flex-1 p-4 overflow-y-scroll space-y-6 bg-[#1E1E2E] h-full text-white rounded-xl shadow-inner border border-[#2A2A3C]">
      {allMessages?.map((msg) => {
        const isCurrentUser = msg.senderId === singleUser.user.id;
        const senderImage = isCurrentUser
          ? singleUser.user.profileImage
            ? `http://localhost:4000/${singleUser.user.profileImage}`
            : defaultImage
          : selectedUser?.profileImage
          ? `http://localhost:4000/${selectedUser.profileImage}`
          : defaultImage;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            <Image
              src={senderImage}
              alt="user image"
              width={45}
              height={45}
              unoptimized
              className="rounded-full shadow-md border border-[#333]"
            />
            <div className="flex flex-col items-start max-w-xs">
              <p className="text-xs text-gray-400 mb-1">
                {isCurrentUser
                  ? singleUser.user.fullName
                  : selectedUser?.fullName}
              </p>
              <div
                className={`px-4 py-2 rounded-xl shadow-md transition-all duration-300 ${
                  isCurrentUser
                    ? "bg-[#3A5AFF] text-white border border-[#5670FF]"
                    : "bg-[#2C2C3A] text-gray-200 border border-[#3A3A4A]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={scrollRef}></div>
    </div>
  );
}

export default Conversation;
