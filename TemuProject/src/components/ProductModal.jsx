import React from 'react';
import ShareButtons from './ShareButtons'; 

export default function ProductModal({ prodotto, tuttiProdotti, onClose, isDarkMode }) {
  if (!prodotto) return null;

  // Variabili per i colori base
  const bg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const text = isDarkMode ? '#F9FAFB' : '#111827';
  const textMuted = isDarkMode ? '#9CA3AF' : '#6B7280'; // Grigio che si adatta
  const border = isDarkMode ? '#374151' : '#E5E7EB'; // Bordo che si adatta

  const categoriaSafe = prodotto.categoria || '';
  
  const correlati = tuttiProdotti
    .filter(p => p.categoria === categoriaSafe && p.id !== prodotto.id)
    .slice(0, 3);

  let prezzoBarrato = "0.00";
  if(prodotto.prezzo) {
    prezzoBarrato = ((parseFloat(prodotto.prezzo.toString().replace(',', '.'))) * 1.3).toFixed(2);
  }

  const percentualeVenduta = 75 + ((prodotto.id * 7) % 20); 

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: bg, color: text, width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '16px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column', padding: '25px' }}>
        
        {/* Pulsante Chiusura (adattato al dark mode) */}
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: isDarkMode ? '#374151' : '#E5E7EB', color: text, border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', fontWeight: 'bold', zIndex: 10 }}>X</button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
          
          {/* ================= COLONNA SINISTRA ================= */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: isDarkMode ? '#111827' : '#F3F4F6', borderRadius: '12px', overflow: 'hidden' }}>
               {prodotto.immagine_url ? <img src={prodotto.immagine_url} alt={prodotto.titolo} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /> : 'Nessuna Immagine'}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#FBBF24', fontSize: '22px', letterSpacing: '2px' }}>★★★★★</span>
              <span style={{ color: textMuted, fontSize: '15px', fontWeight: 'bold' }}>(4.8)</span>
            </div>

            {/* RECENSIONI SOTTO L'IMMAGINE */}
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: '15px', textAlign: 'left' }}>
              <h4 style={{ fontSize: '13px', margin: '0 0 10px 0', color: textMuted, textTransform: 'uppercase' }}>Recensioni Recenti</h4>
              
              {(() => {
                const nomiList = ['Marco D.', 'Simona R.', 'Alessandro T.', 'Francesca B.', 'Giuseppe M.', 'Valentina C.', 'Luca F.', 'Chiara S.', 'Andrea P.', 'Martina L.'];
                const recensioniList = [
                  "Prodotto fantastico, arrivato in soli 6 giorni. Identico alla foto!",
                  "Rapporto qualità prezzo imbattibile. Lo consiglio vivamente.",
                  "Ottimo acquisto! La spedizione è stata più veloce del previsto.",
                  "Qualità sorprendente per il prezzo pagato. Ne comprerò sicuramente un altro.",
                  "Esattamente quello che cercavo, molto utile e ben imballato.",
                  "Tutto perfetto, non delude mai. 5 stelle super meritate!",
                  "L'ho preso per un regalo ed è stato apprezzatissimo. Top!",
                  "Materiali ottimi, non me lo aspettavo a questo prezzo così basso."
                ];

                const nome1 = nomiList[(prodotto.id * 2) % nomiList.length];
                const nome2 = nomiList[(prodotto.id * 5 + 3) % nomiList.length];
                const rec1 = recensioniList[(prodotto.id * 3) % recensioniList.length];
                const rec2 = recensioniList[(prodotto.id * 7 + 1) % recensioniList.length];

                return (
                  <>
                    <div style={{ marginBottom: '10px', background: isDarkMode ? '#111827' : '#F9FAFB', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#FBBF24', fontSize: '12px' }}>★★★★★</span>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 'bold' }}>✓ Acquisto Verificato</span>
                      </div>
                      <div style={{ fontSize: '12px', color: text, fontWeight: 'bold', marginTop: '4px' }}>{nome1}</div>
                      <div style={{ fontSize: '12px', color: textMuted, marginTop: '2px', fontStyle: 'italic' }}>"{rec1}"</div>
                    </div>

                    <div style={{ background: isDarkMode ? '#111827' : '#F9FAFB', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#FBBF24', fontSize: '12px' }}>★★★★★</span>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 'bold' }}>✓ Acquisto Verificato</span>
                      </div>
                      <div style={{ fontSize: '12px', color: text, fontWeight: 'bold', marginTop: '4px' }}>{nome2}</div>
                      <div style={{ fontSize: '12px', color: textMuted, marginTop: '2px', fontStyle: 'italic' }}>"{rec2}"</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* ================= COLONNA DESTRA ================= */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: textMuted, textTransform: 'uppercase', letterSpacing: '1px' }}>{prodotto.reparto} &gt; {prodotto.categoria}</span>
            <h2 style={{ fontSize: '22px', margin: '8px 0', lineHeight: '1.4', color: text }}>{prodotto.titolo}</h2>
            
            {/* Pulsanti Condivisione */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <span style={{ fontSize: '12px', color: textMuted, fontWeight: 'bold' }}>Condividi:</span>
              <ShareButtons prodotto={prodotto} />
            </div>
            
            <div style={{ background: isDarkMode ? '#374151' : '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '10px', borderRadius: '4px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>⏳</span>
              <span style={{ fontSize: '13px', color: isDarkMode ? '#FCA5A5' : '#B91C1C', fontWeight: 'bold', lineHeight: '1.3' }}>Le offerte lampo e la disponibilità<br/>possono terminare in qualsiasi momento.</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '14px', color: textMuted, textDecoration: 'line-through', marginRight: '10px' }}>{prezzoBarrato}€</span>
              <span style={{ fontWeight: '900', fontSize: '38px', color: '#FF6600' }}>€ {prodotto.prezzo}</span>
            </div>

            {/* BOTTONE GIGANTE */}
            <a href={prodotto.link_affiliazione} className="temu-buy-btn" target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#FF6600', color: 'white', padding: '16px', textDecoration: 'none', borderRadius: '8px', fontSize: '20px', fontWeight: '900', textAlign: 'center', boxShadow: '0 4px 15px rgba(255,102,0,0.4)', marginBottom: '8px' }}>
              🔥 Vai all'Offerta su Temu
            </a>

            {/* Disclaimer Affiliato */}
            <p style={{ fontSize: '10px', color: textMuted, lineHeight: '1.2', textAlign: 'center', marginBottom: '20px' }}>
              * In qualità di Affiliato, ricevo una commissione per gli acquisti idonei.
            </p>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 'bold' }}>🔥 {percentualeVenduta}% Venduto</span>
              <div style={{ flex: 1, height: '6px', background: isDarkMode ? '#374151' : '#FEE2E2', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${percentualeVenduta}%`, height: '100%', background: '#EF4444', borderRadius: '10px' }}></div>
              </div>
            </div>

            {/* Vantaggi Spedizione */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: isDarkMode ? '#111827' : '#F9FAFB', padding: '15px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#059669', fontWeight: '600' }}><span>📦</span> Spedizione GRATUITA</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}><span>↩️</span> Reso gratuito entro 90 giorni</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}><span>🔒</span> Pagamenti sicuri al 100%</div>
            </div>
          </div>
        </div>

        {/* ================= CORRELATI ================= */}
        {correlati.length > 0 && (
          <div style={{ marginTop: '30px', borderTop: `1px solid ${border}`, paddingTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px', color: text }}>💡 Potrebbe interessarti anche...</h3>
            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
              {correlati.map(corr => (
                <div onClick={() => { window.open(corr.link_affiliazione, '_blank'); }} key={corr.id} style={{ minWidth: '160px', flex: '1', cursor: 'pointer', textDecoration: 'none', color: text, border: `1px solid ${border}`, borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <img src={corr.immagine_url} alt={corr.titolo} style={{ height: '100px', width: '100%', objectFit: 'contain', marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '12px', margin: '0 0 10px 0', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '34px', lineHeight: '1.4', color: text }}>{corr.titolo}</h4>
                  <span style={{ fontWeight: '900', color: '#FF6600', fontSize: '16px', marginTop: 'auto' }}>€ {corr.prezzo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}