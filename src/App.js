import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import drawing_ping from './images/drawing_ping.png';

function App() {
    const [data, setData] = useState('');

    useEffect(() => {
        // 백엔드로 GET 요청 보내기
        axios.get(`${process.env.REACT_APP_API_URL}/api/test/1`, {
            withCredentials: true
        }) // 백엔드의 실제 API URL로 변경
            .then(response => {
                setData(response.data); // 응답 데이터를 상태에 저장
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div className="App">
          <header className="App-header">
            <h1>캐치! 그림핑 ㅋㅋㅋㅋㅋㅋㅋ</h1>
            <img src={drawing_ping} alt="drawing_ping" />
            <p>{data ? `서버 응답: ${data}` : '데이터 로딩 중...'}</p>
          </header>
        </div>
    );
}

export default App;
