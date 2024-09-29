import React, { useEffect, useState } from 'react';
import { useProfileCodeStore } from '@/Store/CodeStore.js';

const WelcomeSection = ({ user }) => {
  const [isShareProfileOpen, setIsShareProfileOpen] = useState(false);
  const { generateJoinCode, joinCode } = useProfileCodeStore();

  if (!user) {
    return <div>Loading...</div>; 
  }

  const handleShareProfile = async () => {
    await generateJoinCode();
    console.log("Join code generated:", joinCode); // Log join code to console
    setIsShareProfileOpen(true);
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
    <div className="flex-1 h-full bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-20">
          <span className="font-normal text-gray-300">Welcome to </span>
          <span className="text-white">ChatterBox!</span>
        </h1>

        <div className="flex items-center justify-between mb-20">
          <div className="flex items-center space-x-4">
            <div className="w-36 h-36 rounded-full bg-gray-300 text-blue-500 flex items-center justify-center text-5xl font-bold">
              {user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}
            </div>
            <div className="text-4xl text-gray-400 font-semibold">
              {user.firstName} {user.lastName}
            </div>
          </div>
          <button className="border border-black text-white py-1 px-2 rounded-full text-sm flex items-center space-x-1" onClick={handleShareProfile}>
            <span>Share Profile</span>
          </button>
        </div>

        <p className="text-sm mb-8 text-center">
          You are signed in as <span className="font-semibold italic">{user.email}</span>
        </p>

        <p className="text-sm text-gray-400 text-center">
          &copy; 2024 ChatterBox. All rights reserved.
        </p>
      </div>

      {isShareProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="share-profile-modal bg-gray-800 p-4 rounded-lg">
            <h2 className="text-sm font-semibold">Share Your Profile</h2>
            <p className=" text-blue-600 first-line:text-sm mt-1">Your join code is: <strong>{joinCode}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
