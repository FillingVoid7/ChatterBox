import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

// Create the SocketContext
const SocketContext = createContext();

// Initial state for the reducer
const initialState = {
  socket: null,
  currentRoom: null,
};

// Reducer to manage WebSocket state and events
const socketReducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT':
      return { ...state, socket: action.payload };
    case 'DISCONNECT':
      if (state.socket) {
        state.socket.disconnect();
      }
      return { ...state, socket: null };
    case 'JOIN_ROOM':
      return { ...state, currentRoom: action.payload };
    case 'LEAVE_ROOM':
      if (state.socket && state.currentRoom) {
        state.socket.emit('leave_room', state.currentRoom);
      }
      return { ...state, currentRoom: null };
    default:
      return state;
  }
};


export const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    dispatch({ type: 'CONNECT', payload: socket });

    return () => {
      socket.disconnect();
      dispatch({ type: 'DISCONNECT' });
    };
  }, []);

  // Function to join a chat room
  const joinRoom = useCallback(
    (roomId) => {
      if (state.socket && roomId && state.currentRoom !== roomId) {
        state.socket.emit('join_room', roomId);
        console.log(`Joined room ${roomId}`);
        dispatch({ type: 'JOIN_ROOM', payload: roomId });
      }
    },
    [state.socket]
  );

  // Function to leave a chat room
  const leaveRoom = useCallback(
    (roomId) => {
      if (state.socket && roomId) {
        state.socket.emit('leave_room', roomId);
        dispatch({ type: 'LEAVE_ROOM' });
      }
    },
    [state.socket]
  );

  // Function to send a message
  const sendMessage = useCallback(
    (message, recipientId, senderId) => {
      if (state.socket) {
        state.socket.emit('sendMessage', {
          recipientId,
          message,
          senderId,
        });
      }
    },
    [state.socket]
  );

  // Function to listen for new incoming messages in real-time
  const listenForMessages = useCallback((callback) => {
    if (state.socket) {
      state.socket.on('newMessage', (newMessage) => {
        if (callback) {
          callback(newMessage);
        }
      });
    }
  }, [state.socket]);

  const fetchMessages = useCallback((data) => {
    return new Promise((resolve, reject) => {
      if (state.socket) {
        state.socket.emit('getMessages', data);

        // Handle the response from the server
        state.socket.once('messages', (messages) => {
          if (messages) {
            resolve(messages);
          } else {
            reject(new Error('No messages received'));
          }
        });
      } else {
        reject(new Error('Socket is not connected'));
      }
    });
  }, [state.socket]);


  // Handle messages event
  useEffect(() => {
    if (state.socket) {
      state.socket.on('messages', (messages) => {
        console.log('Messages:', messages);
        // Handle messages data (you can integrate Zustand store here)
      });
    }
  }, [state.socket]);

  // Function to fetch conversations for a user
  const fetchConversations = useCallback((userId) => {
    if (state.socket) {
      state.socket.emit('getConversations', userId);
      state.socket.on('conversations', (conversations) => {
        console.log('Conversations:', conversations);
        // Handle conversations data (you can integrate Zustand store here)
      });
    }
  }, [state.socket]);

  return (
    <SocketContext.Provider
      value={{
        joinRoom,
        leaveRoom,
        sendMessage,
        listenForMessages,
        fetchMessages,
        fetchConversations,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for accessing the socket context
export const useSocket = () => useContext(SocketContext);
