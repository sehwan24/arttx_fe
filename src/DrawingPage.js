// DrawingPage.js
import React, { useRef, useEffect, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import axios from 'axios';
import drawing_ping from './images/drawing_ping.png';

const DrawingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [data, setData] = useState('');
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [penColor, setPenColor] = useState('#000000');
    const [isEraser, setIsEraser] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);

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

        if (isMobile) {
            canvas.addEventListener('touchstart', startDrawing);
            canvas.addEventListener('touchmove', draw);
            canvas.addEventListener('touchend', stopDrawing);
        } else {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (isMobile) {
                canvas.removeEventListener('touchstart', startDrawing);
                canvas.removeEventListener('touchmove', draw);
                canvas.removeEventListener('touchend', stopDrawing);
            } else {
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', draw);
                canvas.removeEventListener('mouseup', stopDrawing);
            }
        };
    }, [isDrawing, penColor, isMobile, isEraser, lineWidth]);

    return (
        <div className="App">
            {isMobile && (
                <button className="menu-toggle" onClick={toggleMenu}>
                    &#9776;
                </button>
            )}

            <div className={`sidebar ${isMenuOpen || !isMobile ? 'open' : ''}`}>
                <ul>
                    <li><a href="/menu1">Menu Item 1</a></li>
                    <li><a href="/menu2">Menu Item 2</a></li>
                    <li><a href="/menu3">Menu Item 3</a></li>
                    <li><a href="/menu4">Menu Item 4</a></li>
                </ul>
            </div>

            <div className="main-content">
                <header className="App-header">
                    <h1>캐치! 그림핑</h1>
                    {isMobile ? (
                        <div>
                            <p>모바일 화면</p>
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
                            <button onClick={() => setIsEraser(false)}>Pen</button>
                            <button onClick={() => setIsEraser(true)}>Eraser</button>
                            <button onClick={() => {
                                const canvas = canvasRef.current;
                                const ctx = canvas.getContext('2d');
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            }}>Clear Canvas</button>
                            <canvas
                                ref={canvasRef}
                                id="drawingCanvas"
                                style={{
                                    border: '1px solid #000000',
                                    backgroundColor: 'white',
                                    width: '100%',
                                    height: '400px',
                                }}>
                            </canvas>
                        </div>
                    ) : (
                        <div>
                            <p>PC 화면</p>
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
                            <button onClick={() => setIsEraser(false)}>Pen</button>
                            <button onClick={() => setIsEraser(true)}>Eraser</button>
                            <button onClick={() => {
                                const canvas = canvasRef.current;
                                const ctx = canvas.getContext('2d');
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                            }}>Clear Canvas</button>
                            <canvas
                                ref={canvasRef}
                                id="drawingCanvas"
                                style={{
                                    border: '1px solid #000000',
                                    backgroundColor: 'white',
                                    width: '100%',
                                    height: '600px',
                                }}>
                            </canvas>
                        </div>
                    )}
                    <img
                        src={drawing_ping} alt="drawing_ping"
                        id="drawingPing"
                        style={{
                            width: '300px',
                            height: '300px',
                        }}
                    />
                    <p>{data ? `서버 응답: ${data}` : '데이터 로딩 중...'}</p>
                </header>
            </div>
        </div>
    );
};

export default DrawingPage;
