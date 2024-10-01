import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
    console.log('Cookies:', req.cookies);

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        // Fetch the user based on the decoded userId
        const user = await User.findById(decoded.userId).select('-password'); // Optionally exclude the password field

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        // Attach the user object to req.user
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in verifyToken:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
