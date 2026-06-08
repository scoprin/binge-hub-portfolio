import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaMoon, FaSun, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/"><h1>Binge Hub</h1></Link>
      </div>
      <div className="nav-links">
        <button onClick={toggleTheme} className="icon-btn" title="Toggle Theme">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        {currentUser ? (
          <>
            <Link to="/watchlist" className="nav-link"><FaHeart /> Watchlist</Link>
            <span className="user-email"><FaUser /> {currentUser.email.split('@')[0]}</span>
            <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout"><FaSignOutAlt /></button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link primary-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
