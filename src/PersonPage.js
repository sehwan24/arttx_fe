// DrawingPage.js
import React, { useRef, useEffect, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import axios from 'axios';
import drawing_ping from './images/drawing_ping.png';
import './DrawingPage.css';

const PersonPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [data, setData] = useState('');
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [penColor, setPenColor] = useState('#000000');
    const [isEraser, setIsEraser] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/test/1`, {
            withCredentials: true
        })
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;
            ctx.putImageData(imageData, 0, 0);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = isEraser ? 'white' : penColor;

        const startDrawing = (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);
        };

        const draw = (e) => {
            e.preventDefault();
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        };

        const stopDrawing = (e) => {
            e.preventDefault();
            setIsDrawing(false);
            ctx.closePath();
        };

        // 터치 이벤트에서 좌표 추출 함수
        const getTouchPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        };

        const startDrawingTouch = (e) => {
            e.preventDefault();
            const touchPos = getTouchPos(e);
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(touchPos.x, touchPos.y);
        };

        const drawTouch = (e) => {
            e.preventDefault()
            if (!isDrawing) return;
            const touchPos = getTouchPos(e);
            ctx.lineTo(touchPos.x, touchPos.y);
            ctx.stroke();
        };


        if (isMobile) {
            canvas.addEventListener('touchstart', startDrawingTouch);
            canvas.addEventListener('touchmove', drawTouch);
            canvas.addEventListener('touchend', stopDrawing);
            canvas.addEventListener('touchcancel', stopDrawing);
        } else {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseleave', stopDrawing);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (isMobile) {
                canvas.removeEventListener('touchstart', startDrawingTouch);
                canvas.removeEventListener('touchmove', drawTouch);
                canvas.removeEventListener('touchend', stopDrawing);
                canvas.removeEventListener('touchcancel', stopDrawing);
            } else {
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', stopDrawing);
                canvas.removeEventListener('mouseleave', stopDrawing);
            }
        };
    }, [isDrawing, penColor, isMobile, isEraser, lineWidth]);

    const handleImageUpload = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing image
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = URL.createObjectURL(file);
        }
    };

    const saveCanvasToLocalStorage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // 캔버스를 Base64 데이터 URL로 변환
        const imageData = canvas.toDataURL('image/png'); // PNG 형식으로 저장

        // 로컬 스토리지에 저장
        try {
            localStorage.setItem('savedDrawing3', imageData);
            console.log('Canvas image saved to localStorage.');
        } catch (error) {
            console.error('Failed to save image to localStorage:', error);
        }
    };

    // 캔버스를 이미지 파일로 저장하는 함수
    const saveCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsLoading(true);

        // 임시 캔버스를 생성하고, 그 위에 현재 캔버스를 복사
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // 흰색 배경을 채우고 그 위에 기존 캔버스를 덧씌움
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(canvas, 0, 0);

        // 캔버스를 Blob 형식으로 변환
        tempCanvas.toBlob((blob) => {
            if (!blob) {
                console.error('Failed to convert canvas to blob.');
                setIsLoading(false); // 로딩 상태 비활성화
                return;
            }

            // FormData에 이미지 추가
            const formData = new FormData();
            formData.append('image', blob, 'canvas-drawing.jpg');

            // 서버로 업로드 요청 보내기
            axios.post(`${process.env.REACT_APP_API_URL}/api/image/person`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true, // 필요 시 추가
            })
                .then((response) => {
                    console.log('Image uploaded successfully:', response.data);
                    // 응답 데이터를 로컬 스토리지에 저장
                    localStorage.setItem('personResponse', JSON.stringify(response.data));
                    localStorage.setItem('firstChatting', response.data.firstChatting);
                    saveCanvasToLocalStorage();
                    // 페이지 이동
                    window.location.href = "/chatting";
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    alert('이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
                })
                .finally(() => {
                    // 로딩 상태 비활성화
                    setIsLoading(false);
                });
        }, 'image/jpeg'); // 이미지 형식 설정
    };

    /*const submit = () => {
        //submit to S3
        //todo : 서버 응답 전까지 페이지 로딩 . ..
        window.location.href = "/chatting";
    };*/

    return (
        <div className="App">
            {isMobile && (
                <button className="menu-toggle" onClick={toggleMenu}>
                    &#9776;
                </button>
            )}
            <div className={`sidebar ${isMenuOpen || !isMobile ? 'open' : ''}`}>
                <ul>
                    <li><a href="/house">집 검사하기</a></li>
                    <li><a href="/tree">나무 검사하기</a></li>
                    <li><a href="/person">사람 검사하기</a></li>
                </ul>
            </div>
            <div className="main-content">
                <header className="App-header">
                    <h1>사람을 그려주세요.</h1>

                    {/* 도구 컨테이너 */}
                    <div className="tool-container">
                        <input
                            type="color"
                            value={penColor}
                            onChange={(e) => setPenColor(e.target.value)}
                            disabled={isEraser}
                        />
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(e.target.value)}
                        />
                        <button onClick={() => setIsEraser(false)}>펜</button>
                        <button onClick={() => setIsEraser(true)}>지우개</button>
                        <button onClick={() => {
                            const canvas = canvasRef.current;
                            const ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                        }}>전체 지우기</button>
                        <label className="file-input">
                            파일 선택
                            <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>

                    {/* 캔버스 */}
                    <canvas ref={canvasRef} id="drawingCanvas"></canvas>

                    {/* 버튼 컨테이너 */}
                    <div className="button-container">
                        <button onClick={saveCanvas}>제출하기</button>
                        {/*<button onClick={submit}>제출하기</button>*/}
                    </div>
                </header>
            </div>

            {/* 로딩 상태 */}
            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>결과를 분석 중입니다. 잠시만 기다려주세요...</p>
                </div>
            )}
        </div>
    );
};

export default PersonPage;
