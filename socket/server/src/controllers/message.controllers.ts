import type { Request, Response } from "express";
import prisma from "../utils/prismaConfig.ts";


export const getAllUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        where: {
            id: {not: req.userId}
        }
    })
    return res.json({message: "success", users})
}

export const getUser = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: {
            id:  req.userId
        }
    })
    return res.json({message: "success", user})
}


export const sendMessage = async (req: Request, res: Response) => {
    const senderId = req.userId;
    const receiverId = req.params.id;    
    const {content} = req.body;

    const newMessage = await prisma.message.create({
        data: {
            senderId,
            receiverId,
            content,
        }
    })


    res.status(201).json({message: "success", content: newMessage})
}


export const chat = async (req: Request, res: Response) => {
    const senderId  = req.userId;
    const receiverId = req.params.id;

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                {
                    senderId: senderId,
                    receiverId: receiverId
                }, 
                {
                    senderId: receiverId,
                    receiverId: senderId
                }
            ]
        },
        orderBy: {
            createdAt: "asc"
        },

    })
    

    res.json({message: 'success', conversation:messages })
}
