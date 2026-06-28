import React, { useState, useEffect } from 'react';

export default function CookieBanner({ isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false);

  // Controlla se l'utente ha già fatto una scelta (accettato o rifiutato)
  useEffect(() => {
    const hasResponded = localStorage.getItem('cookieChoice');
    if (!hasResponded) {
      setIsVisible(true);
    }
  }, []);

  // Salva la scelta POSITIVA nel browser e nasconde il banner
  const handleAccept = () => {
    localStorage.setItem('cookieChoice', 'accepted');
    setIsVisible(false);
  };

  // Salva la scelta NEGATIVA nel browser e nasconde il banner
  const handleReject = () => {
    localStorage.setItem('cookieChoice', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const bg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const text = isDarkMode ? '#D1D5DB' : '#4B5563';
  const title = isDarkMode ? '#F9FAFB' : '#111827';
  const border = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 40px)',
      maxWidth: '700px',
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
      zIndex: 100000, // Altissimo per stare sopra a tutto
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div>
        <h4 style={{ margin: '0 0 8px 0', color: title, fontSize: '16px', fontWeight: 'bold' }}>
          🍪 Informativa sui Cookie
        </h4>
        <p style={{ margin: 0, color: text, fontSize: '13px', lineHeight: '1.5' }}>
          Utilizziamo i cookie per offrirti la migliore esperienza sul nostro sito, personalizzare i contenuti e analizzare il nostro traffico. Puoi scegliere se accettare o rifiutare i cookie non essenziali.
        </p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
        
        {/* TASTO RIFIUTA (Design neutro per la conformità legale) */}
        <button 
          onClick={handleReject}
          style={{
            backgroundColor: 'transparent',
            color: text,
            border: `1px solid ${border}`,
            padding: '10px 20px',
            borderRadius: '50px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDarkMode ? '#374151' : '#F3F4F6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Rifiuta
        </button>

        {/* TASTO ACCETTA (Design in evidenza) */}
        <button 
          onClick={handleAccept}
          style={{
            backgroundColor: '#FF6600',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '50px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E65C00'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FF6600'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Accetta Tutti
        </button>
      </div>
    </div>
  );
}