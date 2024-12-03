import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import "./ChattingPage.css";

const ChattingPage = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 통합 관리

    useEffect(() => {
        const fetchFirstChatting = async () => {
            setIsLoading(true); // 초기 로딩 시작
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/chatting/first`,
                    {
                        withCredentials: true,
                        headers: {
                            Accept: "application/json",
                        },
                    }
                );
                const firstChatting = response.data.data.firstChatting;
                const formattedMessages = Array.isArray(firstChatting)
                    ? firstChatting
                    : [{ sender: "bot", text: firstChatting }];
                setMessages(formattedMessages);
            } catch (error) {
                console.error("Error fetching first chatting messages:", error);
                setMessages([
                    {
                        sender: "bot",
                        text: "죄송합니다. 채팅을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                    },
                ]);
            } finally {
                setIsLoading(false); // 초기 로딩 종료
            }
        };

        fetchFirstChatting();
    }, []);

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage = { sender: "user", text: input.trim() };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput("");

        setIsLoading(true); // 전송 중 로딩 시작
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/chatting/new`,
                { message: userMessage.text },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            const botReply = response.data.reply || "죄송합니다. 이해하지 못했습니다.";
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botReply }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요." },
            ]);
        } finally {
            setIsLoading(false); // 전송 중 로딩 종료
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
                <h2>고객 지원</h2>
                <ul>
                    <li>도움말 센터</li>
                    <li>FAQ</li>
                    <li>문의하기</li>
                </ul>
            </div>

            <div className="chat-main">
                <div className="chat-header">
                    <h1>{isMobile ? "모바일 채팅" : "대화해요."}</h1>
                </div>

                {isLoading ? (
                    <div className="chat-loading">
                        <p>로딩 중...</p>
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
                        placeholder="메시지를 입력하세요..."
                        disabled={isLoading} // 로딩 중에는 입력 필드 비활성화
                    />
                    <button onClick={handleSendMessage} disabled={isLoading}>
                        {isLoading ? "로딩 중..." : "전송"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChattingPage;
