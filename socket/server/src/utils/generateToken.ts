import jwt from 'jsonwebtoken';

export const genereteToken = (userId: string) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET!, {expiresIn: '1d'} )
    return token
}