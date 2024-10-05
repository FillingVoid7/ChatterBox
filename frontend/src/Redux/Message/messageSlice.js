import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    conversations: [],
    typing: false,
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setConversation: (state, action) => {
            state.conversations = action.payload;
        },
        setTyping: (state, action) => {
            state.typing = action.payload;
        }
    }
});

export const {addMessage, setMessages, setConversation ,setTyping} = messageSlice.actions;
export default messageSlice.reducer;