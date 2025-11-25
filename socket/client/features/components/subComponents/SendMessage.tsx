import { useGetUser } from "@/features/profile/hooks/useGetUser";
import { useDashboard } from "@/store/dashboard.store";
import axios from "axios";

import { useEffect, useState } from "react";

function SendMessage() {
  const { data } = useGetUser();
  const selectedUser = useDashboard((state) => state.selectedUser);
  const socket = useDashboard((state) => state.socket);
  const addToMessage = useDashboard((state) => state.actions.addToMessages);
  const [content, setContent] = useState("");
  console.log(data);

  const handleSendMessage = async () => {
    if (!content.trim()) return;
    const token = localStorage.getItem("token");
    addToMessage({
      content,
      receiverId: selectedUser?.id || "",
      senderId: data?.user.id,
    });
    socket?.emit("send-message", { content, receiverId: selectedUser?.id });
    const res = await axios.post(
      `http://localhost:4000/message/send/${selectedUser?.id}`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 201) {
      setContent("");
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    });

    return () => document.removeEventListener("keyup", handleSendMessage);
  }, []);

  return (
    <div className="p-4 bg-white border-t flex items-center gap-3">
      <button
        className="text-gray-500 hover:text-yellow-500 transition"
        title="Add emoji"
      >
        😊
      </button>

      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        type="text"
        placeholder="Type your message..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
      >
        Send
      </button>
    </div>
  );
}

export default SendMessage;
