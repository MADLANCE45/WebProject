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
import ChatAssistant from './components/ChatAssistant';
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
  const [ricerca, setRicerca] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }}>
        <TopBar />
        
        {/* --- SOSTITUISCI DA QUI --- */}
        {/* HEADER EFFETTO VETRO (APPLE STYLE) */}
        {/* HEADER EFFETTO VETRO RESPONSIVO */}
        {/* HEADER EFFETTO VETRO RESPONSIVO */}
        <nav style={{ 
          padding: '12px 4%', 
          background: isDarkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)', 
          borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          position: 'sticky', 
          top: 0, 
          zIndex: 1000,
          boxShadow: isDarkMode ? 'none' : '0 4px 30px rgba(0,0,0,0.01)',
          height: '65px',
          boxSizing: 'border-box'
        }}>
          
          {isMobile && mobileSearchOpen ? (
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => { setMobileSearchOpen(false); setRicerca(''); }} style={{ background: 'none', border: 'none', fontSize: '20px', color: isDarkMode ? 'white' : '#111827', cursor: 'pointer' }}>←</button>
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Cerca prodotti..." 
                  value={ricerca} 
                  onChange={(e) => setRicerca(e.target.value)} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setMobileSearchOpen(false); // Chiude la tastiera su mobile
                      setTimeout(() => {
                        const catalogo = document.getElementById('sezione-ricerca');
                        if (catalogo) catalogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 300);
                    }
                  }}
                  style={{ width: '100%', padding: '10px 15px', borderRadius: '50px', border: '1px solid #FF6600', background: isDarkMode ? '#1F2937' : '#F3F4F6', color: isDarkMode ? '#F3F4F6' : '#111827', outline: 'none', fontSize: '14px' }}
                />
              </div>
            </div>
          ) : (
            <>
              {/* SINISTRA: LOGO */}
              <Link to="/" style={{ textDecoration: 'none', color: isDarkMode ? 'white' : '#111827', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' }}>Recensioni<span style={{ color: '#FF6600' }}>ITA</span></span>
              </Link>
              
              {/* CENTRO: BARRA SU DESKTOP (PIÙ GRANDE ED EFFICIENTE) */}
              {!isMobile ? (
                <div style={{ flex: '0 1 580px', position: 'relative', margin: '0 30px' }}>
                  <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#9CA3AF' }}>🔍</span>
                  <input 
                    type="text" 
                    placeholder="Cerca attrezzatura, esche, tende..." 
                    value={ricerca} 
                    onChange={(e) => setRicerca(e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const catalogo = document.getElementById('sezione-ricerca');
                        if (catalogo) {
                          catalogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    style={{ 
                      width: '100%', 
                      padding: '12px 45px 12px 48px', 
                      borderRadius: '50px', 
                      border: '1px solid transparent', 
                      background: isDarkMode ? '#1F2937' : '#F3F4F6', 
                      color: isDarkMode ? '#F3F4F6' : '#111827', 
                      outline: 'none', 
                      fontSize: '15px', 
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#111827' : '#FFFFFF';
                      e.currentTarget.style.borderColor = '#FF6600';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(255, 102, 0, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkMode ? '#1F2937' : '#F3F4F6';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  {ricerca && (
                    <button onClick={() => setRicerca('')} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>✕</button>
                  )}
                </div>
              ) : null}
              
              {/* DESTRA: STRUMENTI E SOCIAL */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexShrink: 0 }}>
                {isMobile && (
                  <button onClick={() => setMobileSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '5px' }}>🔍</button>
                )}

                <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: isDarkMode ? '#374151' : '#F3F4F6', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '14px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDarkMode ? '☀️' : '🌙'}
                </button>
                
                <a href="https://www.facebook.com/groups/969436699293635/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                   <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>

                <a href="https://youtube.com/@recensioniita9?si=Rdg3mXWsViQtWvup" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </>
          )}
        </nav>
        {/* --- FINO A QUI --- */}
        
        {/* AREA CENTRALE CHE CAMBIA IN BASE ALLA ROTTA */}
        {/* AREA CENTRALE CHE CAMBIA IN BASE ALLA ROTTA */}
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home isDarkMode={isDarkMode} ricerca={ricerca} setRicerca={setRicerca} />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/prodotto/:id" element={<ProductPage isDarkMode={isDarkMode} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy isDarkMode={isDarkMode} />} />
            <Route path="/cookie-policy" element={<CookiePolicy isDarkMode={isDarkMode} />} />
            <Route path="/termini-e-condizioni" element={<TerminiCondizioni isDarkMode={isDarkMode} />} />
          </Routes>
        </div>
        
        {/* IL CHATBOT VA INSERITO QUI! */}
        <ChatAssistant isDarkMode={isDarkMode} />
        
        <Footer isDarkMode={isDarkMode} />
        
        <CookieBanner isDarkMode={isDarkMode} />
      </div>
    </Router>
  )
}

export default App;

