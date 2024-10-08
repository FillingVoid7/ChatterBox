    import React, { useEffect, useState, useCallback } from 'react';
    import {
        DotsHorizontalIcon,
        EmojiHappyIcon,
        PaperClipIcon,
        MicrophoneIcon, 
        PhotographIcon,
        PaperAirplaneIcon,
    } from '@heroicons/react/outline';
    import { useSocket } from '@/context/SocketContext.jsx';    
    import { useDispatch, useSelector } from 'react-redux';
    import { setMessages, addMessage, setTyping } from '@/Redux/Message/messageSlice.js';

    const MessageUI = ({ user, loggedInUserId }) => {
        const [inputMessage, setInputMessage] = useState('');
        const { joinRoom, leaveRoom, sendMessage: sendSocketMessage, listenForMessages, fetchMessages, startTyping , stopTyping } = useSocket();
        const messages = useSelector((state) => state.messages);
        const isTyping = useSelector((state) => state.typing);
        const dispatch = useDispatch();

        const handleNewMessage = useCallback((newMessage) => {
            dispatch(addMessage(newMessage));
        }, [dispatch]);


        useEffect(() => {
            console.log('Component mounted. Joining room:', user._id);
            joinRoom(user._id);

            const fetchInitialMessages = async () => {
                try {
                    const fetchedMessages = await fetchMessages({ otherUserId: user._id, userId: loggedInUserId });
                    console.log('Fetched messages:', fetchedMessages);
                    dispatch(setMessages(fetchedMessages));
                } catch (error) {
                    console.error('Failed to fetch messages:', error);
                }
            };

            fetchInitialMessages();

            // Listen for new messages
            listenForMessages(handleNewMessage);

            // Listen for typing status
            const handleTypingStatus = (status) => {
                dispatch(setTyping(status));
            };

            // Add listeners for typing status
            if (socket) {
                socket.on('typing', () => handleTypingStatus(true));
                socket.on('stopTyping', () => handleTypingStatus(false));
            }

            // Clean up on unmount
            return () => {
                console.log('Component unmounting. Leaving room:', user._id);
                leaveRoom(user._id);
                if (socket) {
                    socket.off('typing');
                    socket.off('stopTyping');
                }
            };
        }, [user._id, joinRoom, leaveRoom, listenForMessages, fetchMessages, dispatch, handleNewMessage, loggedInUserId]);

        const handleSendMessage = async () => {
            if (inputMessage.trim() !== '') {
                const message = { text: inputMessage.trim(), sender: loggedInUserId };

                try {
                    await sendSocketMessage({ recipientId: user._id, message: inputMessage.trim(), senderId: loggedInUserId });
                    dispatch(addMessage({ ...message, _id: Date.now().toString() }));
                    setInputMessage('');
                    stopTyping();
                    dispatch(setTyping(false));
                } catch (error) {
                    console.error('Failed to send message:', error);
                }
            }
        };

        const handleInputMessage = (e) => {
            setInputMessage(e.target.value);
            startTyping();
        }

        const handleInputBlur = () => {
            stopTyping();
            dispatch(setTyping(false));
        }

        return (
            <div className="flex flex-col h-full relative">
                <div className="flex items-center p-2 mb-1 relative">
                    <div className="bg-sky-500 text-white rounded-full h-8 w-8 flex items-center justify-center ml-6">
                        {user.firstName.charAt(0) + user.lastName.charAt(0)}
                    </div>
                    <div className="ml-2">
                        <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
                    </div>
                    <div className="absolute mt-2 right-7 top-1/2 transform -translate-y-1/2">
                        <button className="text-white hover:text-gray-400">
                            <DotsHorizontalIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-700 opacity-50"></div>

                <div className="flex-1 p-4 overflow-y-auto flex flex-col">
                    {Array.isArray(messages) && messages.length === 0 ? (
                        <p>No messages yet. Start the conversation!</p>
                    ) : (
                        Array.isArray(messages) && messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`p-2 my-2 rounded-lg text-white inline-block 
                                    ${msg.sender === loggedInUserId ? 'bg-blue-600 self-end' : 'bg-blue-500 self-start'}`}
                                style={{ maxWidth: '75%' }}
                            >
                                {msg.text}
                            </div>
                        ))
                    )}
                    {isTyping && (
                        <div className='text-gray-400 self-start'>
                            {user.firstName} is typing...
                            </div>
                    )}
                </div>

                <div className="p-4 flex items-center bottom-0 w-full bg-gray-900">
                    <EmojiHappyIcon className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white" />

                    <div className="flex items-center flex-1 bg-gray-800 text-white p-2 mx-4 rounded-lg relative">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent outline-none"
                            value={inputMessage}
                            onChange={handleInputMessage  }
                            onBlur = {handleInputBlur}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                        />
                        <PaperAirplaneIcon
                            className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white rotate-90 absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={handleSendMessage}
                        />
                    </div>

                    <PhotographIcon className="h-6 w-6 text-gray-400 cursor-pointer hover:text-white" />
                    <PaperClipIcon className="h-6 w-6 text-gray-400 cursor-pointer ml-2 hover:text-white" />
                    <MicrophoneIcon className="h-6 w-6 text-gray-400 cursor-pointer ml-2 hover:text-white" />
                </div>
            </div>
        );
    };

    export default MessageUI;