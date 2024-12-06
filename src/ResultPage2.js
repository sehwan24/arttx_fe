import React, { useEffect, useRef } from 'react';
import './ResultPage2.css';

const scores = {
    '공격성': 7,
    '사회불안': 5,
    '우울': 8,
    '대인회피': 6,
    '자존감': 9,
    '정서불안': 4,
    '애정결핍': 7,
    '열등감': 5,
    '퇴행': 8,
};

const maxScores = {
    '공격성': 12,
    '사회불안': 15,
    '우울': 15,
    '대인회피': 8,
    '자존감': 18,
    '정서불안': 21,
    '애정결핍': 12,
    '열등감': 14,
    '퇴행': 10,
};

const data = {
    drawing_analysis: "- 집과 나무가 전체 종이의 대부분을 차지하는 등 크기가 크게 그려졌습니다.",
    psychological_scores: "- 사회불안과 공격성이 높은 편이며, 우울, 정서불안, 애정결핍의 경향이 있습니다.",
    psychological_needs: "- 가족과의 안전한 공간에서의 즐거운 시간을 원하며, 약간의 외로움과 애정 결핍을 느낄 수 있습니다.",
    conversation_details: "- 아동은 집에서 부모님과 함께 맛있는 음식을 먹고 싶어 하지만, 바쁜 부모님 때문에 주로 혼자 식사를 하고 있습니다.",
    healing_methods: "- 계란후라이와 같은 간단한 요리를 통해 스스로 즐거움을 느끼고 성취감을 가질 수 있도록 했습니다.",
};

const drawDynamicNonagon = (canvas, scores, maxScores) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2.8; // 다각형 반경을 줄여 외곽 공간 확보
    const sides = 9;
    const angleStep = (2 * Math.PI) / sides;
    const scoreValues = Object.values(scores);
    const maxScoreValues = Object.values(maxScores);
    const scoreLabels = Object.keys(scores);

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw the base polygon (guide lines)
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
        const angle = i * angleStep;
        const x = centerX + maxRadius * Math.cos(angle);
        const y = centerY + maxRadius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw the dynamic polygon based on percentages
    ctx.beginPath();
    scoreValues.forEach((score, i) => {
        const percentage = score / maxScoreValues[i]; // Calculate percentage
        const angle = i * angleStep;
        const radius = percentage * maxRadius; // Scale radius by percentage
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.closePath();
    ctx.strokeStyle = '#007BFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'rgba(0, 123, 255, 0.2)';
    ctx.fill();

    // Draw the labels for each point
    scoreValues.forEach((score, i) => {
        const percentage = score / maxScoreValues[i]; // Calculate percentage
        const angle = i * angleStep;
        const radius = maxRadius ; // 라벨을 다각형 외곽에서 더 멀리 배치
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Draw the label (score and percentage)
        ctx.font = '14px Arial'; // 글씨 크기를 조정
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(
            `${scoreLabels[i]}: ${Math.round(percentage * 100)}%`,
            x,
            y
        );
    });
};


const ResultPage = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        drawDynamicNonagon(canvasRef.current, scores, maxScores);
    }, []);

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

            <main className="container2">
                <h2>HTP 검사 결과</h2>
                <p>아래는 당신의 HTP 검사 결과입니다. 각 점수는 도형의 꼭짓점에 표시됩니다.</p>

                {/* Nonagon Canvas */}
                <div className="nonagon-container">
                    <h3>9각형 도형 (점수 기반)</h3>
                    <canvas ref={canvasRef} width="400" height="400" className="nonagon-canvas"></canvas>
                </div>

                {/* Report Section */}
                <section className="report-section">
                    <h3>HTP Result Report</h3>
                    <p>아동의 HTP 검사를 기반으로 심리 상태를 분석한 결과입니다</p>
                    <ul>
                        <li><strong>그림 요소 분석:</strong> {data.drawing_analysis}</li>
                        <li><strong>심리 점수 분석:</strong> {data.psychological_scores}</li>
                        <li><strong>아동 심리 상태:</strong> {data.psychological_needs}</li>
                        <li><strong>챗봇과의 대화 내역:</strong> {data.conversation_details}</li>
                        <li><strong>치유 방법:</strong> {data.healing_methods}</li>
                    </ul>
                </section>

                <a href="/" className="back-button">
                    돌아가기
                </a>
            </main>
        </div>
    );
};

export default ResultPage;
