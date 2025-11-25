
// types
import { Request, Response } from "express";
// db
import prisma from '../utils/prismaConfig.ts';
// libs
import z from 'zod';
import bcrypt from "bcryptjs";
import { genereteToken } from "../utils/generateToken.ts";



const registerSchema = z.object({
    fullName: z.string().min(2),
    email: z.email("wrong email format"),
    password: z.string().min(6)
})


const loginSchema = z.object({
    email: z.email("wrong email format"),
    password: z.string().min(6)
})

export const register = async (req: Request, res: Response) => {
    const result = registerSchema.safeParse(req.body)

    if(!result.success){
        res.status(400).json({message: "wrong data format"})
    }
    const inputs = result.data

    try{
        const email = await prisma.user.findUnique({
            where: {email: inputs?.email  }
        })
    
        if(email){
            res.status(409).json({message: "email already in use"})
        }

        const saltRounds = 4;

        const hashedPassword = await bcrypt.hash(inputs?.password!, saltRounds)

        

        const user = await prisma.user.create({
            data: {
                fullName:inputs?.fullName!, 
                email: inputs?.email!,
                passwordHash: hashedPassword
            },
            select: {
                id: true,
                fullName: true, 
                email: true,
                profileImage: true  
            }
        })


        
        res.status(200).json({message: "registered successfully", data: user})

    } catch(err){
        console.log(err);
        res.status(500).json({message:"internal server error"})
    }

}

export const login = async (req: Request, res: Response) => {

    const result = loginSchema.safeParse(req.body);

    if(!result.success){
        res.status(400).json({message: "wrong data format"})
        return
    }

    const inputs = result.data
  
    try{
        const user = await prisma.user.findUnique({
            where: {email: inputs.email}
        })

        if(!user){
            res.status(401).json({message: "invalid email or password"}) 
        }

        const result = await bcrypt.compare(inputs.password, user!.passwordHash)
        
        if(!result){
            res.status(401).json({message: "invalid email or password"}) 
        }
    
        const token = genereteToken(user?.id!)
        res.json({message: "success", token:token})

    } catch(e){
        console.log(e);
        res.status(500).json({message: "internal server error"}) 
    }
}

export const profileUpdate = async (req: Request, res: Response) => {

    const updatedUser = await prisma.user.update({
        where: {id: req.userId },
        data: {
            profileImage: req.file?.filename
        }
    })
    
   
    res.json({message: "a user has been updated ", user: updatedUser})
}


