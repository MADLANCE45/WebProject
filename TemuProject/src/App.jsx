import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Admin from './Admin';
import './App.css';

// --- OFFERTE RUOTA BONUS ---
const offerte = [
  { 
    titolo: "100€ + 30%", 
    colore: "#dc2626",
    testo: "Pacchetto esclusivo da 100€ in coupon + 30% di sconto immediato sull'app Temu utilizzando il codice promozionale dedicato.",
    link: "https://temu.to/k/e6fwzqr8o97",
    codice: "app39037"
  },
  { 
    titolo: "SCONTO 30%", 
    colore: "#ff5500",
    testo: "Sblocca il 30% di sconto extra sul tuo ordine e un carnet da 100€ in buoni acquisto direttamente sull'app ufficiale.",
    link: "https://temu.to/k/ei314gw8o78",
    codice: "app39037"
  },
  { 
    titolo: "REGALO 0€", 
    colore: "#0f172a",
    testo: "Ottieni articoli selezionati a 0€ e riscatta il 30% di sconto con spedizione e reso gratuiti entro 90 giorni.",
    link: "https://temu.to/k/ef2vpiu4nll",
    codice: "ale016189"
  },
  { 
    titolo: "OFFERTA VIP", 
    colore: "#b91c1c",
    testo: "Accesso diretto al catalogo riservato di attrezzatura ad alta qualità a prezzo di fabbrica.",
    link: "https://temu.to/k/eudiy0642tx",
    codice: "alg203906"
  },
  { 
    titolo: "SCRIGNO", 
    colore: "#ea580c",
    testo: "Sblocca le offerte lampo del giorno con sconti massimi dedicati agli iscritti del canale.",
    link: "https://temu.to/m/u1te59jbio9",
    codice: "app39037"
  }
];

const repartiMap = {
  'Pesca Sportiva': [
    'Attrezzatura da Pesca',
    'Abbigliamento Tecnico',
    'Accessori e Logistica',
    'Elettronica e Utilità'
  ],
  'Acquariofilia': [
    'Vasche e Mobili',
    'Tecnica e Manutenzione',
    'Allestimento (Hardscape)',
    'Accessori Vari'
  ]
};

// --- RUOTA VETTORIALE SVG AD ALTA DEFINIZIONE ---
function SvgWheel({ rotazione = 0, size = 260 }) {
  const numSlices = offerte.length;
  const anglePerSlice = 360 / numSlices;
  const radius = 140;
  const center = 150;

  const polarToCartesian = (cx, cy, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians)
    };
  };

  const createSlicePath = (index) => {
    const startAngle = index * anglePerSlice;
    const endAngle = (index + 1) * anglePerSlice;
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = anglePerSlice <= 180 ? "0" : "1";

    return [
      "M", center, center,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      style={{
        transform: `rotate(${rotazione}deg)`,
        transition: 'transform 3.2s cubic-bezier(0.15, 0.85, 0.15, 1)',
        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.28))'
      }}
    >
      <circle cx={center} cy={center} r={radius + 6} fill="#0f172a" />
      {offerte.map((off, i) => {
        const midAngle = i * anglePerSlice + anglePerSlice / 2;
        return (
          <g key={i}>
            <path d={createSlicePath(i)} fill={off.colore} stroke="#ffffff" strokeWidth="2" />
            <g transform={`translate(${center}, ${center}) rotate(${midAngle - 90})`}>
              <text
                x={radius * 0.62}
                y="4"
                fill="#ffffff"
                fontSize="11.5"
                fontWeight="900"
                letterSpacing="0.6"
                textAnchor="middle"
              >
                {off.titolo}
              </text>
            </g>
          </g>
        );
      })}
      <circle cx={center} cy={center} r="26" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
      <circle cx={center} cy={center} r="10" fill="#ff5500" />
    </svg>
  );
}

