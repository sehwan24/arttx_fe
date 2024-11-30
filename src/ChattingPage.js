import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import "./ChattingPage.css";

const ChattingPage = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFirstChatting = async () => {
            try {
                // 서버로부터 firstChatting 데이터를 GET 요청으로 가져옴
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/chatting/first`,
                    {
                        withCredentials: true,
                        headers: {
                            "Accept": "application/json", // JSON 형식 요청 명시
                        },
                    }
                );
                console.log("Server response:", response);

                const firstChatting = response.data.data.firstChatting;

                // 문자열을 배열로 변환
                const formattedMessages = Array.isArray(firstChatting)
                    ? firstChatting
                    : [{ sender: "bot", text: firstChatting }];

                setMessages(formattedMessages);

            } catch (error) {
                console.error("Error fetching first chatting messages:", error);
                setMessages([
                    { sender: "bot", text: "Sorry, we couldn't load the chat. Please try again later." }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFirstChatting();
    }, []);

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        try {
            setIsSending(true);
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/chatting/new`,
                { message: input },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true,
                }
            );

            const botReply = response.data.reply || "Sorry, I couldn't understand that.";
            const updatedMessages = [...newMessages, { sender: "bot", text: botReply }];
            setMessages(updatedMessages);

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessages = [
                ...newMessages,
                { sender: "bot", text: "Sorry, there was an error. Please try again later." }
            ];
            setMessages(errorMessages);


        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
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

                {isLoading ? (
                    <div className="chat-loading">
                        <p>Loading chat...</p>
                        <div className="spinner"></div>
                    </div>
                ) : (
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
                )}

                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={isSending || isLoading}
                    />
                    <button onClick={handleSendMessage} disabled={isSending || isLoading}>
                        {isSending ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChattingPage;
