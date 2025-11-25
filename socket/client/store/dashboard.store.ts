import { create } from 'zustand';
import { io } from 'socket.io-client';

type SelectedUserType = {
    id: string;
    fullName: string;
    email: string;
    profileImage: string;
}

type RealTimeMessageType = {
    content: string;
    senderId: string;
    receiverId: string;
}

type DashboardActions = {
    setSelectedUser: (user: SelectedUserType | null) => void;
    resetSelectedUser: () => void;
    connectToSocket: (token: string) => void;
    addToMessages: (msg:RealTimeMessageType) => void;
    addUsers: (users: SelectedUserType[]) => void;
    filterUsers: (isCheck: boolean) => void;
}



type DashboardState = {
    selectedUser: SelectedUserType | null;
    onlineUsers: string[];
    socket: ReturnType<typeof io> | null;
    messages: RealTimeMessageType[]
    actions: DashboardActions;
    users: SelectedUserType[];
    filteredUsers: SelectedUserType[];
}

export const useDashboard = create<DashboardState>((set,get) => ({
    selectedUser: null,
    onlineUsers: [],
    socket: null,
    messages: [],
    users: [],
    filteredUsers: [],

    actions: {
        filterUsers: (isChecked) => {
            if(!isChecked) {
                set({ filteredUsers: get().users })
                return;
            }
            const onlineUsers = get().users.filter((user) => get().onlineUsers.includes(user.id));
            set({ filteredUsers: onlineUsers });
        },
        addUsers: (users) => set({users, filteredUsers: users}),
        setSelectedUser: (user) => set({ selectedUser: user }),
        resetSelectedUser: () => set({ selectedUser: null }),
        connectToSocket: (token: string) => {
            const socket = io("http://localhost:4000", {
                auth: {
                    token
                }
            });
            set({ socket });

            socket.on("online-users", (users: string[]) => {
                set({ onlineUsers: users });
            });


            socket.on("receive-message", (msg) => {
                set((state) => ({messages: [...state.messages, msg]}))

            })
        },
        addToMessages: (msg) =>  set((state) => ({messages: [...state.messages, msg]}))
    }
}))