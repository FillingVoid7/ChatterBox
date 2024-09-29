import express from "express";
import { signup,Login,Logout,verifyEmail,forgotPassword, resetPassword ,checkAuth } from "../controllers/auth.controller.js";
const router = express.Router()
import { verifyToken } from "../middleware/verifyToken.js";

router.get("/check-auth", verifyToken, checkAuth);

router.post('/signup',signup)

router.post('/login' ,Login)

router.post('/logout' ,Logout)

router.post('/verify-email', verifyEmail)

router.post('/forgot-password' , forgotPassword)

router.post('/reset-password/:token' , resetPassword)

export default router