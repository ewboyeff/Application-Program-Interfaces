import { useQuery } from "@tanstack/react-query";
import { getMessages, getUsers } from "../api/apis";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });
};

export const useGetMessages = (receiverId: string) => {
  return useQuery({
    queryKey: ["messages", receiverId],
    queryFn: () => getMessages(receiverId),
    enabled: !!receiverId,
  });
};
