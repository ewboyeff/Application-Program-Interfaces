import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import prisma from "../utils/prismaConfig.ts";

interface jwtPayloadWithId extends jwt.JwtPayload {
    userId : string
}

// interface RequestWithID extends Request {
//     userId: string
// }

export const protectRoute = async (req: Request, res: Response, next: NextFunction ) => {
    if(!req.headers.authorization) {
        res.status(401).json({message: "not authorized"})
        return
    } 
    const token = req.headers.authorization?.split(" ")[1]
    try{ 
        const result = jwt.verify(token!, process.env.JWT_SECRET!) as jwtPayloadWithId;
        // const user = await prisma.user.findUnique({
        //     where : {id: result.userId}
        // })
        // if(!user){
        //     return res.status(401).json({message: "not authorized"})   
        // }
        req.userId = result.userId    
        next()
    } catch(e){
        return res.status(401).json({message: "token expired or token unusable"})  
    }
}