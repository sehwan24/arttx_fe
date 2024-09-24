import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>캐치! 그림핑 ㅋㅋㅋㅋㅋㅋㅋ</h1>
        <img src={`${process.env.PUBLIC_URL}/images/drawing_ping`} alt="drawing_ping" />
      </header>
    </div>
  );
}

export default App;
