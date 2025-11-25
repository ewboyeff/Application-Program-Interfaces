import express from 'express';
import authRoutes from './routes/auth.routes.ts'
import messageRoutes from './routes/message.routes.ts';
import cors from 'cors';


const app = express();

app.use(cors())
app.use(express.static("public"));

app.use(express.json())


app.use('/auth', authRoutes)
app.use('/message', messageRoutes)



export default app