import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pokedex from './pages/Pokedex';
import Lobby from './pages/Lobby';
import Battle from './pages/Battle';
import Result from './pages/Result';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/battle" element={<Battle />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
