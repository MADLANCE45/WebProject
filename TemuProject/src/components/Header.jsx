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
    setMenuAperto(null); 
  };

  return (
    <div className={`nav-container ${isDarkMode ? 'dark-theme-active' : ''}`}>
      
      {/* Sfondo invisibile: si attiva SOLO su PC per chiudere la tendina cliccando fuori */}
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

      {/* RIGA DELLE CATEGORIE */}
      <div className="categorie-clean-container">
        
        <button
          className={`categoria-tab ${filtroCategoria === 'Tutte' ? 'attivo' : ''}`}
          onClick={() => gestisciSelezione('Tutte')}
          style={{ flexShrink: 0 }}
        >
          🌟 Tutte le Categorie
        </button>
        
        {/* Generazione Bottoni Misti */}
        {Object.keys(repartiMap[repartoAttivo]).map((macroCat) => {
          const subCategorie = repartiMap[repartoAttivo][macroCat];
          const isAttivo = filtroCategoria === macroCat || subCategorie.includes(filtroCategoria);
          const isMenuAperto = menuAperto === macroCat;

          const arrowColor = (isDarkMode || isAttivo) ? '#FFFFFF' : '#4B5563';
          const arrowColorEncoded = (isDarkMode || isAttivo) ? '%23FFFFFF' : '%234B5563';

          return (
            <div key={macroCat} className="dropdown-wrapper">
              
              {/* === 🖥️ VERSIONE PC (Menu fluttuante che non viene più tagliato) === */}
              <div className="desktop-menu">
                <button
                  className={`categoria-tab ${isAttivo ? 'attivo' : ''}`}
                  onClick={() => setMenuAperto(isMenuAperto ? null : macroCat)}
                >
                  <span>{isAttivo && filtroCategoria !== macroCat ? filtroCategoria : macroCat}</span>
                  <svg 
                    className="freccia-tendina" 
                    style={{ transform: isMenuAperto ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={arrowColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {isMenuAperto && (
                  <div className="custom-dropdown-menu">
                    <button 
                      className={`custom-dropdown-item top-item ${filtroCategoria === macroCat ? 'selezionato' : ''}`}
                      onClick={() => gestisciSelezione(macroCat)}
                    >
                      📦 Mostra tutto
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

              {/* === 📱 VERSIONE MOBILE (Tendina Infallibile a scorrimento orizzontale) === */}
              <div className="mobile-menu">
                <select
                  className={`categoria-tab ${isAttivo ? 'attivo' : ''}`}
                  value={isAttivo ? filtroCategoria : ""}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  style={{
                    appearance: 'none',
                    paddingRight: '35px',
                    cursor: 'pointer',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${arrowColorEncoded}' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '16px',
                    outline: 'none'
                  }}
                >
                  <option value="" disabled hidden>{macroCat}</option>
                  <option value={macroCat} style={{ fontWeight: 'bold' }}>📦 Mostra tutto</option>
                  {subCategorie.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}