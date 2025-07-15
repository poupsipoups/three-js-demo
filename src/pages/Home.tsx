import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenue sur mes démos Three.js</h1>
      <nav>
        <ul>
          <li><Link to="/scene1">Démo 1 - Cube rotatif</Link></li>
          <li><Link to="/scene2">Démo 2 - Particules animées</Link></li>
          <li><Link to="/scene3">Démo 3 - Terrain 3D</Link></li>
          {/* Ajoute autant de liens que tu veux */}
        </ul>
      </nav>
    </div>
  );
};

export default Home
