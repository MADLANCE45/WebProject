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
    if (repName.includes('Campeggio')) return '/banner10.jpg'; 
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

      {/* SEZIONE CATEGORIE E MENU A TENDINA */}
      <div className="categorie-clean-container" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', padding: '15px 4%' }}>
        
        {/* Pulsante "Tutte" rimane classico */}
        <button
          className={`categoria-tab ${filtroCategoria === 'Tutte' ? 'attivo' : ''}`}
          onClick={() => setFiltroCategoria('Tutte')}
        >
          Tutte le Categorie
        </button>
        
        {/* Generazione dinamica dei pulsanti-tendina per le Macro-Categorie */}
        {Object.keys(repartiMap[repartoAttivo]).map((macroCat) => {
          
          // Controlliamo se la sottocategoria attualmente scelta appartiene a questo bottone
          const subCategorie = repartiMap[repartoAttivo][macroCat];
          const isAttivo = subCategorie.includes(filtroCategoria);

          // Colore freccia SVG dinamico in base al tema e se il bottone è attivo
          const arrowColor = (isDarkMode || isAttivo) ? '%23F9FAFB' : '%23111827';

          return (
            <div key={macroCat} style={{ position: 'relative' }}>
              <select
                className={`categoria-tab ${isAttivo ? 'attivo' : ''}`}
                value={isAttivo ? filtroCategoria : ""}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                style={{
                  appearance: 'none', // Rimuove la freccia standard del browser
                  paddingRight: '35px', // Spazio per la nostra freccia custom
                  cursor: 'pointer',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${arrowColor}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '16px',
                  outline: 'none'
                }}
              >
                {/* Nome della Macro-Categoria mostrato sul bottone (non selezionabile) */}
                <option value="" disabled hidden>
                  {macroCat}
                </option>

                {/* Le vere Sottocategorie selezionabili che arrivano dall'Admin */}
                {subCategorie.map((subCat) => (
                  <option key={subCat} value={subCat} style={{ color: '#111827', backgroundColor: '#FFFFFF', fontWeight: '500' }}>
                    {subCat}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
      
    </div>
  );
}