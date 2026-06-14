import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// IMPORT DELLE PAGINE PRINCIPALI E COMPONENTI
import Home from './components/Home';
import ProductPage from './components/ProductPage';
import Admin from './Admin'; 
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import { PrivacyPolicy, CookiePolicy, TerminiCondizioni } from './components/PagineLegali';
// --- COMPONENTI MARKETING E GLOBAL ---

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 14 * 60 + 59); // 02:14:59 in secondi

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const ore = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const minuti = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const secondi = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '10px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px', border: '1px solid #FECACA' }}>
      ⏳ L'offerta scade tra: {ore}:{minuti}:{secondi}
    </div>
  );
}

function TopBar() {
  return (
    <div style={{ background: '#111827', color: 'white', textAlign: 'center', padding: '8px 4%', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>
      🔥 Spedizione Gratuita e Resi Gratuiti su Temu per 90 giorni! Scopri le offerte in basso.
    </div>
  )
}

// --- COMPONENTE ROOT (APP) ---
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }}>
        <TopBar />
        
        {/* HEADER EFFETTO VETRO (APPLE STYLE) */}
        <nav style={{ 
          padding: '15px 4%', 
          background: isDarkMode ? 'rgba(31, 41, 55, 0.75)' : 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(16px)', 
          WebkitBackdropFilter: 'blur(16px)', 
          borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          position: 'sticky', 
          top: 0, 
          zIndex: 100,
          boxShadow: isDarkMode ? 'none' : '0 10px 30px -10px rgba(0,0,0,0.05)'
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: isDarkMode ? 'white' : '#111827', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: '900' }}>Recensioni<span style={{ color: '#FF6600' }}>ITA</span></span>
          </Link>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {/* Tasto Dark Mode */}
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: isDarkMode ? '#374151' : '#F3F4F6', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} title="Cambia Tema">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {/* LINK E ICONA GRUPPO FACEBOOK */}
            <a href="https://www.facebook.com/groups/969436699293635/" target="_blank" rel="noopener noreferrer" title="Unisciti al Gruppo Facebook" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
               <svg width="26" height="26" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>

            {/* LINK CANALE YOUTUBE */}
            <a href="https://youtube.com/@recensioniita9?si=Rdg3mXWsViQtWvup" target="_blank" rel="noopener noreferrer" title="Visita il Canale" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </nav>
        
        {/* AREA CENTRALE CHE CAMBIA IN BASE ALLA ROTTA */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/prodotto/:id" element={<ProductPage isDarkMode={isDarkMode} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy isDarkMode={isDarkMode} />} />
<Route path="/cookie-policy" element={<CookiePolicy isDarkMode={isDarkMode} />} />
<Route path="/termini-e-condizioni" element={<TerminiCondizioni isDarkMode={isDarkMode} />} />
          </Routes>
        </div>
        
        <Footer isDarkMode={isDarkMode} />
        
        <CookieBanner isDarkMode={isDarkMode} />
      </div>
    </Router>
  )
}

export default App;