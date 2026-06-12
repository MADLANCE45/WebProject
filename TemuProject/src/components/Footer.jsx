import React from 'react';

export default function Footer({ isDarkMode }) {
  // Variabili per gestire i colori in base al tema Chiaro/Scuro
  const bgColor = isDarkMode ? '#111827' : '#FFFFFF';
  const textColor = isDarkMode ? '#D1D5DB' : '#4B5563';
  const titleColor = isDarkMode ? '#F9FAFB' : '#111827';
  const borderColor = isDarkMode ? '#1F2937' : '#E5E7EB';

  return (
    <footer style={{
      backgroundColor: bgColor,
      color: textColor,
      borderTop: '4px solid #FF6600', // Il bordo arancione che hai richiesto!
      padding: '50px 4% 30px 4%',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 -10px 20px rgba(0,0,0,0.02)' // Ombra morbidissima verso l'alto
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>

        {/* 1. COLONNA BRAND E DESCRIZIONE */}
        <div>
          <h2 style={{ color: titleColor, fontSize: '26px', fontWeight: '900', margin: '0 0 15px 0' }}>
            Recensioni<span style={{ color: '#FF6600' }}>ITA</span>
          </h2>
          <p style={{ lineHeight: '1.6', fontSize: '15px', margin: '0 0 20px 0' }}>
            Il tuo punto di riferimento per scovare le migliori offerte nascoste. Selezioniamo solo i prodotti con il miglior rapporto qualità-prezzo.
          </p>
        </div>

        {/* 2. COLONNA CATEGORIE INTUITIVE */}
        <div>
          <h3 style={{ color: titleColor, fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>
            Esplora i Reparti
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '15px', lineHeight: '2.5' }}>
            {/* Cliccando questi link, la pagina scorre dolcemente verso l'alto! */}
            <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.target.style.color = '#FF6600'} onMouseLeave={(e) => e.target.style.color = textColor}>
              🎣 Pesca Sportiva
            </li>
            <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.target.style.color = '#FF6600'} onMouseLeave={(e) => e.target.style.color = textColor}>
              🐠 Acquariofilia
            </li>
            <li onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }} onMouseEnter={(e) => e.target.style.color = '#FF6600'} onMouseLeave={(e) => e.target.style.color = textColor}>
              🏕️ Campeggio e Bivacco
            </li>
          </ul>
        </div>

        {/* 3. COLONNA CONTATTI E SOCIAL */}
        <div>
          <h3 style={{ color: titleColor, fontSize: '18px', fontWeight: '700', margin: '0 0 20px 0' }}>
            Restiamo in Contatto
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* L'Email ora funziona perfettamente! */}
            <a href="mailto:gardeniainfo67@gmail.com" style={{ textDecoration: 'none', color: textColor, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FF6600'} onMouseLeave={(e) => e.currentTarget.style.color = textColor}>
              <span style={{ fontSize: '18px' }}>📧</span> Contattaci via Email
            </a>
            
            <a href="https://youtube.com/@recensioniita9?si=Rdg3mXWsViQtWvup" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: textColor, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#FF0000'} onMouseLeave={(e) => e.currentTarget.style.color = textColor}>
              <span style={{ fontSize: '18px' }}>📺</span> Iscriviti al Canale
            </a>
            
            <a href="https://www.facebook.com/groups/969436699293635/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: textColor, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#1877F2'} onMouseLeave={(e) => e.currentTarget.style.color = textColor}>
              <span style={{ fontSize: '18px' }}>👥</span> Entra nel Gruppo Facebook
            </a>
            
          </div>
        </div>

      </div>

      {/* DIVISORE E DISCLAIMER LEGALE */}
      <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '25px', textAlign: 'center', fontSize: '13px' }}>
        <p style={{ margin: '0 0 10px 0', color: titleColor, fontWeight: 'bold' }}>
          © 2026 Recensioni ITA. Tutti i diritti riservati.
        </p>
        <p style={{ margin: 0, color: isDarkMode ? '#9CA3AF' : '#6B7280', lineHeight: '1.6', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <strong>Disclaimer:</strong> Questo sito contiene link di affiliazione. In qualità di affiliato, potremmo ricevere una commissione per gli acquisti idonei effettuati tramite i nostri link, senza alcun costo aggiuntivo per te.
        </p>
      </div>
    </footer>
  );
}