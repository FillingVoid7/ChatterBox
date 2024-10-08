// import React, { useState, useEffect, useRef } from 'react';
// import UserProfile from '@/components/sidebar/UserProfile.jsx';
// import { ChevronDownIcon, SearchIcon, PlusIcon } from '@heroicons/react/outline';
// import { FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
// import { useProfileCodeStore } from '@/Store/CodeStore.js';
// import { useSocket } from '@/context/SocketContext.jsx';


// function ConversationSection({ user, onChatSelect }) {
//     if (!user) {
//         return <div>Loading...</div>;
//     }

//     const [isNewChatOpen, setIsNewChatOpen] = useState(false);
//     const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [isOverlayOpen, setIsOverlayOpen] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [searchClicked, setSearchClicked] = useState(false);

//     const {
//         fetchUserProfile,
//         fetchAddedProfilesFromList, // Fetch added profiles from the list
//         userProfile,
//         loading,
//         error,
//         addProfileToList,
//         removeProfileFromList,
//         addedProfiles,
//         clearError
//     } = useProfileCodeStore();

//     const overlayRef = useRef(null);
//     const { joinRoom, listenForMessages } = useSocket();

//     const toggleNewChatMenu = () => setIsNewChatOpen(!isNewChatOpen);
//     const toggleRecentChatsMenu = () => setIsRecentChatsOpen(!isRecentChatsOpen);

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         const trimmedJoinCode = searchQuery.trim();
//         if (trimmedJoinCode) {
//             try {
//                 setSearchClicked(true);
//                 await fetchUserProfile(trimmedJoinCode);
//                 setSearchQuery('');
//             } catch (err) {
//                 setErrorMessage(err.message || 'Failed to fetch user profile');
//             }
//         }
//     };

//     const handleOverlayClick = async () => {
//         if (userProfile) {
//             try {
//                 await addProfileToList(userProfile);
//                 setIsOverlayOpen(false);
//                 joinRoom(userProfile._id);   //join room after adding profile
//             } catch (err) {
//                 setErrorMessage(err.message || 'Failed to add profile to chat list');
//             }
//         } else {
//             setErrorMessage('User profile is undefined when trying to add to the list.');
//         }
//     };

//     const handleRemoveProfile = async (profileId, e) => {
//         e.stopPropagation();
//         try {
//             await removeProfileFromList(profileId);
//             setIsOverlayOpen(false);
//             joinRoom(user._id); //Rejoin the room with current user
//         } catch (err) {
//             setErrorMessage(err.message || 'Failed to remove profile from chat list');
//         }
//     };

//     const closeOverlay = (e) => {
//         if (overlayRef.current && !overlayRef.current.contains(e.target)) {
//             setIsOverlayOpen(false);
//         }
//     };

//     useEffect(() => {
//         // Fetch profiles already added to the chat list on component mount
//         fetchAddedProfilesFromList();
//     }, [fetchAddedProfilesFromList]);

//     useEffect(() => {
//         if (searchClicked && userProfile && !addedProfiles.some(p => p.joinCode === userProfile.joinCode)) {
//             setIsOverlayOpen(true);
//             setErrorMessage('');
//         } else if (searchClicked && userProfile) {
//             setErrorMessage('This user is already added to the chat list.');
//             setIsOverlayOpen(false);
//         }
//         setSearchClicked(false);
//     }, [userProfile, addedProfiles, searchClicked]);

//     useEffect(() => {
//         let timer;
//         if (isOverlayOpen) {
//             timer = setTimeout(() => {
//                 setIsOverlayOpen(false);
//             }, 10000); // 10 seconds
//         }
//         return () => clearTimeout(timer);
//     }, [isOverlayOpen]);

//     useEffect(() => {
//         if (isOverlayOpen) {
//             document.addEventListener('click', closeOverlay);
//         } else {
//             document.removeEventListener('click', closeOverlay);
//         }
//         return () => {
//             document.removeEventListener('click', closeOverlay);
//         };
//     }, [isOverlayOpen]);

//     useEffect(() => {
//         if (error) {
//             setErrorMessage(error);
//             const timer = setTimeout(() => {
//                 setErrorMessage('');
//                 clearError();
//             }, 5000); // Error message duration
//             return () => clearTimeout(timer);
//         }
//     }, [error, clearError]);

