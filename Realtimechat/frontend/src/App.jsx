import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    useEffect(() => {
        // Load previous messages
        socket.on("load_messages", (messages) => {
            setChat(messages);
        });

        // Receive new messages
        socket.on("receive_message", (data) => {
            setChat((prevChat) => [...prevChat, data]);
        });

        return () => {
            socket.off("receive_message");
            socket.off("load_messages");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("send_message", message);
            setMessage("");
        }
    };

    return (
        <div>
            <h2>Socket.io Chat with MongoDB</h2>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
            <div>
                {chat.map((msg, index) => (
                    <p key={index}>{msg.text}</p>
                ))}
            </div>
        </div>
    );
}

export default App;
