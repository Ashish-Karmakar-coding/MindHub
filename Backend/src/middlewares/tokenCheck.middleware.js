import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

export const tokenCheck = async (req, res, next) => {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.replace(/^Bearer\s+/i, '');
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtError) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Unauthorized: Token expired' });
            }
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();

    } catch (error) {
        console.error('Token check error:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}