import React from 'react';
import './Header.css';

export default function Header({
  repartiMap,
  repartoAttivo,
  setRepartoAttivo,
  filtroCategoria,
  setFiltroCategoria,
  isDarkMode
}) {
  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto);
    setFiltroCategoria('Tutte'); 
  };

  const getBgImage = (repName) => {
    if (repName.includes('Pesca')) return '/banner4.jpg';
    if (repName.includes('Acquario')) return '/banner2.jpg';
    return ''; 
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

      {/* SEZIONE CATEGORIE */}
      <div className="categorie-clean-container">
        <button
          className={`categoria-tab ${filtroCategoria === 'Tutte' ? 'attivo' : ''}`}
          onClick={() => setFiltroCategoria('Tutte')}
        >
          Tutte le Categorie
        </button>
        
        {Object.keys(repartiMap[repartoAttivo]).map((cat) => (
          <button
            key={cat}
            className={`categoria-tab ${filtroCategoria === cat ? 'attivo' : ''}`}
            onClick={() => setFiltroCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}