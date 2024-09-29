import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/code';
const API_CONV_URL = 'http://localhost:3000/api/message';

axios.defaults.withCredentials = true;

export const useProfileCodeStore = create((set) => ({
    joinCode: null,
    loading: false,
    error: null,
    userProfile: null,
    addedProfiles: JSON.parse(localStorage.getItem('addedProfiles')) || [],
    conversations: [],
    loadingConversations: false,
    errorConversations: null,

    generateJoinCode: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/generateCode`);
            console.log('Backend response:', response.data);
            set({
                joinCode: response.data.joinCode,
                loading: false,
            });
        } catch (error) {
            console.error('Error generating join code:', error);
            set({
                error: error.response?.data?.message || 'Failed to generate code',
                loading: false,
            });
        }
    },

    fetchUserProfile: async (joinCode) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/fetchUserProfile`, {
                params: { joinCode: joinCode.trim() }
            });
            console.log('Fetched user profile:', response.data.user);
            set({
                userProfile: response.data.user,
                loading: false,
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
            set({
                error: error.response?.data?.message || 'Failed to fetch user profile',
                loading: false,
            });
        }
    },

    addProfileToList: async (profile) => {
        set({ loading: true, error: null });
        try {
            console.log('Attempting to add profile with ID:', profile._id);
            const response = await axios.post(`${API_URL}/addProfileToChat`, { profileId: profile._id });
            console.log('Profile added to chat list:', response.data);
    
            set((state) => {
                const updatedProfiles = [...state.addedProfiles, response.data.profile];
                localStorage.setItem('addedProfiles', JSON.stringify(updatedProfiles)); // Optional persistence
                return {
                    addedProfiles: updatedProfiles,
                    loading: false,
                };
            });
    
        } catch (error) {
            console.error('Error adding profile to chat list:', error);
            set({
                error: error.response?.data?.message || 'Failed to add profile to chat list',
                loading: false,
            });
        }
    },

    
    fetchAddedProfilesFromList: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/fetchAddedProfilesFromList`);
            console.log('Fetched added profiles from chat list:', response.data.chatList);
            set({
                addedProfiles: response.data.chatList,
                loading: false,
            });
        } catch (error) {
            console.error('Error fetching added profiles from chat list:', error);
            set({
                error: error.response?.data?.message || 'Failed to fetch added profiles',
                loading: false,
            });
        }
    },

    getConversations: async () => {
        set({ loadingConversations: true, errorConversations: null });
        try {
            const response = await axios.get(`${API_CONV_URL}/conversations`);
            console.log('Backend Response:', response.data);
            set({
                conversations: response.data.conversations || [],
                loadingConversations: false,
            });
        } catch (error) {
            console.error('Error fetching conversations:', error);
            set({ 
                conversations: [], 
                loadingConversations: false,
                errorConversations: error.response?.data?.message || 'Failed to fetch conversations',
            });
        }
    },

    removeProfileFromList: async (profileId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/removeProfile`, { profileId });
            console.log('Profile removed from chat list:', response.data.message);
    
            set((state) => {
                const updatedProfiles = state.addedProfiles.filter(profile => profile._id !== profileId);
                localStorage.setItem('addedProfiles', JSON.stringify(updatedProfiles)); 
                return {
                    addedProfiles: updatedProfiles,
                    loading: false,
                };
            });
    
        } catch (error) {
            console.error('Error removing profile from chat list:', error);
            set({
                error: error.response?.data?.message || 'Failed to remove profile from chat list',
                loading: false,
            });
        }
    },

    clearJoinCode: () => set({ joinCode: null, error: null }),

    clearConversations: () => set({ conversations: [] }),

    clearError: () => set({ error: null }),
}));
