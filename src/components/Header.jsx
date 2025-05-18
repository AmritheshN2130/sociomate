import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';
import Home from '../pages/Home';

export default function Header() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [query, setQuery] = useState(''); // ✅ FIXED

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.className = darkMode ? 'light' : 'dark';
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?user=${query.trim()}`);
    }
  };

  return (
    <header className="socio-header">
      <div className="left" onClick={() => navigate('/')}>
        ⬅️
      </div>
      <div className="center">
        <h2>Sociomate</h2>
        </div>
        <div>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="header-search"
        />
      </div>
      <div className="right">
        <span onClick={() => navigate('/upload')}>📤</span>
        <span onClick={() => navigate('/profile')}>👤</span>
        <span onClick={() => navigate('/notifications')}>🔔</span>
        <span onClick={() => navigate('/community')}>🌐</span>
        <span onClick={toggleTheme}>{darkMode ? '🌞' : '🌙'}</span>
         <span onClick={() => navigate('/Home')}>:3</span>
        
      </div>
    </header>
  );
}
