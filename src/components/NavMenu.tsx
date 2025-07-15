import { Link, useLocation } from 'react-router-dom';
import '../index.css'; // pour s'assurer que le CSS custom est chargé

export const NavMenu = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={`
          fixed top-0 left-0 h-full w-auto flex flex-col items-start gap-10 py-16 px-4 z-50
          transition-transform duration-300
        `}
      style={{
        background: 'rgba(255,255,255,0.3)',
        position: 'fixed',
        zIndex: 9999,
        top: '70px',
        left: '0px',
        transform: open ? 'translateX(10px)' : 'translateX(calc(-100% - 10px))',
        opacity: open ? 1 : 0,
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        borderRadius: '10px',
        padding: '10px',
      }}
    >
      <Link
        to="/"
        className={`nav-groovy-link ${isActive('/') ? 'nav-active' : ''}`}
        onClick={() => setOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/scene1"
        className={`nav-groovy-link ${isActive('/scene1') ? 'nav-active' : ''}`}
        onClick={() => setOpen(false)}
      >
        Scene 1
      </Link>
      <Link
        to="/scene2"
        className={`nav-groovy-link ${isActive('/scene2') ? 'nav-active' : ''}`}
        onClick={() => setOpen(false)}
      >
        Scene 2
      </Link>
      <Link
        to="/scene3"
        className={`nav-groovy-link ${isActive('/scene3') ? 'nav-active' : ''}`}
        onClick={() => setOpen(false)}
      >
        Scene 3
      </Link>
    </nav>
  );

};

export default NavMenu;