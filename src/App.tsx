import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavMenu from './components/NavMenu';
import Home from './pages/Home';
import Scene1 from './pages/Scene1';
import Scene2 from './pages/Scene2';
import Scene3 from './pages/Scene3';
import { useState } from 'react';

function App() {
  const [open, setOpen] = useState(false);

  return (
    <Router>
      <button
        className="top-0 left-0 p-2 text-white rounded-full"
        style={{ position: 'fixed', zIndex: 9999, top: '10px', left: '10px', background: 'rgba(255,255,255,0.3)' }}
        onClick={() => setOpen(!open)}
      >
        {/* Icône burger */}
        <span className="text-3xl">&#9776;</span>
      </button>

      {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ background: 'transparent', zIndex: 9998, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
        />
      )}

      <NavMenu open={open} setOpen={setOpen} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scene1" element={<Scene1 />} />
        <Route path="/scene2" element={<Scene2 />} />
        <Route path="/scene3" element={<Scene3 />} />
      </Routes>
    </Router>
  );
}

export default App;