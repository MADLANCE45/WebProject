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
  const [menuAperto, setMenuAperto] = useState(null);

  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto);
    setFiltroCategoria('Tutte'); 
    setMenuAperto(null);
  };

  const getBgImage = (repName) => {
    if (repName.includes('Pesca')) return '/banner4.jpg';
    if (repName.includes('Acquario')) return '/banner2.jpg';
    if (repName.includes('Campeggio')) return '/banner10.jpg'; 
    return ''; 
  };

  const gestisciSelezione = (scelta) => {
    setFiltroCategoria(scelta);
    setMenuAperto(null); // Chiude il menu dopo aver cliccato
  };

  return (
    <div className={`nav-container ${isDarkMode ? 'dark-theme-active' : ''}`}>
      
      {/* Sfondo invisibile per chiudere il menu cliccando fuori */}
      {menuAperto && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 199 }} 
          onClick={() => setMenuAperto(null)} 
        />
      )}

      {/* BANNER REPARTI */}
      <div className="reparti-horizontal-container">
        {Object.keys(repartiMap).map((rep) => (
          <div
            key={rep}
            className={`reparto-banner ${repartoAttivo === rep ? 'attivo' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${getBgImage(rep)})` }}
            onClick={() => cambiaReparto(rep)}
          >
            <span className="reparto-title">{rep}</span>
          </div>
        ))}
      </div>

      {/* RIGA DELLE CATEGORIE (Pillole con tendine custom) */}
      <div className="categorie-clean-container">
        
        {/* Pulsante fisso "Tutte" */}
        <button
          className={`categoria-tab ${filtroCategoria === 'Tutte' ? 'attivo' : ''}`}
          onClick={() => gestisciSelezione('Tutte')}
        >
          Tutte le Categorie
        </button>
        
        {/* Generazione Bottoni e Menu */}
        {Object.keys(repartiMap[repartoAttivo]).map((macroCat) => {
          const subCategorie = repartiMap[repartoAttivo][macroCat];
          const isAttivo = filtroCategoria === macroCat || subCategorie.includes(filtroCategoria);
          const isMenuAperto = menuAperto === macroCat;

          // Colore della freccia in base allo stato
          const arrowColor = (isDarkMode || isAttivo) ? '#FFFFFF' : '#4B5563';

          return (
            <div key={macroCat} className="custom-dropdown-container">
              
              {/* Il bottone visibile a forma di pillola */}
              <button
                className={`categoria-tab ${isAttivo ? 'attivo' : ''}`}
                onClick={() => setMenuAperto(isMenuAperto ? null : macroCat)}
              >
                {/* Mostra il nome della sottocategoria scelta, se no mostra la MacroCategoria */}
                <span>{isAttivo && filtroCategoria !== macroCat ? filtroCategoria : macroCat}</span>
                
                {/* Freccetta pulita stile Amazon */}
                <svg 
                  className="freccia-tendina" 
                  style={{ transform: isMenuAperto ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {/* La tendina elegante che appare sotto al bottone */}
              {isMenuAperto && (
                <div className="custom-dropdown-menu">
                  <button 
                    className={`custom-dropdown-item top-item ${filtroCategoria === macroCat ? 'selezionato' : ''}`}
                    onClick={() => gestisciSelezione(macroCat)}
                  >
                    Mostra tutto
                  </button>
                  
                  {subCategorie.map((sub) => (
                    <button 
                      key={sub}
                      className={`custom-dropdown-item ${filtroCategoria === sub ? 'selezionato' : ''}`}
                      onClick={() => gestisciSelezione(sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}