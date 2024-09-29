import crypto from "crypto";
import { User } from "../models/user.model.js";

export const generateJoinCode = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if user already has a join code
        if (user.joinCode) {
            return res.status(200).json({
                success: true,
                joinCode: user.joinCode,
            });
        }

        // Generate new join code
        const joinCode = crypto.randomBytes(4).toString('hex').toUpperCase();
        user.joinCode = joinCode;
        await user.save();

        res.status(200).json({
            success: true,
            joinCode: user.joinCode,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to generate join code',
            error: error.message,
        });
    }
};
