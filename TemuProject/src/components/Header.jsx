import { useState } from 'react';
import './Header.css';

export default function Header({ categoriaAttiva, setCategoriaAttiva }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="app-header">
        <div className="header-container">
          <div className="logo">
            <button className="logo-btn" onClick={() => setCategoriaAttiva('Tutte')}>
              🎣 Recensioni Italia
            </button>
          </div>
          
          {/* Menu per Desktop */}
          <nav className="categorie-nav desktop-nav">
            <button 
              className={`nav-btn ${categoriaAttiva === 'Tutte' ? 'attivo' : ''}`}
              onClick={() => setCategoriaAttiva('Tutte')}
            >
              Tutte le Offerte
            </button>
            <button 
              className={`nav-btn ${categoriaAttiva === 'Pesca' ? 'attivo' : ''}`}
              onClick={() => setCategoriaAttiva('Pesca')}
            >
              🎣 Pesca
            </button>
            <button 
              className={`nav-btn ${categoriaAttiva === 'Acquario' ? 'attivo' : ''}`}
              onClick={() => setCategoriaAttiva('Acquario')}
            >
              🐠 Acquari
            </button>
          </nav>
        </div>

        {/* Menu Rapido per Mobile (Sempre visibile su piccoli schermi) */}
        <nav className="mobile-nav">
            <button 
              className={`nav-btn ${categoriaAttiva === 'Tutte' ? 'attivo' : ''}`}
              onClick={() => setCategoriaAttiva('Tutte')}
            >
              Tutte
            </button>
            <button 
              className={`nav-btn ${categoriaAttiva === 'Pesca' ? 'attivo' : ''}`}
              onClick={() => setCategoriaAttiva('Pesca')}
            >
              Pesca
            </button>
            <button 
              className={`nav-btn ${categoriaAttiva === 'Acquario' ? 'attivo' : ''}`}
              onClick={() => setCategoriaAttiva('Acquario')}
            >
              Acquari
            </button>
        </nav>
      </header>
  );
}