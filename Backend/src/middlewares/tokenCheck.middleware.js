import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {User} from '../models/user.model.js';

dotenv.config();

export const tokenCheck = async (req, res, next) => {
    try {
        const token = res.cookies.jwt
        if(!token){
            return res.status(401).json({message: 'Unauthorized: No token provided'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: 'Unauthorized: Invalid token'});
        }

        const user = await User.findById(decoded.userId).select('-password');
        if(!user){
            return res.status(401).json({message: 'Unauthorized: User not found'});
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error',
            error: error.message
        });
    }
}
