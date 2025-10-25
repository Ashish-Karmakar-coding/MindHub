import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
 
export const generateToken = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn: '7d'
    })

    res.cookie('jwt', token,{
        maxAge: 12 * 24 * 60 * 60 * 1000, // 12 days
        httpOnly: true,
        sameSite: 'Strict',
        secure : process.env.NODE_ENV !== 'development', // Use secure cookies in production
    })

    return token
}