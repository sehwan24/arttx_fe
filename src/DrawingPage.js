// DrawingPage.js
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from "react-responsive";
import axios from 'axios';
import drawing_ping from './images/drawing_ping.png';
import './DrawingMain.css';

const DrawingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
    const [data, setData] = useState('');

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



    return (
        <div className="main-App">
            {isMobile && (
                <button className="main-menu-toggle" onClick={toggleMenu}>
                    &#9776;
                </button>
            )}

            <div className={`main-sidebar ${isMenuOpen || !isMobile ? 'open' : ''}`}>
                <ul>
                    <li><a href="/house">집 검사하기</a></li>
                    <li><a href="/tree">나무 검사하기</a></li>
                    <li><a href="/person">사람 검사하기</a></li>
                </ul>
            </div>

            <div className="main-main-content">
                <header className="main-App-header">
                    <h1>캐치! 그림핑</h1>
                    {isMobile ? (
                        <div>
                            <p>모바일 화면</p>
                            <h2>HTP 설명 ---------------------------------------------------------</h2>
                        </div>
                    ) : (
                        <div>
                            <h3>H(House), T(Tree), P(Person) 세가지 항목 검사를 통해 내면의 심리상태를 보다 자세히 알아볼 수 있는 검사입니다.</h3>
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
                    <a href="/house" className="home-button">
                        HTP 검사 시작하기
                    </a>
                </header>
            </div>
        </div>
    );
};

export default DrawingPage;