//     useEffect(() => {
//         if (errorMessage) {
//             const timer = setTimeout(() => {
//                 setErrorMessage('');
//             }, 5000); // Error message duration
//             return () => clearTimeout(timer);
//         }
//     }, [errorMessage]);

//     useEffect(() => {
//         const handleNewMessage = (message) => {
//             console.log('New message received:', message);
//         };

//         listenForMessages(handleNewMessage);

//         return () => {
//             // Cleanup any listeners if needed
//         };
//     }, [listenForMessages]);

//     const handleProfileClick = (profile) => {
//         if (profile && profile._id) {
//             joinRoom(profile._id)
//             onChatSelect(profile)
//         }
//     };

//     return (
//         <div className="h-full bg-gray-900 text-white relative">
//             <div className="bg-sky-800 p-2">
//                 <UserProfile firstName={user.firstName} lastName={user.lastName} />
//             </div>

//             <div className="p-4 bg-gray-900 text-white h-full">
//                 <div className="mb-2">
//                     <div className="relative flex items-center space-x-2">
//                         <SearchIcon className="absolute left-3 top-2 h-4 w-5 text-gray-400" />
//                         <input
//                             type="text"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             placeholder="Enter join code"
//                             className="w-full max-w-xs bg-gray-800 text-sm text-white px-7 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                         <button
//                             onClick={handleSearch}
//                             className="ml-2 bg-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-500"
//                         >
//                             Search
//                         </button>

//                         {errorMessage && (
//                             <div className="fixed top-2 left-1/2 transform -translate-x-1/2 w-80 bg-gray-800 text-red-300 text-sm p-2 rounded shadow-lg flex items-center space-x-2">
//                                 <FaInfoCircle className="h-4 w-4 text-gray-500" />
//                                 <span>{errorMessage}</span>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="flex justify-between items-center mb-2">
//                     <h2 className="text-xl font-semibold">Chats</h2>
//                     <div className="relative">
//                         <button
//                             onClick={toggleNewChatMenu}
//                             className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-600"
//                         >
//                             <PlusIcon className="h-4 w-4" />
//                             <span className="text-sm">New Chat</span>
//                         </button>
//                         {isNewChatOpen && (
//                             <div className="absolute left-0 mt-1 w-56 bg-gray-800 rounded-lg shadow-lg z-10">
//                                 <ul>
//                                     <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">New Group Chat</li>
//                                     <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">New Chat</li>
//                                     <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">New Private Conversation</li>
//                                 </ul>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className="border-b border-gray-600 opacity-40 mb-3"></div>

//                 <div className="mb-3">
//                     <div className="relative">
//                         <button onClick={toggleRecentChatsMenu} className="flex items-center space-x-1">
//                             <h3 className="text-sm font-small">Recent Chats</h3>
//                             <ChevronDownIcon className="h-3 w-3" />
//                         </button>
//                         {isRecentChatsOpen && (
//                             <div className="absolute right-9 mt-0 w-40 bg-gray-800 rounded-md shadow-lg z-10">
//                                 <ul>
//                                     <li className="px-3 py-1 hover:bg-gray-600 rounded-md cursor-pointer text-sm">Time</li>
//                                     <li className="px-3 py-1 hover:bg-gray-600 rounded-md cursor-pointer text-sm">Unread</li>
//                                     <li className="px-3 py-1 hover:bg-gray-600 rounded-md cursor-pointer text-sm">Hide Favorites</li>
//                                 </ul>
//                             </div>
//                         )}
//                     </div>

//                     <div className="space-y-4">
//                         {addedProfiles.length > 0 ? (
//                             <div className="bg-gray-900 p-4 rounded-md">
//                                 {addedProfiles
//                                     .filter(profile => profile != null)
//                                     .map(profile => (
//                                         <div key={profile._id}
//                                             className="flex items-center justify-between p-2 bg-gray-800 rounded-md mb-2"
//                                             onClick={() => handleProfileClick(profile)}
//                                         >
//                                             <UserProfile
//                                                 firstName={profile.firstName}
//                                                 lastName={profile.lastName}
//                                                 picture={profile.picture}
//                                                 showControls={false}
//                                             />
//                                             <button
//                                                 className="ml-auto px-2 py-1 text-xs rounded-md hover:bg-red-500"
//                                                 onClick={(e) => handleRemoveProfile(profile._id, e)}
//                                             >
//                                                 <FaTrashAlt className="h-4 w-4 text-gray-400 hover:text-red-300" />
//                                             </button>
//                                         </div>
//                                     ))}
//                             </div>
//                         ) : (
//                             <div>No profiles added to the chat list yet.</div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {isOverlayOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
//                     <div ref={overlayRef} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
//                         <h3 className="text-lg mb-2">Add to Chat List</h3>
//                         <div className="mb-2">
//                             <UserProfile
//                                 firstName={userProfile.firstName}
//                                 lastName={userProfile.lastName}
//                                 picture={userProfile.picture}
//                                 showControls={false}
//                             />
//                         </div>
//                         <button
//                             className="bg-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-500"
//                             onClick={handleOverlayClick}
//                         >
//                             Add
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ConversationSection;



