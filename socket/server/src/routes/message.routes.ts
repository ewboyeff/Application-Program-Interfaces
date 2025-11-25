import express from 'express';
import { chat, getAllUsers, getUser, sendMessage } from '../controllers/message.controllers.ts';
import { protectRoute } from '../middleware/protectRoute.ts';


const router = express.Router();



router.get('/user', protectRoute, getUser)
router.get('/users', protectRoute, getAllUsers )
router.post('/send/:id', protectRoute, sendMessage )
router.get('/:id', protectRoute, chat)




export default router