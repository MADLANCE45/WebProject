import React from 'react';

export default function Footer({ isDarkMode }) {
  const bg = isDarkMode ? '#111827' : '#F9FAFB'; 
  const text = isDarkMode ? '#9CA3AF' : '#6B7280';
  const titleColor = isDarkMode ? '#F9FAFB' : '#111827';
  const border = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <footer style={{ backgroundColor: bg, borderTop: `1px solid ${border}`, padding: '60px 20px 40px', textAlign: 'center', marginTop: 'auto' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        
        {/* 1. INTESTAZIONE E DESCRIZIONE */}
        <div>
          <h3 style={{ margin: '0 0 15px 0', color: titleColor, fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px' }}>
            Recensioni ITA
          </h3>
          <p style={{ margin: 0, fontSize: '15px', color: text, lineHeight: '1.6', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Il tuo punto di riferimento per scovare le migliori offerte nascoste di Pesca Sportiva e Acquariofilia. Selezioniamo solo i prodotti con il miglior rapporto qualità-prezzo.
          </p>
        </div>

        {/* 2. CONTATTI E SOCIAL (Solo Email e Instagram) */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          <a href="gardeniainfo67@gmail.com" style={{ backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', color: titleColor, textDecoration: 'none', fontWeight: '600', padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s', fontSize: '14px' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            📧 Email
          </a>
          
          <a href="https://www.instagram.com/recensionitaa/" target="_blank" rel="noopener noreferrer" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#FFF', textDecoration: 'none', fontWeight: '600', padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s', fontSize: '14px', boxShadow: '0 4px 10px rgba(225, 48, 108, 0.3)' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            📸 Instagram
          </a>

        </div>

        {/* 3. COPYRIGHT E DISCLAIMER LEGALE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px', paddingTop: '30px', borderTop: `1px solid ${border}` }}>
          
          <span style={{ fontSize: '14px', fontWeight: '700', color: text }}>
            &copy; {new Date().getFullYear()} Recensioni ITA. Tutti i diritti riservati.
          </span>
          
          <p style={{ margin: 0, fontSize: '12px', color: text, lineHeight: '1.6', opacity: 0.8, maxWidth: '750px', alignSelf: 'center' }}>
            <strong>Disclaimer:</strong> Questo sito contiene link di affiliazione. In qualità di affiliato, potremmo ricevere una commissione per gli acquisti idonei effettuati tramite i nostri link, senza alcun costo aggiuntivo per te.
          </p>

        </div>

      </div>
    </footer>
  );
}