// --- BARRA PROMOZIONALE SUPERIORE ---
function TopBar() {
  const [copiato, setCopiato] = useState(false);

  const copiaCodice = () => {
    navigator.clipboard.writeText('app39037');
    setCopiato(true);
    setTimeout(() => setCopiato(false), 2500);
  };

  return (
    <div className="topbar">
      <span>Spedizione gratuita e <strong>-30% Extra + 100€ Coupon</strong> con il codice ufficiale <strong>app39037</strong></span>
      <button onClick={copiaCodice} className="copy-badge">
        {copiato ? 'Codice Copiato' : 'Copia Codice'}
      </button>
    </div>
  );
}

// --- MODALE RUOTA BONUS ---
function WheelModal({ isOpen, onClose }) {
  const [rotazione, setRotazione] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [premioVinto, setPremioVinto] = useState(null);
  const [codiceCopiato, setCodiceCopiato] = useState(false);

  if (!isOpen) return null;

  const giraRuota = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setPremioVinto(null);

    const extraSpins = 360 * 6;
    const randomDegree = Math.floor(Math.random() * 360);
    const rotazioneTotale = rotazione + extraSpins + randomDegree;
    setRotazione(rotazioneTotale);

    setTimeout(() => {
      setIsSpinning(false);
      const gradiFinali = rotazioneTotale % 360;
      const indexPremio = Math.floor((360 - gradiFinali) / (360 / offerte.length)) % offerte.length;
      setPremioVinto(offerte[indexPremio]);
    }, 3200);
  };

  const copiaEApri = (premio) => {
    if (premio.codice) {
      navigator.clipboard.writeText(premio.codice);
      setCodiceCopiato(true);
    }
    window.open(premio.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: '#dc2626', textTransform: 'uppercase' }}>
          Estrazione Premi Ufficiale
        </span>
        <h2 style={{ margin: '4px 0 8px 0', fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px' }}>
          RUOTA BONUS TEMU
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
          Gira la ruota per sbloccare il tuo coupon sconto immediato.
        </p>

        <div style={{ position: 'relative', display: 'inline-block', margin: '10px auto' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M12 22L3 4h18l-9 18z" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
          <SvgWheel rotazione={rotazione} size={260} />
        </div>

        {!premioVinto ? (
          <button
            onClick={giraRuota}
            disabled={isSpinning}
            className="buy-direct-btn btn-red"
            style={{ marginTop: '14px', padding: '15px' }}
          >
            {isSpinning ? 'ESTRAZIONE IN CORSO...' : 'GIRA LA RUOTA ORA'}
          </button>
        ) : (
          <div style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.3)', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase', marginBottom: '4px' }}>
              Hai Sbloccato: {premioVinto.titolo}
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.5', margin: '0 0 12px 0' }}>{premioVinto.testo}</p>
            <button onClick={() => copiaEApri(premioVinto)} className="buy-direct-btn btn-orange">
              {codiceCopiato ? 'CODICE COPIATO - APERTURA TEMU' : `COPIA CODICE (${premioVinto.codice}) E VAI SU TEMU`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MODALE LEGALE GDPR (PRIVACY POLICY, COOKIE POLICY, DISCLAIMER) ---
function LegalModal({ activeSection, onClose, onSelectSection }) {
  if (!activeSection) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box legal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>

        <div className="legal-tabs">
          <button
            className={`legal-tab-btn ${activeSection === 'privacy' ? 'active' : ''}`}
            onClick={() => onSelectSection('privacy')}
          >
            Privacy Policy (GDPR)
          </button>
          <button
            className={`legal-tab-btn ${activeSection === 'cookie' ? 'active' : ''}`}
            onClick={() => onSelectSection('cookie')}
          >
            Cookie Policy
          </button>
          <button
            className={`legal-tab-btn ${activeSection === 'terms' ? 'active' : ''}`}
            onClick={() => onSelectSection('terms')}
          >
            Termini e Affiliazione
          </button>
        </div>

        <div className="legal-content">
          {activeSection === 'privacy' && (
            <div>
              <h3>Informativa sulla Privacy (ai sensi dell'Art. 13 Regolamento UE 2016/679 - GDPR)</h3>
              <p>
                <strong>1. Titolare del Trattamento e Contatti:</strong><br />
                Per qualsiasi richiesta relativa alla presente informativa o all'esercizio dei diritti previsti dal GDPR, è possibile contattare il gestore del portale Recensioni ITA all'indirizzo email: <strong>marcocretu0@gmail.com</strong>.
              </p>
              <p>
                <strong>2. Tipologia di Dati Trattati:</strong><br />
                Il sito ha natura puramente informativa e vetrina. Non richiede registrazione agli utenti visitatori e non raccoglie moduli con dati personali (come nomi, indirizzi o carte di credito). Durante la navigazione vengono acquisiti esclusivamente dati tecnici minimi necessari al funzionamento dell'infrastruttura di hosting (Vercel Inc.) e del database catalogo (Supabase Inc.), come l'indirizzo IP in forma tecnica nei log di sicurezza del server.
              </p>
              <p>
                <strong>3. Finalità e Base Giuridica:</strong><br />
                I dati tecnici sono trattati esclusivamente per garantire la corretta visualizzazione del catalogo prodotti e la sicurezza del sito (Art. 6 par. 1 lett. f GDPR - Legittimo interesse).
              </p>
              <p>
                <strong>4. Diritti dell'Interessato:</strong><br />
                Ai sensi degli artt. 15-22 del GDPR, l'utente ha diritto di chiedere l'accesso, la rettifica, la cancellazione o la limitazione del trattamento scrivendo a <strong>marcocretu0@gmail.com</strong>, oltre al diritto di proporre reclamo al Garante per la Protezione dei Dati Personali.
              </p>
            </div>
          )}

          {activeSection === 'cookie' && (
            <div>
              <h3>Cookie Policy (Provvedimento Garante Privacy 10 Giugno 2021)</h3>
              <p>
                <strong>1. Cookie Tecnici e LocalStorage (Strettamente Necessari):</strong><br />
                Questo sito utilizza esclusivamente memoria locale tecnica (<code>localStorage</code>) sul dispositivo dell'utente per salvare la preferenza espressa sul banner cookie (<code>gdpr_consent_choice</code>) e il tema visivo chiaro/scuro. Questi strumenti non tracciano l'utente a fini pubblicitari e non richiedono consenso preventivo.
              </p>
              <p>
                <strong>2. Link di Affiliazione e Siti di Terze Parti (Temu / YouTube):</strong><br />
                Il portale contiene link esterni di affiliazione che reindirizzano alla piattaforma terza <strong>Temu</strong> e al canale <strong>YouTube</strong>. Dal momento in cui l'utente clicca su "Vedi Offerta" o sui link esterni e abbandona questo sito, l'eventuale rilascio di cookie di profilazione o tracciamento delle commissioni avviene direttamente sul dominio di destinazione (es. <code>temu.com</code> / <code>temu.to</code>) secondo le rispettive Cookie Policy di tali terze parti.
              </p>
              <p>
                <strong>3. Gestione del Consenso:</strong><br />
                L'utente può modificare o revocare la propria scelta in qualsiasi momento cliccando sulla voce "Preferenze Cookie" presente nel footer del sito. Per informazioni: <strong>marcocretu0@gmail.com</strong>.
              </p>
            </div>
          )}

          {activeSection === 'terms' && (
            <div>
              <h3>Termini d'Uso e Disclaimer di Affiliazione</h3>
              <p>
                <strong>1. Trasparenza Affiliazione:</strong><br />
                Recensioni ITA partecipa al Programma di Affiliazione Temu. Ciò significa che cliccando sui link dei prodotti o utilizzando i codici promozionali indicati (es. <code>app39037</code>, <code>ale016189</code>, <code>alg203906</code>), il sito può ricevere una commissione pubblicitaria senza alcun sovrapprezzo o costo aggiuntivo per l'acquirente finale.
              </p>
              <p>
                <strong>2. Limitazione di Responsabilità su Prezzi e Prodotti:</strong><br />
                Recensioni ITA non vende direttamente alcun prodotto, non gestisce pagamenti e non effettua spedizioni. I prezzi indicati nel catalogo sono puramente indicativi e possono subire variazioni in tempo reale sulla piattaforma del venditore finale (Temu). Si invita l'utente a verificare sempre il prezzo finale, le condizioni di spedizione e i termini di reso direttamente sull'app o sul sito ufficiale di Temu prima di concludere l'acquisto.
              </p>
              <p>
                <strong>3. Assistenza e Segnalazioni:</strong><br />
                Per segnalare link non funzionanti, errori nel catalogo o per collaborazioni commerciali, scrivi a: <strong>marcocretu0@gmail.com</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- BANNER COOKIE GDPR ---
function GdprCookieBanner({ isOpen, onDecision, onOpenPolicy }) {
  if (!isOpen) return null;

  return (
    <div className="gdpr-banner">
      <div className="gdpr-text">
        <strong>Informativa Privacy e Cookie (GDPR):</strong> Utilizziamo memorie tecniche per il funzionamento del sito e link di affiliazione verso piattaforme esterne (Temu, YouTube). Consulta la nostra{' '}
        <button className="gdpr-link" onClick={() => onOpenPolicy('privacy')}>Privacy Policy</button> e la{' '}
        <button className="gdpr-link" onClick={() => onOpenPolicy('cookie')}>Cookie Policy</button>.
      </div>
      <div className="gdpr-actions">
        <button className="gdpr-btn-reject" onClick={() => onDecision('necessary')}>
          Solo Necessari
        </button>
        <button className="gdpr-btn-accept" onClick={() => onDecision('all')}>
          Accetta Tutti
        </button>
      </div>
    </div>
  );
}

// --- PAGINA HOME ---
function Home({ onOpenWheel }) {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repartoAttivo, setRepartoAttivo] = useState('Pesca Sportiva');
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte');
  const [filtroPrezzo, setFiltroPrezzo] = useState('Tutti');
  const [ricerca, setRicerca] = useState('');
  const [paginaCorrente, setPaginaCorrente] = useState(1);
  const prodottiPerPagina = 12;

  useEffect(() => {
    async function ottieniProdotti() {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
      if (!error && data) setProdotti(data);
      setLoading(false);
    }
    ottieniProdotti();
  }, []);

  useEffect(() => {
    setPaginaCorrente(1);
  }, [repartoAttivo, filtroCategoria, filtroPrezzo, ricerca]);

  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto);
    setFiltroCategoria('Tutte');
  };

  const prodottiFiltrati = prodotti.filter((p) => {
    const repDb = p.reparto || '';
    const passaReparto = repDb.includes(repartoAttivo) || (!p.reparto && repartoAttivo === 'Pesca Sportiva');
    const passaRicerca = (p.titolo || '').toLowerCase().includes(ricerca.toLowerCase());
    const passaCategoria = filtroCategoria === 'Tutte' || p.categoria === filtroCategoria;
    let passaPrezzo = true;
    if (p.prezzo) {
      const prezzoNum = parseFloat(p.prezzo.toString().replace(',', '.'));
      if (filtroPrezzo === '0-10') passaPrezzo = prezzoNum <= 10;
      else if (filtroPrezzo === '10-30') passaPrezzo = prezzoNum > 10 && prezzoNum <= 30;
      else if (filtroPrezzo === '30+') passaPrezzo = prezzoNum > 30;
    }
    return passaReparto && passaRicerca && passaCategoria && passaPrezzo;
  });

  const totalePagine = Math.ceil(prodottiFiltrati.length / prodottiPerPagina);
  const indiceInizio = (paginaCorrente - 1) * prodottiPerPagina;
  const prodottiPaginati = prodottiFiltrati.slice(indiceInizio, indiceInizio + prodottiPerPagina);

  const vaiAPagina = (num) => {
    setPaginaCorrente(num);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  return (
    <main className="container-main" style={{ flex: 1 }}>
      {/* BENTO GRID IN TESTATA */}
      <div className="bento-grid">
        <div
          onClick={() => cambiaReparto('Pesca Sportiva')}
          className={`bento-card ${repartoAttivo === 'Pesca Sportiva' ? 'active' : ''}`}
          style={{ '--bg-img': 'url(/banner.jpg)' }}
        >
          <div className="bento-content">
            <span className="bento-tag">Reparto 01</span>
            <h2>Pesca Sportiva</h2>
            <p>Canne, mulinelli, esche artificiali ed elettronica</p>
          </div>
        </div>

        <div
          onClick={() => cambiaReparto('Acquariofilia')}
          className={`bento-card ${repartoAttivo === 'Acquariofilia' ? 'active' : ''}`}
          style={{ '--bg-img': 'url(/banner2.jpg)' }}
        >
          <div className="bento-content">
            <span className="bento-tag">Reparto 02</span>
            <h2>Acquariofilia</h2>
            <p>Illuminazione LED, filtri, pompe e aquascaping</p>
          </div>
        </div>

        <div
          onClick={onOpenWheel}
          className="bento-card bento-promo"
          style={{ '--bg-img': 'url(/banner10.jpg)' }}
        >
          <div className="bento-wheel-deco">
            <SvgWheel rotazione={0} size={125} />
          </div>
          <div className="bento-content">
            <span className="bento-tag" style={{ background: '#dc2626' }}>Ruota della Fortuna</span>
            <h2>Coupon 100€ + 30%</h2>
            <p>Clicca per girare la ruota e riscattare il bonus</p>
          </div>
        </div>
      </div>

      {/* BARRA DI RICERCA E FILTRO PREZZO */}
      <div className="toolbar">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Cerca per nome l'articolo visto nei video su YouTube..."
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
          />
        </div>

        <select
          className="price-select"
          value={filtroPrezzo}
          onChange={(e) => setFiltroPrezzo(e.target.value)}
        >
          <option value="Tutti">Fascia di prezzo: Tutte</option>
          <option value="0-10">Sotto i 10€ (Offerte Lampo)</option>
          <option value="10-30">Da 10€ a 30€</option>
          <option value="30+">Oltre 30€</option>
        </select>
      </div>

      {/* CATEGORIE */}
      <div className="category-pills">
        <button
          onClick={() => setFiltroCategoria('Tutte')}
          className={`cat-pill ${filtroCategoria === 'Tutte' ? 'active' : ''}`}
        >
          Tutti ({prodottiFiltrati.length})
        </button>
        {repartiMap[repartoAttivo].map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroCategoria(cat)}
            className={`cat-pill ${filtroCategoria === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRIGLIA PRODOTTI */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)', fontWeight: '600' }}>
          Caricamento catalogo in corso...
        </p>
      ) : prodottiPaginati.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Nessun articolo corrisponde ai filtri selezionati.
          </p>
          <button
            onClick={() => { setRicerca(''); setFiltroCategoria('Tutte'); setFiltroPrezzo('Tutti'); }}
            className="cat-pill active"
          >
            Mostra Tutto il Catalogo
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {prodottiPaginati.map((prodotto) => {
              const numPrezzo = parseFloat((prodotto.prezzo || '0').toString().replace(',', '.'));
              const prezzoBarrato = numPrezzo > 0 ? (numPrezzo * 1.35).toFixed(2) : null;
              const linkLower = (prodotto.link_affiliazione || '').toLowerCase();

              const isRedTheme = (numPrezzo > 0 && numPrezzo <= 10) || (linkLower && !linkLower.includes('temu'));

              return (
                <div key={prodotto.id} className="product-card">
                  <span className={`discount-badge ${isRedTheme ? 'badge-red' : 'badge-orange'}`}>
                    {isRedTheme ? 'OFFERTA LAMPO' : 'TEMU -30%'}
                  </span>

                  <a
                    href={prodotto.link_affiliazione}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="product-img-wrapper"
                  >
                    {prodotto.immagine_url ? (
                      <img src={prodotto.immagine_url} alt={prodotto.titolo} loading="lazy" />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Immagine non disponibile</span>
                    )}
                  </a>

                  <div className="product-body">
                    <span className="product-cat-tag">
                      {prodotto.categoria || repartoAttivo}
                    </span>

                    <h3 className="product-title" title={prodotto.titolo}>
                      {prodotto.titolo}
                    </h3>

                    <div className="price-row">
                      <span
                        className="current-price"
                        style={{ color: isRedTheme ? 'var(--temu-red)' : 'var(--temu-orange)' }}
                      >
                        €{prodotto.prezzo}
                      </span>
                      {prezzoBarrato && <span className="old-price">€{prezzoBarrato}</span>}
                    </div>

                    <a
                      href={prodotto.link_affiliazione}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`buy-direct-btn ${isRedTheme ? 'btn-red' : 'btn-orange'}`}
                    >
                      <span>Vedi Offerta</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINAZIONE */}
          {totalePagine > 1 && (
            <div className="pagination-bar">
              <button
                className="page-btn"
                onClick={() => vaiAPagina(paginaCorrente - 1)}
                disabled={paginaCorrente === 1}
              >
                Prec.
              </button>

              {Array.from({ length: totalePagine }, (_, index) => {
                const numero = index + 1;
                return (
                  <button
                    key={numero}
                    onClick={() => vaiAPagina(numero)}
                    className={`page-btn ${paginaCorrente === numero ? 'active' : ''}`}
                  >
                    {numero}
                  </button>
                );
              })}

              <button
                className="page-btn"
                onClick={() => vaiAPagina(paginaCorrente + 1)}
                disabled={paginaCorrente === totalePagine}
              >
                Succ.
              </button>
            </div>
          )}
        </>
      )}

      {/* SEZIONE VIDEO YOUTUBE POSIZIONATA SOPRA IL FOOTER */}
      <section className="video-showcase-section">
        <div className="video-showcase-header">
          <div>
            <h3>I Nostri Video Test su YouTube</h3>
            <p>Oltre 100.000 visualizzazioni totali: guarda le prove sul campo prima di acquistare</p>
          </div>
          <a
            href="https://www.youtube.com/@recensioniita9"
            target="_blank"
            rel="noopener noreferrer"
            className="yt-channel-btn"
          >
            <span>Vai al Canale YouTube</span>
          </a>
        </div>

        <div className="video-grid">
          <a
            href="https://www.youtube.com/@recensioniita9/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
            style={{ backgroundImage: 'url(/banner3.jpg)' }}
          >
            <div className="video-play-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
            </div>
            <div className="video-card-info">
              <span>Test Attrezzatura</span>
              <h4>Mulinelli ed Esche Artificiali: La Prova</h4>
            </div>
          </a>

          <a
            href="https://www.youtube.com/@recensioniita9/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
            style={{ backgroundImage: 'url(/banner4.jpg)' }}
          >
            <div className="video-play-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
            </div>
            <div className="video-card-info">
              <span>Guida Acquisti</span>
              <h4>Migliori Accessori Pesca Sotto i 10 Euro</h4>
            </div>
          </a>

          <a
            href="https://www.youtube.com/@recensioniita9"
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
            style={{ backgroundImage: 'url(/banner5.jpg)' }}
          >
            <div className="video-play-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
            </div>
            <div className="video-card-info">
              <span>Setup e Acquari</span>
              <h4>Lampade LED, Filtri e Manutenzione</h4>
            </div>
          </a>
        </div>
      </section>
    </main>
  );
}

// --- COMPONENTE ROOT ---
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [legalSection, setLegalSection] = useState(null);
  const [showGdprBanner, setShowGdprBanner] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('gdpr_consent_choice');
    if (!savedConsent) {
      setShowGdprBanner(true);
    }
  }, []);

  const handleGdprDecision = (choice) => {
    localStorage.setItem('gdpr_consent_choice', choice);
    setShowGdprBanner(false);
  };

  return (
    <Router>
      <div className={`app-wrapper ${isDarkMode ? 'dark' : ''}`}>
        <TopBar />

        <nav className="navbar">
          <Link to="/" className="brand-logo">
            <div className="logo-circle">
              <img src="/logo.png" alt="Logo Recensioni ITA" />
            </div>
            <div className="brand-text">
              <div className="brand-title">
                <strong>Recensioni</strong>
                <span>ITA</span>
              </div>
              <div className="brand-subtitle">Fishing &amp; Aquarium Selection</div>
            </div>
          </Link>

          <div className="nav-center-trust">
            <a
              href="https://www.youtube.com/@recensioniita9"
              target="_blank"
              rel="noopener noreferrer"
              className="trust-item"
            >
              <span className="trust-dot"></span>
              <span>Canale YouTube: 100.000+ Visualizzazioni</span>
            </a>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <span style={{ color: 'var(--text-secondary)' }}>Selezione Verificata</span>
          </div>

          <div className="nav-actions">
            <button onClick={() => setIsWheelOpen(true)} className="wheel-trigger-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="12" y1="2" x2="12" y2="9"></line>
                <line x1="12" y1="15" x2="12" y2="22"></line>
                <line x1="2" y1="12" x2="9" y2="12"></line>
                <line x1="15" y1="12" x2="22" y2="12"></line>
              </svg>
              <span>Ruota Bonus</span>
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-btn"
              title="Cambia Tema"
            >
              {isDarkMode ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home onOpenWheel={() => setIsWheelOpen(true)} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <WheelModal isOpen={isWheelOpen} onClose={() => setIsWheelOpen(false)} />

        <LegalModal
          activeSection={legalSection}
          onClose={() => setLegalSection(null)}
          onSelectSection={(sec) => setLegalSection(sec)}
        />

        <GdprCookieBanner
          isOpen={showGdprBanner}
          onDecision={handleGdprDecision}
          onOpenPolicy={(sec) => setLegalSection(sec)}
        />

        {/* FOOTER CON PRIVACY, COOKIE E CONTATTO UFFICIALE */}
        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Recensioni ITA</h4>
              <p>
                Il portale dedicato agli appassionati di pesca sportiva e acquariofilia. Selezioniamo e testiamo le attrezzature con il miglior rapporto qualità-prezzo.
              </p>
              <p style={{ marginTop: '10px' }}>
                Contatto diretto: <a href="mailto:marcocretu0@gmail.com" style={{ color: '#ff5500', textDecoration: 'none', fontWeight: '700' }}>marcocretu0@gmail.com</a>
              </p>
            </div>

            <div className="footer-col">
              <h4>Navigazione</h4>
              <ul className="footer-links">
                <li><a href="https://www.youtube.com/@recensioniita9" target="_blank" rel="noopener noreferrer">Canale YouTube Ufficiale</a></li>
                <li><button className="footer-link-btn" onClick={() => setIsWheelOpen(true)}>Ruota Bonus Coupon</button></li>
                <li><Link to="/admin">Area Gestione Catalogo</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Note Legali &amp; GDPR</h4>
              <ul className="footer-links">
                <li><button className="footer-link-btn" onClick={() => setLegalSection('privacy')}>Privacy Policy (GDPR)</button></li>
                <li><button className="footer-link-btn" onClick={() => setLegalSection('cookie')}>Cookie Policy</button></li>
                <li><button className="footer-link-btn" onClick={() => setLegalSection('terms')}>Termini e Disclaimer Affiliazione</button></li>
                <li><button className="footer-link-btn" onClick={() => setShowGdprBanner(true)}>Preferenze Cookie</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Trasparenza Affiliazione</h4>
              <p>
                Partecipiamo al Programma Affiliati Temu. Acquistando tramite i nostri link o codici sconto, sostieni il canale senza alcun costo aggiuntivo per te.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Recensioni ITA — Contatto: marcocretu0@gmail.com</span>
            <span>Codice Sconto Ufficiale: <strong style={{ color: '#ff5500' }}>app39037</strong></span>
          </div>
        </footer>
      </div>
    </Router>
  );
}