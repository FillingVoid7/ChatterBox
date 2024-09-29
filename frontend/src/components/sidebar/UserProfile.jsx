import React, { useState, useEffect } from 'react';
import { BellIcon, MenuAlt4Icon } from '@heroicons/react/outline';
import { useProfileCodeStore } from '@/Store/CodeStore.js';

function UserProfile({ firstName, lastName, showControls = true }) { // Added `showControls` prop
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isShareProfileOpen, setIsShareProfileOpen] = useState(false);
    const { generateJoinCode, joinCode, loading, error } = useProfileCodeStore();

    const initials = `${firstName ? firstName[0].toUpperCase() : ''}${lastName ? lastName[0].toUpperCase() : ''}`;
    const fullName = `${firstName ? firstName : ''} ${lastName ? lastName : ''}`;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    const handleShareProfile = async () => {
        await generateJoinCode();
        setTimeout(() => {
            console.log("Join code generated:", joinCode);
            setIsShareProfileOpen(true);
        }, 100);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (event.target.closest('.share-profile-modal') === null && isShareProfileOpen) {
                setIsShareProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isShareProfileOpen]);

    return (
        <div className="bg-black-400 text-white p-3 flex items-center justify-between rounded-lg">
            <div className="flex items-center space-x-2">
                <div className="bg-blue-500 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center text-sm">
                    {initials}
                </div>
                <span className="text-lg font-semibold text-blue-200">{fullName}</span>
            </div>
            {showControls && ( // Conditionally render the controls
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <BellIcon 
                            className="h-5 w-5 text-blue-200 cursor-pointer"
                            onClick={toggleNotifications}
                        />
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg z-10">
                                <ul>
                                    <li className="px-3 py-1 hover:bg-gray-700 text-white">Notification 1</li>
                                    <li className="px-3 py-1 hover:bg-gray-700 text-white">Notification 2</li>
                                    <li className="px-3 py-1 hover:bg-gray-700 text-white">Notification 3</li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <MenuAlt4Icon
                            className="h-5 w-5 text-blue-200 cursor-pointer"
                            onClick={toggleMenu}
                        />
                        {isMenuOpen && (
                            <div className="absolute left-0 mt-1 w-40 bg-gray-800 rounded-lg shadow-lg z-10">
                                <ul>
                                    <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">Settings</li>
                                    <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">Switch Appearance</li>
                                    <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm" onClick={handleShareProfile}>Share Profile</li>
                                    <li className="px-3 py-1 hover:bg-gray-700 rounded-md cursor-pointer text-sm">Sign Out</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isShareProfileOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="share-profile-modal bg-gray-800 p-4 rounded-lg">
                        <h2 className="text-sm font-semibold">Share Your Profile</h2>
                        {loading ? (
                            <p className="text-sm">Loading...</p>
                        ) : error ? (
                            <p className="text-sm text-red-500">Error: {error}</p>
                        ) : (
                            <p className="text-sm mt-1 text-blue-600">Your join code is: <strong>{joinCode}</strong></p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
