import React from 'react';
import './ResultPage.css';

const ResultPage = () => {
    return (
        <div>
            <nav className="container-fluid">
                <ul>
                    <li><strong>캐치! 그림핑</strong></li>
                </ul>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#" role="button">Contact</a></li>
                </ul>
            </nav>

            <main className="container">
                <div className="center-content">
                    <h2>HTP 검사 결과</h2>
                    <p>아래는 당신의 HTP 검사 결과입니다. 검사 항목과 분석 결과를 확인하세요.</p>

                    {/* Results Table */}
                    <table className="results-table">
                        <thead>
                        <tr>
                            <th>항목</th>
                            <th>결과</th>
                            <th>설명</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>항목 1</td>
                            <td>결과 1</td>
                            <td>이 항목에 대한 간단한 설명입니다.</td>
                        </tr>
                        <tr>
                            <td>항목 2</td>
                            <td>결과 2</td>
                            <td>이 항목에 대한 간단한 설명입니다.</td>
                        </tr>
                        {/* Add more rows as needed */}
                        </tbody>
                    </table>

                    {/* Image Section */}
                    <div className="result-image">
                        <h3>검사 이미지</h3>
                        <figure>
                            <img src="your-image-url.jpg" alt="HTP 검사 결과 이미지" />
                            <figcaption>HTP 검사에서 생성된 이미지</figcaption>
                        </figure>
                    </div>

                    <a href="/" className="back-button">
                        돌아가기
                    </a>
                </div>
            </main>

            <footer className="container">
                <small><a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a></small>
            </footer>
        </div>
    );
};

export default ResultPage;
