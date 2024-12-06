import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DrawingPage from './DrawingPage';  // 방금 만든 DrawingPage 컴포넌트
import HomePage from './HomePage';  // 예시로 사용할 새로운 첫 페이지
import HousePage from "./HousePage";
import PersonPage from "./PersonPage";
import TreePage from "./TreePage";
import ChattingPage from "./ChattingPage";
import ResultPage2 from "./ResultPage2";

function App() {
    return (
        <Router>
            <Routes>
                {/* 첫 페이지로 연결될 경로 */}
                <Route path="/" element={<HomePage />} />

                {/* 기존의 그림 그리기 페이지는 /draw로 연결 */}
                <Route path="/draw" element={<DrawingPage />} />
                <Route path="/house" element={<HousePage />} />
                <Route path="/person" element={<PersonPage />} />
                <Route path="/tree" element={<TreePage />} />
                <Route path="/result" element={<ResultPage2 />} />
                <Route path="/chatting" element={<ChattingPage />} />
            </Routes>
        </Router>
    );
}

export default App;
