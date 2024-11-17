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
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#" role="button">Contact</a></li>
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
                            <h2>Stay Updated!</h2>
                            <h3>Subscribe to our newsletter for the latest updates.</h3>
                        </hgroup>
                        <form className="grid">
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                placeholder="First Name"
                                aria-label="First Name"
                                required
                            />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                aria-label="Email Address"
                                required
                            />
                            <button type="submit" onClick={(e) => e.preventDefault()}>
                                Subscribe
                            </button>
                        </form>
                    </article>
                </div>
            </section>

            <footer className="container">
                <small><a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a></small>
            </footer>
        </div>
    );
};

export default HomePage;
