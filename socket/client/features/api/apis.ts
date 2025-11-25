import { useDashboard } from "@/store/dashboard.store"
import axios from "axios"


export const getUsers = async ()  => {
    const token = localStorage.getItem("token")
    const res = await axios.get("http://localhost:4000/message/users", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}


export const getMessages = async (receiverId: string)  => {
    // const selectedUser = useDashboard.getState().selectedUser;
    // console.log(selectedUser);
    
    const token = localStorage.getItem("token")
    const res = await axios.get(`http://localhost:4000/message/${receiverId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data
}