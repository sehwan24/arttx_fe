import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import "./ChattingPage.css";

const ChattingPage = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false); // 메시지 전송 상태 관리

    useEffect(() => {
        const firstChatting = localStorage.getItem("firstChatting");
        if (firstChatting) {
            setMessages(JSON.parse(firstChatting));
        } else {
            const defaultMessage = [
                { sender: "bot", text: "Hello! How can I assist you today?" }
            ];
            setMessages(defaultMessage);
            localStorage.setItem("firstChatting", JSON.stringify(defaultMessage)); // 기본 메시지 저장
        }
    }, []);

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const newMessages = [...messages, { sender: "user", text: input }];
        setMessages(newMessages);
        setInput("");

        try {
            setIsSending(true); // 전송 중 상태
            // 메시지 서버로 전송
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/chatting/new`, // 서버의 API 엔드포인트
                { message: input },
                { withCredentials: true }
            );

            // 서버의 응답 추가
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: response.data.reply } // 서버에서 reply라는 필드로 응답한다고 가정
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Sorry, there was an error. Please try again later." }
            ]);
        } finally {
            setIsSending(false); // 전송 상태 해제
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Enter 키의 기본 동작(폼 제출) 방지
            handleSendMessage(); // 메시지 전송 함수 호출
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
                        onKeyDown={handleKeyDown} // Enter 키 입력 감지
                        placeholder="Type a message..."
                        disabled={isSending} // 전송 중일 때 입력 비활성화
                    />
                    <button onClick={handleSendMessage} disabled={isSending}>
                        {isSending ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChattingPage;
