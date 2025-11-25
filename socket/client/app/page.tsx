"use client";
import ChatContainer from "@/features/components/ChatContainer";
import NoChatSelected from "@/features/components/NoChatSelected";
import SideBar from "@/features/components/SideBar";
import { useDashboard } from "@/store/dashboard.store";
import { useEffect } from "react";

export default function Home() {
  const selectedUser = useDashboard((state) => state.selectedUser);
  const resetSelectedUser = useDashboard(
    (state) => state.actions.resetSelectedUser
  );

  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape") {
        resetSelectedUser();
      }
    });
  }, []);

  return (
    <div className="flex">
      <SideBar />
      {selectedUser ? <ChatContainer /> : <NoChatSelected />}
    </div>
  );
}
