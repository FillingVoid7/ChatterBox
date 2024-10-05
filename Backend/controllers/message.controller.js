import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import mongoose from "mongoose";

// Validate ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Use this function to validate ids
const validateIds = (senderId, recipientId) => {
  if (!isValidObjectId(senderId) || !isValidObjectId(recipientId)) {
    return { valid: false, error: 'Invalid ID format' };
  }
  return { valid: true };
};


async function sendMessage(socket, data) {
  try {
    const { recipientId, senderId, message: messageText } = data;
    console.log('Received data:', { recipientId, senderId, messageText });

    if (!messageText) {
      return socket.emit('error', { error: 'Message text is required' });
    }

    console.log('Finding conversation between:', senderId, 'and', recipientId);

    const { valid, error } = validateIds(senderId, recipientId);
    if (!valid) {
      return socket.emit('error', { error });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: messageText,
          sender: senderId,
        },
      });
      await conversation.save();
      console.log('New conversation created:', conversation);
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: messageText,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: messageText,
          sender: senderId,
        },
      }),
    ]);

    console.log('Message sent:', newMessage);

    socket.to(recipientId).emit('newMessage', newMessage); 

    socket.emit('messageSent', newMessage);

  } catch (error) {
    console.error('Error in sendMessage:', error);
    socket.emit('error', { error: error.message });
  }
}




async function getMessages(socket, data) {
  const { otherUserId, userId } = data;
  try {
    console.log('Finding conversation for users:', userId, 'and', otherUserId);

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      console.log('Conversation not found');
      return socket.emit('error', { error: 'Conversation not found' });
    }

    console.log('Conversation found:', conversation);

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });


    console.log('Messages fetched:', messages);

    socket.emit('messages', messages);
  } catch (error) {
    console.error('Error in getMessages:', error);
    socket.emit('error', { error: error.message });
  }
}


async function getConversations(socket, userId) {
  try {
    const conversations = await Conversation.find({ participants: userId }).populate({
      path: "participants",
      select: "firstName lastName userProfileIcon",
    });

    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant._id.toString() !== userId.toString()
      );
    });

    socket.emit('conversations', conversations);
  } catch (error) {
    console.error('Error in getConversations:', error);
    socket.emit('error', { error: error.message });
  }
}



async function typing(socket, roomId) {
  socket.to(roomId).emit('typing');
}

async function stopTyping(socket, roomId) {
  socket.to(roomId).emit('stopTyping');
} 

export { sendMessage, getMessages, getConversations, typing, stopTyping };