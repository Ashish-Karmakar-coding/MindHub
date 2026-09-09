import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
 
export const generateToken = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '30d'
    })

    res.cookie('jwt', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        // 'None' required for cross-domain cookies (frontend/backend on different Vercel domains)
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
        secure: process.env.NODE_ENV !== 'development', // HTTPS required with sameSite='None'
    })

    return token
}