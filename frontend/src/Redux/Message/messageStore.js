import { configureStore } from "@reduxjs/toolkit";
import messageReducer from "./messageSlice.js";

const store = configureStore({
    reducer: {
        message: messageReducer,
    },
});

export default store;