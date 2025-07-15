import { Link } from 'react-router-dom';

export default function NavMenu() {
  return (
    <nav className="p-4 bg-black text-white flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/scene1">Scene 1</Link>
      <Link to="/scene2">Scene 2</Link>
      <Link to="/scene3">Scene 3</Link>
    </nav>
  );
}