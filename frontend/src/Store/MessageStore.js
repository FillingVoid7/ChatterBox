import { create } from "zustand";
import { useSocket } from '@/context/SocketContext.jsx';

export const useMessageStore = create((set) => ({
  messages: [],  // Initialize as an array
  conversations: [],
  loading: false,
  error: null,

  setMessages: (newMessages) => set({
    messages: Array.isArray(newMessages) ? newMessages : [], // Ensure it's an array
    loading: false,
    error: null
  }),

  sendMessage: (recipientId, message) => {
    const { sendMessage } = useSocket(); // Get sendMessage function from SocketContext
    set({ loading: true, error: null });

    try {
      sendMessage(message, recipientId); // Emit message using WebSocket
    } catch (error) {
      console.error('Error in sendMessage:', error);
      set({
        error: 'Error sending message',
        loading: false,
      });
    }
  },

  getMessages: (otherUserId) => {
    const { socket, listenForMessages } = useSocket(); // Get socket and message listener functions from SocketContext
  
    set({ loading: true, error: null });
  
    // Listen for incoming messages via WebSocket
    listenForMessages((newMessage) => {
      set((state) => {
        const messages = Array.isArray(state.messages) ? state.messages : [];
        const isDuplicate = messages.some(msg => msg._id === newMessage._id);
        return isDuplicate ? state : {
          messages: [...messages, newMessage],
          loading: false,
          error: null,
        };
      });
    });
  
    // Fetch initial messages when the socket emits 'messages'
    socket.emit('getMessages', { otherUserId });
  
    // Listen for the fetched initial messages and update the store
    socket.on('messages', (initialMessages) => {
      console.log('Setting messages:', initialMessages); // Debug log
      setMessages(initialMessages); // Call setMessages with the fetched messages
    });
  },
  
  

  getConversations: () => {
    const { fetchConversations } = useSocket(); // Get fetchConversations function from SocketContext
    set({ loading: true, error: null });

    fetchConversations(); // Emit fetchConversations event using WebSocket

    // Listen for conversations data
    const { socket } = useSocket();
    socket.on('conversations', (conversations) => {
      set({
        conversations: conversations,
        loading: false,
        error: null
      });
    });
  },

  clearMessages: () => set({ messages: [] }),

  clearConversations: () => set({ conversations: [] }),

  clearError: () => set({ error: null }),
}));
