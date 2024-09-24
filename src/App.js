import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>캐치! 그림핑 ㅋㅋㅋㅋㅋㅋㅋ수정</h1>
        <img src={`${process.env.PUBLIC_URL}/images/drawing_ping`} alt="logo" />
      </header>
    </div>
  );
}

export default App;
