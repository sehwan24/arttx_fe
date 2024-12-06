import React, {useEffect, useState} from 'react';
import './HomePage.css';
import axios from "axios";




const HomePage = () => {

    const [data, setData] = useState('');

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
        <div>
            <nav className="container-fluid">
                <ul>
                    <li><strong>캐치! 그림핑</strong></li>
                </ul>
                <ul>
                    <li><a href="#">홈</a></li>
                    <li><a href="#">소개</a></li>
                    <li><a href="#">서비스</a></li>
                    <li><a href="#" role="button">문의하기</a></li>
                </ul>
            </nav>

            <main className="container">
                <div className="center-content">
                    <h2>HTP 검사</h2>
                    <a href="/draw" className="start-button">
                        HTP 검사 시작하기
                    </a>
                    <p>{data ? `서버 응답: ${data}` : '데이터 로딩 중...'}</p>
                </div>
            </main>

            <section aria-label="Subscribe example">
                <div className="container">
                    <article>
                        <hgroup>
                            <h2>최신 소식을 받아보세요!</h2>
                            <h3>뉴스레터를 구독하고 최신 정보를 받아보세요.</h3>
                        </hgroup>
                        <form className="grid">
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                placeholder="이름"
                                aria-label="First Name"
                                required
                            />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="이메일"
                                aria-label="Email Address"
                                required
                            />
                            <button type="submit" onClick={(e) => e.preventDefault()}>
                                구독하기
                            </button>
                        </form>
                    </article>
                </div>
            </section>

            <footer className="container">
                <small><a href="#">개인정보 처리방침</a> • <a href="#">이용 약관</a></small>
            </footer>
        </div>
    );
};

export default HomePage;
