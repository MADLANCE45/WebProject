import React, { useState } from 'react';
import './Header.css';

export default function Header({
  repartiMap,
  repartoAttivo,
  setRepartoAttivo,
  filtroCategoria,
  setFiltroCategoria,
  isDarkMode
}) {
  const [modalCat, setModalCat] = useState(null); // Controlla l'apertura del menu moderno

  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto);
    setFiltroCategoria('Tutte'); 
  };

  const getBgImage = (repName) => {
    if (repName.includes('Pesca')) return '/banner4.jpg';
    if (repName.includes('Acquario')) return '/banner2.jpg';
    if (repName.includes('Campeggio')) return '/banner10.jpg'; 
    return ''; 
  };

  // Funzione per selezionare e chiudere il menu
  const selezionaSottocategoria = (sottoCat) => {
    setFiltroCategoria(sottoCat);
    setModalCat(null); // Chiude l'overlay
  };

  return (
    <div className={`nav-container ${isDarkMode ? 'dark-theme-active' : ''}`}>
      
      {/* BANNER REPARTI */}
      <div className="reparti-horizontal-container">
        {Object.keys(repartiMap).map((rep) => (
          <div
            key={rep}
            className={`reparto-banner ${repartoAttivo === rep ? 'attivo' : ''}`}
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${getBgImage(rep)})` 
            }}
            onClick={() => cambiaReparto(rep)}
          >
            <span className="reparto-title">{rep}</span>
          </div>
        ))}
      </div>

      {/* SEZIONE FILTRI A PILLOLA */}
      <div className="categorie-clean-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '15px 4%' }}>
        
        {/* Pulsante "Tutte" */}
        <button
          className={`categoria-tab ${filtroCategoria === 'Tutte' ? 'attivo' : ''}`}
          onClick={() => setFiltroCategoria('Tutte')}
        >
          Tutte le Categorie
        </button>
        
        {/* Generazione dinamica dei pulsanti che aprono il menu */}
        {Object.keys(repartiMap[repartoAttivo]).map((macroCat) => {
          const subCategorie = repartiMap[repartoAttivo][macroCat];
          const isAttivo = filtroCategoria === macroCat || subCategorie.includes(filtroCategoria);

          return (
            <button
              key={macroCat}
              className={`categoria-tab ${isAttivo ? 'attivo' : ''}`}
              onClick={() => setModalCat(macroCat)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {/* Mostra il nome della sottocategoria scelta, altrimenti il nome della Macro */}
              {isAttivo && filtroCategoria !== macroCat ? filtroCategoria : macroCat}
              
              {/* Freccetta dinamica integrata */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          );
        })}
      </div>

      {/* IL NUOVO MENU "BOTTOM SHEET" (Stile App) */}
      {modalCat && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)',
          zIndex: 99999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setModalCat(null)}>

          {/* Card Bianca/Scura che sale dal basso */}
          <div style={{
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            width: '100%', maxWidth: '600px',
            borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
            padding: '30px 20px 40px 20px',
            boxShadow: '0 -15px 40px rgba(0,0,0,0.2)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            color: isDarkMode ? '#F9FAFB' : '#111827'
          }} onClick={(e) => e.stopPropagation()}>

            {/* Header del Menu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '900' }}>{modalCat}</h3>
              <button onClick={() => setModalCat(null)} style={{ background: isDarkMode ? '#374151' : '#F3F4F6', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: isDarkMode ? '#F9FAFB' : '#111827', fontSize: '16px', fontWeight: 'bold', transition: '0.2s' }}>
                ✕
              </button>
            </div>

            {/* Griglia delle opzioni */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
              
              {/* 1. Opzione: Tutto */}
              <button
                onClick={() => selezionaSottocategoria(modalCat)}
                style={{
                  padding: '18px 20px', borderRadius: '16px', border: 'none',
                  backgroundColor: filtroCategoria === modalCat ? '#FF6600' : (isDarkMode ? '#374151' : '#F3F4F6'),
                  color: filtroCategoria === modalCat ? '#FFF' : (isDarkMode ? '#F9FAFB' : '#111827'),
                  fontWeight: '800', fontSize: '16px', textAlign: 'left', cursor: 'pointer', transition: '0.2s',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <span>📦 Mostra tutto in "{modalCat}"</span>
                {filtroCategoria === modalCat && <span style={{ fontSize: '20px' }}>✓</span>}
              </button>

              {/* 2. Sottocategorie */}
              {repartiMap[repartoAttivo][modalCat].map(sub => (
                <button
                  key={sub}
                  onClick={() => selezionaSottocategoria(sub)}
                  style={{
                    padding: '18px 20px', borderRadius: '16px', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
                    backgroundColor: filtroCategoria === sub ? '#FF6600' : 'transparent',
                    color: filtroCategoria === sub ? '#FFF' : (isDarkMode ? '#D1D5DB' : '#4B5563'),
                    fontWeight: '700', fontSize: '16px', textAlign: 'left', cursor: 'pointer', transition: '0.2s',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <span>↳ {sub}</span>
                  {filtroCategoria === sub && <span style={{ fontSize: '20px' }}>✓</span>}
                </button>
              ))}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}