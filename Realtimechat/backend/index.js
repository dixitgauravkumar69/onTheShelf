const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/chatDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Define Message Schema
const messageSchema = new mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

// Socket.io logic
io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send previous messages when a user joins
    const messages = await Message.find().sort({ createdAt: 1 });
    socket.emit("load_messages", messages);

    // Handle new messages
    socket.on("send_message", async (data) => {
        const newMessage = new Message({ text: data });
        await newMessage.save();

        io.emit("receive_message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(5000, () => console.log("Server running on port 5000"));
