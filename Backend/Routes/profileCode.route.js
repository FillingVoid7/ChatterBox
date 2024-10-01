import express from "express";
import { generateJoinCode } from "../controllers/profileCode.controller.js"
import { verifyToken } from "../middleware/verifyToken.js";
import { addProfileToChat, fetchUserProfile, removeProfileFromChat, fetchAddedProfilesFromList } from "../controllers/userProfile.controller.js";

const router = express.Router()


router.post('/generateCode', verifyToken, generateJoinCode)
router.get('/fetchUserProfile', verifyToken, fetchUserProfile)
router.post('/addProfileToChat', verifyToken, addProfileToChat)
router.post('/removeProfile', verifyToken, removeProfileFromChat);
router.get('/fetchAddedProfilesFromList', verifyToken, fetchAddedProfilesFromList);

export default router