import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.ts";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import redis, { initRedis } from './utils/redisConfig.ts'



dotenv.config();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://localhost:3000"
    }
});

type OnlineUsersType = {
    [userId: string] : string
}

// in memory DB
const onlineUsers: OnlineUsersType  = {

}

await initRedis();

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Authentication error: Token not provided"));
    }
    try{
        
        const decode = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        socket.data.userId = decode.userId;       
        next()
    } catch (e){
        next(new Error("not authorized"))
    }
    
})




io.on("connection", async (socket) => {
    onlineUsers[socket.data.userId] = socket.id;
    
    
   await redis.set(`online:${socket?.data.userId}`, socket?.id)
   
   const redisOnlineUsers = await redis.keys('online:*');
  
   const redisUserIds = redisOnlineUsers.map((userId) => userId.split(':')[1]);
   console.log(redisUserIds);




    socket.broadcast.emit("online-users", redisUserIds);


    socket.on("send-message", (data) => {
        const {content, receiverId} = data;
        const senderId = socket.data.userId;
        const receiverSocketId = onlineUsers[receiverId];

        if(receiverSocketId) {
            io.to(receiverSocketId).emit("receive-message", {
                content,
                senderId,
                receiverId
            });
        }
    
    })
    

    socket.on("disconnect", async () => {
        delete onlineUsers[socket.data.userId];
        await redis.del(`online:${socket?.data.userId}`)
        socket.broadcast.emit("online-users", Object.keys(onlineUsers));
    })
});


const PORT = process.env.PORT

httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    
});