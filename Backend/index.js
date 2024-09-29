import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { connectDB } from "./Database/connectDB.js";
import authRoutes from "./Routes/auth.route.js";
import profileCodeRoutes from "./Routes/profileCode.route.js";
import { getConversations, getMessages, sendMessage } from "./controllers/message.controller.js"; 

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware setup
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}));

app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/code", profileCodeRoutes);

// WebSocket server setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle joining a room
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle sending a message
    socket.on("sendMessage", (data) => {
        sendMessage(socket, io, data);
        console.log('data:',data)
    });

    // Handle getting messages
    socket.on("getMessages", (data) => {
        getMessages(socket, data);
    });

    // Handle getting conversations
    socket.on("getConversations", (userId) => {
        getConversations(socket, userId);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
server.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});

export { io, server, app };
