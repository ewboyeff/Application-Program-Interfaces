"use client";
import { useDashboard } from "@/store/dashboard.store";
import { useGetUsers } from "../hooks/queries";
import Image from "next/image";
import defaultImg from "@/assets/images/default.png";
import { useEffect, MouseEvent } from "react";

function SideBar() {
  const { data: users } = useGetUsers();
  const setSelectedUser = useDashboard((state) => state.actions.setSelectedUser);
  const connectToSocket = useDashboard((state) => state.actions.connectToSocket);
  const filterUsers = useDashboard((state) => state.actions.filterUsers);
  const addUsers = useDashboard((state) => state.actions.addUsers);
  const filteredUsers = useDashboard((state) => state.filteredUsers);
  const onlineUsers = useDashboard((state) => state.onlineUsers);

  useEffect(() => {
    if (users) addUsers(users.users);
  }, [users, addUsers]);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    connectToSocket(token);
  }, []);

  const handleOnlineUsers = (e) => {
    filterUsers(e.currentTarget.checked);
  };

  return (
    <div className="h-screen w-72 bg-[#0E1621] text-white flex flex-col border-r border-[#1F2933] shadow-xl">
      {/* Header */}
      <div className="p-4 text-xl font-semibold border-b border-[#1F2933]">
        Chats
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between px-4 py-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
          <span className="text-gray-300">Online only</span>
          <div className="relative">
            <input
              type="checkbox"
              onClick={handleOnlineUsers}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-blue-500 transition" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition" />
          </div>
        </label>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3 py-2 rounded-xl bg-[#17212B] text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-2">
          {filteredUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#17212B] cursor-pointer transition border border-transparent hover:border-[#263241]"
            >
              <Image
                src={user.profileImage ? `http://localhost:4000/${user.profileImage}` : defaultImg}
                alt="user image"
                width={48}
                height={48}
                unoptimized
                className="rounded-full"
              />
              <div>
                <p className="text-base font-medium text-gray-100">{user.fullName}</p>
                <p className="text-xs text-gray-400">
                  {onlineUsers.includes(user.id) ? "online" : "offline"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1F2933] p-4 flex items-center gap-3 bg-[#0E1621]">
        <img
          src="https://randomuser.me/api/portraits/men/5.jpg"
          alt="You"
          className="w-11 h-11 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-medium text-gray-200">You</p>
          <p className="text-xs text-green-400">Active now</p>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
// Paste your updated Sidebar component here
