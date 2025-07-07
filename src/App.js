import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Pokedex from './pages/Pokedex';
import Battle from './pages/Battle';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokedex />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </Router>
  );
}

export default App;
