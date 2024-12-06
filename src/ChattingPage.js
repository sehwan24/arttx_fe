import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import "./ChattingPage.css";

const ChattingPage = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 통합 관리
    const inputRef = useRef(null); // 입력 필드 참조
    const messagesEndRef = useRef(null); // 채팅 메시지 컨테이너 끝 참조

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


    useEffect(() => {
        // 새로운 메시지가 추가될 때 스크롤을 가장 아래로 이동
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])

    const handleSendMessage = async (e = null) => {
        if (e) e.preventDefault(); // 이벤트 객체가 있으면 기본 동작 방지
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
            const botReply = response.data.data.message || "죄송합니다. 이해하지 못했습니다.";
            const formattedMessages = Array.isArray(botReply)
                ? botReply
                : [{ sender: "bot", text: botReply }];
            setMessages(formattedMessages);
            //setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botReply }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요." },
            ]);
        } finally {
            setIsLoading(false); // 전송 중 로딩 종료
            if (inputRef.current) {
                inputRef.current.focus(); // 입력 필드에 포커스 설정
            } else {
                console.error("Input ref is not available.");
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage(e);
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
                        <div ref={messagesEndRef} />
                    </div>
                )}

                <div className="chat-input">
                    <input
                        ref={inputRef} // 입력 필드에 포커스 유지
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="메시지를 입력하세요..."
                        //disabled={isLoading} // 로딩 중에는 입력 필드 비활성화
                    />
                    <button
                        onClick={() => handleSendMessage()} // 이벤트 객체 없이 호출
                        disabled={isLoading || input.trim() === ""}
                    >
                        {isLoading ? "로딩 중..." : "전송"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChattingPage;
