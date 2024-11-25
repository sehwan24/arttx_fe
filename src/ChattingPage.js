import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import "./ChattingPage.css";

const ChattingPage = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hello! How can I assist you today?" }
    ]);
    const [input, setInput] = useState("");

    const handleSendMessage = () => {
        if (input.trim() === "") return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        // Simulate bot response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: `You said: "${input}". How can I help?` }
            ]);
        }, 1000);
    };

    return (
        <div className="chatting-container">
            <div className="chat-sidebar">
                <h2>Chat Support</h2>
                <ul>
                    <li>Help Center</li>
                    <li>FAQs</li>
                    <li>Contact Us</li>
                </ul>
            </div>

            <div className="chat-main">
                <div className="chat-header">
                    <h1>{isMobile ? "Mobile Chat" : "대화해요."}</h1>
                </div>

                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${msg.sender === "user" ? "user" : "bot"}`}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChattingPage;
