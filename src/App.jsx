import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);

  // Apply theme attribute to wrapper or body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-container">
      <div className="content-overlay">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="nav-brand">My Application</div>

          {/* Hamburger Menu Toggle Button */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Menu Items */}
          <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
            <li><a href="#home" style={{ color: 'inherit', textDecoration: 'none' }}>Home</a></li>
            <li><a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a></li>
            <li>
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </button>
            </li>
          </ul>
        </nav>

        {/* Page Content */}
        <main style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Welcome to the Dashboard</h1>
          <p>Toggle the hamburger menu or click the theme button to switch themes!</p>
        </main>
      </div>
    </div>
  );
}
