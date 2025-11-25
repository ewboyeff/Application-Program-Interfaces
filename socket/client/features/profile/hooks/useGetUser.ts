import { useQuery } from "@tanstack/react-query"
import { getUser } from "../api/apis"


export const useGetUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUser
    })
}