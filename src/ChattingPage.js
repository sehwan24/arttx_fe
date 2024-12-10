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
    const [firstImage, setFirstImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);

    useEffect(() => {
        // 첫 번째 이미지를 로컬 스토리지에서 가져오기
        const savedImage1 = localStorage.getItem("savedDrawing1");
        if (savedImage1) {
            setFirstImage(savedImage1);
        }
        const savedImage2 = localStorage.getItem("savedDrawing2");
        if (savedImage2) {
            setSecondImage(savedImage2);
        }
        const savedImage3 = localStorage.getItem("savedDrawing3");
        if (savedImage3) {
            setThirdImage(savedImage3);
        }
    }, []);

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
    }, [messages]);

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
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botReply }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요." },
            ]);
        } finally {
            setIsLoading(false); // 전송 중 로딩 종료
            inputRef.current?.focus(); // 입력 필드에 포커스 설정
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const goNextPage = async () => {
        setIsLoading(true); // 전송 중 로딩 시작
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/chatting/exit`,
                { message: "exit" },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            const botReply = response.data.data.message || "죄송합니다. 이해하지 못했습니다.";
            setMessages((prevMessages) => [...prevMessages, { sender: "bot", text: botReply }]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: "bot", text: "죄송합니다. 메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요." },
            ]);
        } finally {
            setIsLoading(false); // 전송 중 로딩 종료
            inputRef.current?.focus(); // 입력 필드에 포커스 설정
        }
        window.location.href = "/result";
    };

    return (
        <div className="chatting-container">
            <div className="chat-sidebar">
                {/* 로컬 스토리지 이미지 및 기본 이미지 렌더링 */}
                {firstImage ? (
                    <div className="sidebar-image-container">
                        <img src={firstImage} alt="First saved drawing" className="sidebar-image" />
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                {secondImage ? (
                    <div className="sidebar-image-container">
                        <img src={secondImage} alt="Second saved drawing" className="sidebar-image" />
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
                {thirdImage ? (
                    <div className="sidebar-image-container">
                        <img src={thirdImage} alt="Third saved drawing" className="sidebar-image" />
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>

            <div className="chat-main">
                <div className="chat-header">
                    <h1>{isMobile ? "모바일 채팅" : "대화해요."}</h1>
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
                    {isLoading && (
                        <div className="chat-loading">
                            <p>로딩 중...</p>
                            <div className="spinner"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                    <input
                        ref={inputRef} // 입력 필드에 포커스 유지
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="메시지를 입력하세요..."
                    />
                    <button
                        onClick={() => handleSendMessage()} // 이벤트 객체 없이 호출
                        disabled={isLoading || input.trim() === ""}
                    >
                        {isLoading ? "로딩 중..." : "전송"}
                    </button>
                    <button onClick={(e) => goNextPage()}>
                        결과보기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChattingPage;
