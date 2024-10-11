import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { addMessage, setMessages, setConversation } from '../Redux/Message/messageSlice.js';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useDispatch();

  const connectSocket = useCallback(() => {
    const newSocket = io('http://localhost:3000',{
      reconnectionAttempts: 5, 
      reconnectionDelayMax: 20000,
      withCredentials: true,
      // transports: ['websocket'],  
    },
  );

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    newSocket.on('reconnect_attempt', (attempt) => {
      console.log(`Reconnect attempt #${attempt}`);
    });

    newSocket.on('reconnect', (attempt) => {
      console.log(`Successfully reconnected on attempt #${attempt}`);
    });

    newSocket.on('reconnect_failed', () => {
      console.error('Reconnection failed');           
    });

    /*This listens for the message event from the server and dispatches it to the Redux store, adding the message to the state. */
    newSocket.on('message', (message) => {
      dispatch(addMessage(message));
    });


    /*When a user joins a conversation or fetches previous messages, this handler will update the Redux state with the full history.*/
    newSocket.on('messages', (messages) => {
      dispatch(setMessages(messages));
    });

    newSocket.on('conversation', (conversation) => {
      dispatch(setConversation(conversation));
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    newSocket.on('typing', () => {
      setIsTyping(true);
    });

    newSocket.on('stopTyping', () => {  
      setIsTyping(false);
    });

    setSocket(newSocket);

    return newSocket;
  }, [dispatch]);



  useEffect(() => {
    const newSocket = connectSocket();

    return () => {
      if (newSocket) newSocket.close();
    };
  }, [connectSocket]);



  const joinRoom = useCallback((roomId) => {
    if (socket) socket.emit('joinRoom', roomId);
  }, [socket]);

  const sendMessage = useCallback((data) => {
    if (socket) socket.emit('sendMessage', data);
  }, [socket]);

  const getMessages = useCallback((data) => {
    if (socket) socket.emit('getMessages', data);
  }, [socket]);

  const getConversation = useCallback((userId) => {
    if (socket) socket.emit('getConversations', userId);
  }, [socket]);

  const startTyping = useCallback(() => {
    if (socket) socket.emit('typing');
  }, [socket]);

  const stopTyping = useCallback(() => {  
    if (socket) socket.emit('stopTyping');
  },[socket]);

  const value = {
    socket,
    joinRoom,
    sendMessage,
    getMessages,
    getConversation,
    startTyping,
    stopTyping,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;