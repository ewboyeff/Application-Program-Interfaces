import axios from "axios"

export const getUser = async () => {
    const res = await axios.get('http://localhost:4000/message/user', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    })
    return res.data
}