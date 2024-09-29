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

async function sendMessage(socket, io, data) {
  try {
    // Destructure data to get recipientId, senderId, and messageText
    const { message: { recipientId, senderId, message: messageText } } = data;
    console.log('Received data:', { recipientId, senderId, messageText });

    if (!messageText) {
      return socket.emit('error', { error: 'Message text is required' });
    }

    console.log('Finding conversation between:', senderId, 'and', recipientId);

    // Validate IDs
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
    
    socket.join(senderId); 
    socket.join(recipientId);
    // Emit message to both sender and recipient
    io.to(recipientId).emit('newMessage', newMessage);
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

    // Find the conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    // Check if conversation is found
    if (!conversation) {
      console.log('Conversation not found');
      return socket.emit('error', { error: 'Conversation not found' });
    }

    console.log('Conversation found:', conversation);

    // Fetch messages for the conversation
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    
    console.log('Messages fetched:', messages);

    // Emit messages to the socket
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

export { sendMessage, getMessages, getConversations };
