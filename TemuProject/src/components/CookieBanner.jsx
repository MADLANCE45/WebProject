import React, { useState, useEffect } from 'react';

export default function CookieBanner({ isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false);

  // Controlla se l'utente ha già accettato i cookie in passato
  useEffect(() => {
    const hasAccepted = localStorage.getItem('cookieAccepted');
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  // Salva la scelta nel browser e nasconde il banner
  const handleAccept = () => {
    localStorage.setItem('cookieAccepted', 'true');
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
          Utilizziamo i cookie per offrirti la migliore esperienza sul nostro sito, personalizzare i contenuti e analizzare il nostro traffico. Cliccando su "Accetto", acconsenti all'uso dei cookie in conformità con la nostra policy.
        </p>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
          Accetto
        </button>
      </div>
    </div>
  );
}