import React, { useState, useEffect, useRef } from 'react';
import UserProfile from '@/components/sidebar/UserProfile.jsx';
import { ChevronDownIcon, SearchIcon, PlusIcon } from '@heroicons/react/outline';
import { FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
import { useProfileCodeStore } from '@/Store/CodeStore.js';
import { useSocket } from '@/context/SocketContext.jsx';

function ConversationSection({ user, onChatSelect }) {
    if (!user) {    
        return <div>Loading...</div>;
    }

    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [searchClicked, setSearchClicked] = useState(false);

    const {
        fetchUserProfile,
        fetchAddedProfilesFromList,
        userProfile,
        loading,
        error,
        addProfileToList,
        removeProfileFromList,
        addedProfiles,
        clearError
    } = useProfileCodeStore();

    const overlayRef = useRef(null);
    const { joinRoom, socket } = useSocket();

    const toggleNewChatMenu = () => setIsNewChatOpen(!isNewChatOpen);
    const toggleRecentChatsMenu = () => setIsRecentChatsOpen(!isRecentChatsOpen);

    const handleSearch = async (e) => {
        e.preventDefault();
        const trimmedJoinCode = searchQuery.trim();
        if (trimmedJoinCode) {
            try {
                setSearchClicked(true);
                await fetchUserProfile(trimmedJoinCode);
                setSearchQuery('');
            } catch (err) {
                setErrorMessage(err.message || 'Failed to fetch user profile');
            }
        }
    };

    const handleOverlayClick = async () => {
        if (userProfile) {
            try {
                await addProfileToList(userProfile);
                setIsOverlayOpen(false);
                joinRoom(userProfile._id);
            } catch (err) {
                setErrorMessage(err.message || 'Failed to add profile to chat list');
            }
        } else {
            setErrorMessage('User profile is undefined when trying to add to the list.');
        }
    };

    const handleRemoveProfile = async (profileId, e) => {
        e.stopPropagation();
        try {
            await removeProfileFromList(profileId);
            setIsOverlayOpen(false);
            joinRoom(user._id);
        } catch (err) {
            setErrorMessage(err.message || 'Failed to remove profile from chat list');
        }
    };

    const closeOverlay = (e) => {
        if (overlayRef.current && !overlayRef.current.contains(e.target)) {
            setIsOverlayOpen(false);
        }
    };

    useEffect(() => {
        fetchAddedProfilesFromList();
    }, [fetchAddedProfilesFromList]);

    useEffect(() => {
        if (searchClicked && userProfile && !addedProfiles.some(p => p.joinCode === userProfile.joinCode)) {
            setIsOverlayOpen(true);
            setErrorMessage('');
        } else if (searchClicked && userProfile) {
            setErrorMessage('This user is already added to the chat list.');
            setIsOverlayOpen(false);
        }
        setSearchClicked(false);
    }, [userProfile, addedProfiles, searchClicked]);

    useEffect(() => {
        let timer;
        if (isOverlayOpen) {
            timer = setTimeout(() => {
                setIsOverlayOpen(false);
            }, 10000);
        }
        return () => clearTimeout(timer);
    }, [isOverlayOpen]);

    useEffect(() => {
        if (isOverlayOpen) {
            document.addEventListener('click', closeOverlay);
        } else {
            document.removeEventListener('click', closeOverlay);
        }
        return () => {
            document.removeEventListener('click', closeOverlay);
        };
    }, [isOverlayOpen]);

    useEffect(() => {
        if (error) {
            setErrorMessage(error);
            const timer = setTimeout(() => {
                setErrorMessage('');
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        const handleNewMessage = (message) => {
            console.log('New message received:', message);
        };

        socket.on('newMessage', handleNewMessage);

        return () => {
            socket.off('newMessage', handleNewMessage);
        };
    }, [socket]);

    const handleProfileClick = (profile) => {
        if (profile && profile._id) {
            joinRoom(profile._id);
            onChatSelect(profile);
        }
    };

    return (
        <div className="h-full bg-gray-900 text-white relative">
            <div className="bg-sky-800 p-2">
                <UserProfile firstName={user.firstName} lastName={user.lastName} />
            </div>

            <div className="p-4 bg-gray-900 text-white h-full">
                <div className="mb-2">
                    <div className="relative flex items-center space-x-2">
                        <SearchIcon className="absolute left-3 top-2 h-4 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter join code"
                            className="w-full max-w-xs bg-gray-800 text-sm text-white px-7 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="ml-2 bg-blue-600 px-3 py-1 rounded-md text-sm hover:bg-blue-500"
                        >
                            Search
                        </button>

                        {errorMessage && (
                            <div className="fixed top-2 left-1/2 transform -translate-x-1/2 w-80 bg-gray-800 text-red-300 text-sm p-2 rounded shadow-lg flex items-center space-x-2">
                                <FaInfoCircle className="h-4 w-4 text-gray-500" />
                                <span>{errorMessage}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Chats</h2>
                    <div className="relative">
                        <button
                            onClick={toggleNewChatMenu}
                            className="flex items-center space-x-1 bg-gray-800 px-2 py-1 rounded-md hover:bg-gray-600"
                        >
                            <PlusIcon className="h-4 w-4" />
                            <span className="text-sm">New Chat</span>
                        </button>
                        {isNewChatOpen && (
                            <div className="absolute left-0 mt-1 w-56 bg-gray-800 rounded-lg shadow-lg z-10">
                                <ul>
                                    <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">New Group Chat</li>
                                    <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">New Chat</li>
                                    <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">New Private Conversation</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-b border-gray-600 opacity-40 mb-3"></div>

                <div className="mb-3">
                    <div className="relative">
                        <button onClick={toggleRecentChatsMenu} className="flex items-center space-x-1">
                            <h3 className="text-sm font-small">Recent Chats</h3>
                            <ChevronDownIcon className="h-3 w-3" />
                        </button>
                        {isRecentChatsOpen && (
                            <div className="absolute right-9 mt-0 w-40 bg-gray-800 rounded-md shadow-lg z-10">
                                <ul>
                                    <li className="px-3 py-1 hover:bg-gray-600 rounded-md cursor-pointer text-sm">Time</li>
                                    <li className="px-3 py-1 hover:bg-gray-600 rounded-md cursor-pointer text-sm">Unread</li>
                                    <li className="px-3 py-1 hover:bg-gray-600 rounded-md cursor-pointer text-sm">Hide Favorites</li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {addedProfiles.length > 0 ? (
                            <div className="bg-gray-900 p-4 rounded-md">
                                {addedProfiles
                                    .filter(profile => profile != null)
                                    .map(profile => (
                                        <div key={profile._id}
                                            className="flex items-center justify-between p-2 bg-gray-800 rounded-md mb-2"
                                            onClick={() => handleProfileClick(profile)}
                                        >
                                            <UserProfile
                                                firstName={profile.firstName}
                                                lastName={profile.lastName}
                                                picture={profile.picture}
                                                showControls={false}
                                            />
                                            <button
                                                className="ml-auto px-2 py-1 text-xs rounded-md hover:bg-red-500"
                                                onClick={(e) => handleRemoveProfile(profile._id, e)}
                                            >
                                                <FaTrashAlt className="h-4 w-4 text-gray-400 hover:text-red-300" />
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div>No profiles added to the chat list yet.</div>
                        )}
                    </div>
                </div>
            </div>

            {isOverlayOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                    <div ref={overlayRef} className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                        <h3 className="text-lg mb-2">Add to Chat List</h3>
                        <div className="mb-2">
                            <UserProfile
                                firstName={userProfile.firstName}
                                lastName={userProfile.lastName}
                                picture={userProfile.picture}
                                showControls={false}
                            />
                        </div>
                        <button
                            className="bg-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-500"
                            onClick={handleOverlayClick}
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ConversationSection;