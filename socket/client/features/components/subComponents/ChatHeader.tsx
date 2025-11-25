import { useDashboard } from "@/store/dashboard.store";
import defaultImage from "@/assets/images/default.png";
import Image from "next/image";

function ChatHeader() {
  const resetSelectedUser = useDashboard(
    (state) => state.actions.resetSelectedUser
  );

  const selectedUser = useDashboard((state) => state.selectedUser);

  return (
    <div className="w-full h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shadow-sm text-white">
      <div className="flex items-center gap-3">
        <Image
          src={
            selectedUser?.profileImage
              ? `http://localhost:4000/${selectedUser?.profileImage}`
              : defaultImage
          }
          width={50}
          height={50}
          unoptimized
          alt="User Profile"
          className="rounded-full"
        />
        <div>
          <h2 className="text-sm font-semibold text-gray-200">
            {selectedUser?.fullName || "No Chat Selected"}
          </h2>
          <p className="text-xs text-green-400">
            {selectedUser ? "Online" : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-gray-400">
        <button className="hover:text-blue-500 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.25 4.5l3.75-1.5a1.125 1.125 0 011.312.375l2.062 2.625a1.125 1.125 0 01-.25 1.625l-1.687 1.125a11.25 11.25 0 005.25 5.25l1.125-1.687a1.125 1.125 0 011.625-.25l2.625 2.062a1.125 1.125 0 01.375 1.312l-1.5 3.75a1.125 1.125 0 01-1.05.75A16.875 16.875 0 013.75 6a1.125 1.125 0 01.75-1.05z"
            />
          </svg>
        </button>

        <button className="hover:text-blue-500 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72m-2.25 0V6.75a.75.75 0 00-.75-.75H4.5a.75.75 0 00-.75.75v10.5a.75.75 0 00.75.75h8.25a.75.75 0 00.75-.75v-4.5z"
            />
          </svg>
        </button>

        <button
          onClick={resetSelectedUser}
          className="hover:text-blue-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M6 12h.01M12 12h.01M18 12h.01"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
