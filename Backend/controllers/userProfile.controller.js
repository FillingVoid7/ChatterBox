import { User } from "../models/user.model.js";
import { Conversation } from "../models/conversation.model.js"

export const fetchUserProfile = async (req, res) => {
    try {
        const { joinCode } = req.query;

        if (!joinCode) {
            return res.status(400).json({
                success: false,
                message: 'Join code is required',
            });
        }

        // Debugging: Log the joinCode to ensure it's being received
        console.log('Received joinCode:', joinCode);

        const cleanedJoinCode = joinCode.trim();
        const user = await User.findOne({ joinCode: cleanedJoinCode }).select('firstName lastName');
        
        console.log('User found:',user)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving user Profile',
            error: error.message,
        });
    }
}


export const addProfileToChat = async (req, res) => {
    try {
        const { profileId } = req.body;
        const loggedInUserId = req.user ? req.user.id : null;

        console.log('AddProfileToChat called');
        console.log('Profile ID:', profileId);
        console.log('Logged-in User ID:', loggedInUserId);

        if (!loggedInUserId) {
            console.log('User not authenticated');
            return res.status(400).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        if (!profileId) {
            console.log('Profile ID is required');
            return res.status(400).json({
                success: false,
                message: 'Profile ID is required',
            });
        }

        if (profileId === loggedInUserId) {
            console.log('Cannot add yourself to the chat list');
            return res.status(400).json({
                success: false,
                message: 'You cannot add yourself to the chat list',
            });
        }

        const profileToAdd = await User.findById(profileId);
        if (!profileToAdd) {
            console.log('Profile not found');
            return res.status(404).json({
                success: false,
                message: 'Profile not found',
            });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [loggedInUserId, profileId] }
        });

        console.log('Conversation found:', conversation);

        if (conversation) {
            console.log('Profile is already in the chat list');
            return res.status(400).json({
                success: false,
                message: 'This profile is already in your chat list'
            });
        } 

        conversation = new Conversation({
            participants: [loggedInUserId, profileId]
        });
        await conversation.save();

        console.log('Profile added to chat list successfully');
        return res.status(200).json({
            success: true,
            message: 'Profile added to chat list successfully',
            conversation,
            profile: profileToAdd,
        });

    } catch (error) {
        console.error('Failed to add profile to chat list:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to add profile to chat list',
            error: error.message,
        });
    }
};


export const fetchAddedProfilesFromList = async (req, res) => {
    try {
        const loggedInUserId = req.user ? req.user.id : null;

        if (!loggedInUserId) {
            return res.status(400).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        // Find conversations where the logged-in user is a participant
        const conversations = await Conversation.find({
            participants: loggedInUserId
        }).populate('participants', 'firstName lastName userProfileIcon joinCode');

        // Extract the other participant's profiles from the conversations
        const chatList = conversations.flatMap(conversation =>
            conversation.participants.filter(participant => participant._id.toString() !== loggedInUserId)
        );

        res.status(200).json({
            success: true,
            chatList
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chat list',
            error: error.message,
        });
    }
};





export const removeProfileFromChat = async (req, res) => {
    try {
        const { profileId } = req.body;
        const loggedInUserId = req.user ? req.user.id : null;

        console.log("Debug Point: removeProfileFromChat called");
        console.log("Profile ID to remove:", profileId);
        console.log("Logged-in User ID:", loggedInUserId);

        if (!profileId) {
            return res.status(400).json({
                success: false,
                message: 'Profile ID is required',
            });
        }

        // Find the conversation involving the current user and the profile to be removed
        const conversation = await Conversation.findOne({
            participants: { $all: [loggedInUserId, profileId] }
        });

        if (!conversation) {
            console.log("No conversation found between the users");
            return res.status(404).json({
                success: false,
                message: 'Conversation not found',
            });
        }

        console.log("Conversation found:", conversation);

        // Remove the profile from the conversation
        conversation.participants = conversation.participants.filter(participant => participant.toString() !== profileId);

        if (conversation.participants.length <= 1) {
            console.log("Removing the entire conversation");
            await Conversation.findByIdAndDelete(conversation._id);
        } else {
            console.log("Saving updated conversation");
            await conversation.save();
        }

        res.status(200).json({
            success: true,
            message: 'Profile removed from chat list successfully',
        });
    } catch (error) {
        console.error("Error in removeProfileFromChat:", error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to remove profile from chat list',
            error: error.message,
        });
    }
};
