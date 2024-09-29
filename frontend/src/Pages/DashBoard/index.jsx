import React, { useState } from 'react';
import ConversationSection from '@/components/sidebar/ConversationSection.jsx'; 
import WelcomeSection from '@/components/WelcomeProfile/WelcomeSection.jsx'; 
import { useAuthStore } from '@/Store/AuthStore.js';
import MessageUI from '@/components/MainPart/Message.jsx'; 

const MainDashboard = () => {
  const { user, isLoading, error } = useAuthStore();
  const [activeChat, setActiveChat] = useState('');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleChatSelect = (selectedUser) => {
    setActiveChat(selectedUser); // Set the selected user profile as the active chat
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 h-full flex-shrink-0">
        <ConversationSection user={user} onChatSelect={handleChatSelect} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-900 text-white flex flex-col">
        {activeChat ? (
          <MessageUI user={activeChat} loggedInUserId = {user._id}/> // Display the MessageUI with the selected user
        ) : (
          <WelcomeSection user={user} />
        )}
      </div>
    </div>
  );
};

export default MainDashboard;
