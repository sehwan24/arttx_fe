import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import drawing_ping from './images/drawing_ping.png';

function App() {
    const [data, setData] = useState('');
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [penColor, setPenColor] = useState('#000000'); // 펜 색상 상태 추가
    const [isEraser, setIsEraser] = useState(false); // 지우개 활성화 상태
    const [lineWidth, setLineWidth] = useState(5); // 펜 굵기 상태

    useEffect(() => {
        // 백엔드로 GET 요청 보내기
        axios.get(`${process.env.REACT_APP_API_URL}/api/test/1`, {
            withCredentials: true
        })
            .then(response => {
                setData(response.data); // 응답 데이터를 상태에 저장
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // 캔버스 크기 조정 함수
        const resizeCanvas = () => {
            // 현재 그려진 내용을 저장
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // 캔버스 크기를 CSS 크기와 동기화
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = width;
            canvas.height = height;

            // 저장된 내용을 다시 그리기
            ctx.putImageData(imageData, 0, 0);
        };

        resizeCanvas(); // 초기 크기 설정
        window.addEventListener('resize', resizeCanvas); // 윈도우 크기 변경 시 캔버스 크기 조정

        ctx.lineWidth = lineWidth;

        // 지우개 모드인지 확인하고 색상 설정
        if (isEraser) {
            ctx.strokeStyle = 'white'; // 지우개는 배경색(흰색)으로 설정
        } else {
            ctx.strokeStyle = penColor; // 펜 색상 설정
        }

        const startDrawing = (e) => {
            const rect = canvas.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY); // 시작점 설정
        };

        const draw = (e) => {
            if (!isDrawing) return;
            const rect = canvas.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;
            ctx.lineTo(offsetX, offsetY); // 마우스 움직임에 따라 선 그리기
            ctx.stroke();
        };

        const stopDrawing = () => {
            setIsDrawing(false);
            ctx.closePath();
        };

        // 마우스 이벤트
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseleave', stopDrawing);

        // 터치 이벤트에서 좌표 추출 함수
        const getTouchPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        };

        const startDrawingTouch = (e) => {
            const touchPos = getTouchPos(e);
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(touchPos.x, touchPos.y);
        };

        const drawTouch = (e) => {
            if (!isDrawing) return;
            const touchPos = getTouchPos(e);
            ctx.lineTo(touchPos.x, touchPos.y);
            ctx.stroke();
        };

        // 터치 이벤트
        canvas.addEventListener('touchstart', startDrawingTouch);
        canvas.addEventListener('touchmove', drawTouch);
        canvas.addEventListener('touchend', stopDrawing);
        canvas.addEventListener('touchcancel', stopDrawing);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('resize', resizeCanvas); // 리스너 제거
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawingTouch);
            canvas.removeEventListener('touchmove', drawTouch);
            canvas.removeEventListener('touchend', stopDrawing);
            canvas.removeEventListener('touchcancel', stopDrawing);
        };
    }, [isDrawing, penColor, isEraser, lineWidth]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>캐치! 그림핑</h1>
                <input
                    type="color"
                    value={penColor}
                    onChange={(e) => setPenColor(e.target.value)} // 색상 변경
                    disabled={isEraser} // 지우개 모드에서는 색상 변경 비활성화
                />
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(e.target.value)} // 펜 굵기 변경
                />
                <button onClick={() => setIsEraser(false)}>Pen</button> {/* 펜 모드 */}
                <button onClick={() => setIsEraser(true)}>Eraser</button> {/* 지우개 모드 */}
                <canvas
                    ref={canvasRef}
                    id="drawingCanvas"
                    style={{
                        border: '1px solid #000000',
                        backgroundColor: 'white',
                        width: '100%', // 화면 가로에 맞추기
                        height: '600px', // 고정된 높이
                    }}>
                </canvas>
                <img
                    src={drawing_ping} alt="drawing_ping"
                    id="drawingPing"
                    style={{
                        width: '300px', // 화면 가로에 맞추기
                        height: '300px', // 고정된 높이
                    }}
                />
                <p>{data ? `서버 응답: ${data}` : '데이터 로딩 중...'}</p>
            </header>
        </div>
    );
}

export default App;
