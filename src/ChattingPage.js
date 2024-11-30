import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import "./ChattingPage.css";

const ChattingPage = () => {
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false); // 메시지 전송 상태 관리
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리

    useEffect(() => {
        const fetchFirstChatting = async () => {
            try {
                // 로딩 시작
                setIsLoading(true);

                // 서버로부터 firstChatting 데이터를 GET 요청으로 가져옴
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/chatting/first`,
                    { withCredentials: true }
                );

                console.log(response)

                // 응답 데이터를 상태에 저장
                setMessages(response.data.messages || [
                    { sender: "bot", text: "Hello! How can I assist you today?" }
                ]);

                // 로컬 스토리지 업데이트 (선택사항)
                localStorage.setItem(
                    "firstChatting",
                    JSON.stringify(response.data.messages)
                );
            } catch (error) {
                console.error("Error fetching first chatting messages:", error);

                // 에러 발생 시 기본 메시지로 설정
                setMessages([
                    { sender: "bot", text: "Sorry, we couldn't load the chat. Please try again later." }
                ]);
            } finally {
                // 로딩 종료
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

                {isLoading ? ( // 로딩 상태 표시
                    <div className="chat-loading">
                        <p>Loading chat...</p>
                        <div className="spinner"></div> {/* CSS로 스피너 구현 */}
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
                        onKeyDown={handleKeyDown} // Enter 키 입력 감지
                        placeholder="Type a message..."
                        disabled={isSending || isLoading} // 전송 중이나 로딩 중일 때 입력 비활성화
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
