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
  'Auto & Inverno 15 Nov': [
    'Calze da Neve & Catene',
    'Jump Starter & Batterie',
    'Mini Compressori & Gonfiaggio',
    'Raschiaghiaccio & Telo Termico'
  ],
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
  ],
  'Kit Emergenza 72h': [
    'Zaini Grab-and-Go & Tattici',
    'Illuminazione, Radio & Powerbank',
    'Acqua, Filtrazione & Utensili Cibo',
    'Primo Soccorso & Igiene',
    'Coperte Termiche & Protezione',
    'Documenti, Contanti & Animali'
  ]
};

// --- 1. CONFIGURATORE PESCA SPORTIVA (SONAR & SPOT INTERATTIVO) ---
const spotPescaConfig = {
  fiume: {
    nome: "Acqua Dolce (Fiume & Lago)",
    profondita: "1.8m - 6.5m",
    tempAcqua: "11°C - 16°C",
    consiglio: "Assetto consigliato: trecciati sottili ad alta visibilità, artificiali suspending o gomme piombate per sondare i fondali.",
    parolaChiave: ""
  },
  mare: {
    nome: "Mare & Scogliera (Spinning / Surf)",
    profondita: "3.0m - 14.0m",
    tempAcqua: "14°C - 19°C",
    consiglio: "Assetto consigliato: mulinelli schermati contro la salsedine, fluorocarbon resistente all'abrasione e long jerk o metal jig.",
    parolaChiave: ""
  },
  notturna: {
    nome: "Sessione Notturna & Carpfishing",
    profondita: "2.5m - 9.0m",
    tempAcqua: "10°C - 14°C",
    consiglio: "Assetto consigliato: segnalatori acustici, lampade frontali LED ricaricabili, sonar wireless portatile e borse termiche porta-esche.",
    parolaChiave: ""
  }
};

const setupPescaSportiva = [
  {
    tag: "Postazione 01",
    titolo: "Canne, Mulinelli & Esche",
    desc: "Mulinelli fluidi ad alto rapporto di recupero, canne in carbonio, artificiali, ami e trecciati.",
    categoriaTarget: "Attrezzatura da Pesca"
  },
  {
    tag: "Postazione 02",
    titolo: "Sonar, Ecoscandagli & Tech",
    desc: "Ecoscandagli wireless per individuare gli spot, bilance digitali, torce frontali e powerbank.",
    categoriaTarget: "Elettronica e Utilità"
  },
  {
    tag: "Postazione 03",
    titolo: "Zaini, Box & Logistica",
    desc: "Scatole porta-minuterie impermeabili, zaini tecnici da riva, foderi e borse termiche.",
    categoriaTarget: "Accessori e Logistica"
  },
  {
    tag: "Postazione 04",
    titolo: "Abbigliamento Tecnico",
    desc: "Occhiali polarizzati anti-riflesso per vedere i pesci sott'acqua, guanti anti-taglio e calzature.",
    categoriaTarget: "Abbigliamento Tecnico"
  }
];

// --- 2. CONFIGURATORE ACQUARIOFILIA (CENTRALINA LED & ECOSISTEMA) ---
const spettroAcquarioConfig = {
  daylight: {
    titolo: "Daylight 6500K (Acqua Dolce Tropicale)",
    parametri: "Temp: 24°C - 26°C • pH: 6.8 - 7.2 • Fotoperiodo: 8 ore/giorno",
    descrizione: "Ideale per acquari di comunità: esalta i colori naturali dei pesci tropicali e mantiene l'acqua cristallina."
  },
  plant: {
    titolo: "Plant Grow Full Spectrum (Aquascaping)",
    parametri: "Temp: 23°C - 25°C • CO2: 20-30 mg/l • Spettro: WRGB Fotosintetico",
    descrizione: "Stimola la fotosintesi e la crescita compatta delle piante vere, muschi e pratini sommersi."
  },
  moonlight: {
    titolo: "Moonlight Deep Blue (Notturno / Biotopo)",
    parametri: "Luce Attinica Notturna • Stress Zero • Osservazione Fauna Notturna",
    descrizione: "Riproduce il chiaro di luna naturale per osservare i pesci di fondo senza stressare la fauna."
  }
};

const setupAcquariofilia = [
  {
    tag: "Zona 01 • Tecnica",
    titolo: "Filtri, Pompe, LED & CO2",
    desc: "Plafoniere LED a spettro completo, filtri esterni/interni silenziosi, termoriscaldatori e impianti CO2.",
    categoriaTarget: "Tecnica e Manutenzione"
  },
  {
    tag: "Zona 02 • Layout",
    titolo: "Allestimento & Hardscape",
    desc: "Rocce naturali, legni ramificati, fondi fertili, sabbie ambrate e decorazioni sicure per la fauna.",
    categoriaTarget: "Allestimento (Hardscape)"
  },
  {
    tag: "Zona 03 • Struttura",
    titolo: "Vasche, Supporti & Nursery",
    desc: "Acquari in vetro extrachiaro, sale parto, reti da allevamento per avannotti e supporti.",
    categoriaTarget: "Vasche e Mobili"
  },
  {
    tag: "Zona 04 • Cura",
    titolo: "Manutenzione & Accessori",
    desc: "Mangiatoie automatiche digitali, sifoni aspirarifiuti, calamite puliscivetro e pinze lunghe.",
    categoriaTarget: "Accessori Vari"
  }
];

// --- 3. ACCESSORI AUTO 15 NOVEMBRE ---
const accessoriAuto15Nov = [
  {
    num: "Accessorio #01",
    titolo: "Calze da Neve in Azione",
    desc: "Omologate EN 16662-1 per l'obbligo del 15 Novembre: montaggio rapido in 2 minuti e zero vibrazioni.",
    categoriaTarget: "Calze da Neve & Catene"
  },
  {
    num: "Accessorio #02",
    titolo: "Avviatore d'Emergenza (Jump Starter)",
    desc: "Fa ripartire l'auto con batteria a terra col gelo invernale + funzione Powerbank e torcia LED.",
    categoriaTarget: "Jump Starter & Batterie"
  },
  {
    num: "Accessorio #03",
    titolo: "Mini Compressore Portatile",
    desc: "Controlla e ripristina la pressione delle gomme che cala col freddo, con arresto automatico digitale.",
    categoriaTarget: "Mini Compressori & Gonfiaggio"
  },
  {
    num: "Accessorio #04",
    titolo: "Raschiaghiaccio / Telo Termico",
    desc: "Protegge il parabrezza dalle gelate notturne e rimuove il ghiaccio in pochi secondi senza graffiare.",
    categoriaTarget: "Raschiaghiaccio & Telo Termico"
  }
];

// --- 4. CHECKLIST 72 ORE (LINEE GUIDA UE) ---
const lineeGuida72Ore = [
  {
    titolo: "1. Zaino Grab-and-Go",
    desc: "Zaino tattico capiente e impermeabile pronto per evacuazione rapida.",
    categoriaTarget: "Zaini Grab-and-Go & Tattici"
  },
  {
    titolo: "2. Illuminazione & Radio",
    desc: "Torcia LED/dinamo, radio a batterie o solare e powerbank carico con cavi.",
    categoriaTarget: "Illuminazione, Radio & Powerbank"
  },
  {
    titolo: "3. Acqua (6L) & Razioni",
    desc: "Scorta idrica, filtri potabilizzatori, apriscatole manuale e cibi no-cottura.",
    categoriaTarget: "Acqua, Filtrazione & Utensili Cibo"
  },
  {
    titolo: "4. Primo Soccorso & Igiene",
    desc: "Kit medico con bende, garze, disinfettante, salviette e igiene da campo.",
    categoriaTarget: "Primo Soccorso & Igiene"
  },
  {
    titolo: "5. Abbigliamento & Coperte",
    desc: "Coperta termica isotermica leggera, giacca impermeabile e indumenti caldi.",
    categoriaTarget: "Coperte Termiche & Protezione"
  },
  {
    titolo: "6. Documenti, Contanti & Pet",
    desc: "Buste stagne/ignifughe per contanti e copie documenti, USB e kit animali.",
    categoriaTarget: "Documenti, Contanti & Animali"
  }
];

// --- MOTORE SEO & DATI STRUTTURATI JSON-LD ---
function SeoEngine({ repartoAttivo, filtroCategoria, prodotti }) {
  useEffect(() => {
    const catText = filtroCategoria !== 'Tutte' ? ` - ${filtroCategoria}` : '';
    document.title = `${repartoAttivo}${catText} | Recensioni ITA - Offerte, Test e Codici Sconto`;

    const metaDesc = document.querySelector('meta[name="description"]');
    const descContent = `Catalogo interattivo di ${repartoAttivo}${catText}: scopri le migliori offerte verificate su Pesca Sportiva, Acquariofilia, Accessori Auto 15 Novembre e Kit 72h col codice app39037.`;
    if (metaDesc) {
      metaDesc.setAttribute('content', descContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = descContent;
      document.head.appendChild(meta);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "Recensioni ITA",
          "url": "https://recensioni-ita.vercel.app/",
          "logo": "https://recensioni-ita.vercel.app/logo.png",
          "sameAs": ["https://www.youtube.com/@recensioniita9"],
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "marcocretu0@gmail.com",
            "contactType": "customer support",
            "availableLanguage": ["Italian"]
          }
        },
        {
          "@type": "ItemList",
          "name": `Catalogo ${repartoAttivo}`,
          "itemListElement": prodotti.slice(0, 12).map((p, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
              "@type": "Product",
              "name": p.titolo,
              "image": p.immagine_url,
              "category": p.categoria || repartoAttivo,
              "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "price": parseFloat((p.prezzo || '0').toString().replace(',', '.')) || 0,
                "availability": "https://schema.org/InStock",
                "url": p.link_affiliazione
              }
            }
          }))
        }
      ]
    };

    let scriptTag = document.getElementById('seo-json-ld');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'seo-json-ld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);
  }, [repartoAttivo, filtroCategoria, prodotti]);

  return null;
}

// --- RUOTA VETTORIALE SVG ---
function SvgWheel({ rotazione = 0, size = 240 }) {
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
        maxWidth: '100%',
        height: 'auto',
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
      <span>Spedizione gratuita e <strong>-30% Extra + 100€ Coupon</strong> col codice <strong>app39037</strong></span>
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
          Estrazione Premi Giornaliera
        </span>
        <h2 style={{ margin: '4px 0 6px 0', fontSize: '22px', fontWeight: '900' }}>
          RUOTA BONUS TEMU
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>
          Gira la ruota per sbloccare il tuo coupon sconto immediato.
        </p>

        <div style={{ position: 'relative', display: 'inline-block', margin: '8px auto' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#dc2626">
              <path d="M12 22L3 4h18l-9 18z" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
          <SvgWheel rotazione={rotazione} size={240} />
        </div>

        {!premioVinto ? (
          <button
            onClick={giraRuota}
            disabled={isSpinning}
            className="buy-direct-btn btn-red"
            style={{ marginTop: '12px', padding: '14px' }}
          >
            {isSpinning ? 'ESTRAZIONE IN CORSO...' : 'GIRA LA RUOTA ORA'}
          </button>
        ) : (
          <div style={{ marginTop: '14px', padding: '14px', borderRadius: '12px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.3)', textAlign: 'left' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase', marginBottom: '4px' }}>
              Hai Sbloccato: {premioVinto.titolo}
            </div>
            <p style={{ fontSize: '12.5px', lineHeight: '1.45', margin: '0 0 12px 0' }}>{premioVinto.testo}</p>
            <button onClick={() => copiaEApri(premioVinto)} className="buy-direct-btn btn-orange">
              {codiceCopiato ? 'CODICE COPIATO - APERTURA TEMU' : `COPIA CODICE (${premioVinto.codice}) E VAI SU TEMU`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MODALE ASSISTENZA CLIENTI, PRIVACY, COOKIE E TERMINI ---
function LegalAndSupportModal({ activeSection, onClose, onSelectSection }) {
  const [ticketMotivo, setTicketMotivo] = useState('Assistenza Codice Sconto / Coupon Temu');
  const [ticketMessaggio, setTicketMessaggio] = useState('');

  if (!activeSection) return null;

  const inviaRichiestaSupporto = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Assistenza Recensioni ITA] ${ticketMotivo}`);
    const body = encodeURIComponent(
      `Richiesta Assistenza Clienti:\n\nArgomento: ${ticketMotivo}\n\nMessaggio:\n${ticketMessaggio}\n\n---\nInviato da: https://recensioni-ita.vercel.app`
    );
    window.location.href = `mailto:marcocretu0@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box legal-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>

        <div className="legal-tabs">
          <button
            className={`legal-tab-btn ${activeSection === 'support' ? 'active' : ''}`}
            onClick={() => onSelectSection('support')}
          >
            Assistenza Clienti
          </button>
          <button
            className={`legal-tab-btn ${activeSection === 'privacy' ? 'active' : ''}`}
            onClick={() => onSelectSection('privacy')}
          >
            Privacy Policy
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
            Termini e Condizioni
          </button>
        </div>

        <div className="legal-content">
          {activeSection === 'support' && (
            <div>
              <h3 style={{ marginTop: '4px' }}>Servizio Assistenza Clienti e Tutela Acquisti</h3>
              <p>
                Hai bisogno di aiuto per scegliere un'attrezzatura da pesca, un accessorio per l'acquario o applicare un codice sconto? Il nostro supporto risponde entro 24/48 ore.
              </p>

              <div className="support-grid-cards">
                <div className="support-info-card">
                  <h4>Reso Gratuito (Fino a 90 Giorni)</h4>
                  <p>
                    Oltre ai 14 giorni di diritto di recesso previsti dal Codice del Consumo (Dir. 2011/83/UE), gli ordini idonei beneficiano del reso gratuito esteso fino a 90 giorni.
                  </p>
                </div>
                <div className="support-info-card">
                  <h4>Garanzia Legale (24 Mesi)</h4>
                  <p>
                    Tutti gli articoli acquistati godono della garanzia legale di conformità di 24 mesi prevista dalla normativa europea, gestita direttamente sulla piattaforma d'acquisto.
                  </p>
                </div>
              </div>

              <form className="support-form" onSubmit={inviaRichiestaSupporto}>
                <h4 style={{ margin: '0', fontSize: '13.5px' }}>Invia una richiesta al Supporto Clienti</h4>
                <select
                  className="support-select"
                  value={ticketMotivo}
                  onChange={(e) => setTicketMotivo(e.target.value)}
                >
                  <option value="Assistenza Codice Sconto / Coupon Temu">Problema con Codice Sconto o Coupon</option>
                  <option value="Consiglio Tecnico Pesca Sportiva / Acquariofilia">Consiglio su Pesca Sportiva o Acquariofilia</option>
                  <option value="Info sui 4 Accessori Auto Inverno (15 Novembre)">Info sui 4 Accessori Auto Inverno (15 Novembre)</option>
                  <option value="Consiglio su Kit Emergenza 72h / Prodotti">Consiglio su Kit Emergenza 72h</option>
                  <option value="Segnalazione Link o Prezzo Prodotto">Segnalazione Link o Prezzo Prodotto</option>
                </select>

                <textarea
                  className="support-textarea"
                  placeholder="Scrivi qui il tuo messaggio o il nome dell'articolo per cui richiedi supporto..."
                  value={ticketMessaggio}
                  onChange={(e) => setTicketMessaggio(e.target.value)}
                  required
                />

                <button type="submit" className="buy-direct-btn btn-orange">
                  Invia Messaggio all'Assistenza
                </button>
              </form>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div>
              <h3>Informativa sulla Privacy (ai sensi dell'Art. 13 Regolamento UE 2016/679 - GDPR)</h3>
              <p>
                <strong>1. Titolare del Trattamento e Contatti:</strong><br />
                Per qualsiasi richiesta relativa alla presente informativa o all'esercizio dei diritti previsti dalla normativa sulla protezione dei dati personali, è possibile contattare il gestore del portale Recensioni ITA all'indirizzo email: <strong>marcocretu0@gmail.com</strong>.
              </p>
              <p>
                <strong>2. Tipologia di Dati Trattati e Finalità:</strong><br />
                Il sito ha natura di catalogo informativo e non richiede registrazione. Durante la navigazione vengono trattati esclusivamente dati tecnici minimi necessari alla sicurezza e alla corretta erogazione della pagina web (tramite l'infrastruttura Vercel Inc. e il database catalogo Supabase Inc.). L'invio facoltativo e volontario di comunicazioni email a <strong>marcocretu0@gmail.com</strong> comporta l'acquisizione dell'indirizzo del mittente al solo scopo di rispondere alla richiesta (Art. 6 par. 1 lett. b/f GDPR).
              </p>
              <p>
                <strong>3. Diritti dell'Interessato (Artt. 15-22 GDPR):</strong><br />
                L'utente può richiedere in qualsiasi momento l'accesso, la rettifica, la limitazione o la cancellazione dei propri dati scrivendo a <strong>marcocretu0@gmail.com</strong>.
              </p>
            </div>
          )}

          {activeSection === 'cookie' && (
            <div>
              <h3>Cookie Policy (Provvedimento Garante Privacy e Direttiva ePrivacy)</h3>
              <p>
                <strong>1. Memorie Tecniche Strettamente Necessarie:</strong><br />
                Questo sito utilizza esclusivamente memoria locale tecnica (<code>localStorage</code>) sul browser dell'utente per memorizzare la scelta espressa sul banner informativo (<code>gdpr_consent_choice</code>) e la preferenza del tema grafico chiaro/scuro. Non vengono installati cookie di profilazione proprietari.
              </p>
              <p>
                <strong>2. Collegamenti Esterni e Piattaforme Terze (Temu, AliExpress e YouTube):</strong><br />
                Il sito contiene link di affiliazione che reindirizzano verso piattaforme terze (<strong>Temu</strong>, <strong>AliExpress</strong>, <strong>YouTube</strong>) che operano come titolari autonomi del trattamento secondo le rispettive informative Cookie e Privacy.
              </p>
            </div>
          )}

          {activeSection === 'terms' && (
            <div>
              <h3>Termini di Servizio, Assistenza e Trasparenza Affiliazione</h3>
              <p>
                <strong>1. Trasparenza Commerciale e Affiliazione:</strong><br />
                In conformità alle normative sulla trasparenza digitale (Direttiva UE 2019/2161 e Reg. UE 2022/2065), si informa che Recensioni ITA partecipa a programmi di affiliazione (Temu, AliExpress). I collegamenti verso le offerte sono contrassegnati con attributo <code>rel="sponsored"</code>: l'eventuale acquisto genera una commissione pubblicitaria per il sostegno del canale senza alcun costo aggiuntivo per l'acquirente.
              </p>
              <p>
                <strong>2. Prezzi, Vendita e Servizio Clienti:</strong><br />
                Recensioni ITA svolge attività di selezione e recensione informativa: non vende direttamente i prodotti e non gestisce pagamenti. Per assistenza sui codici o segnalazioni sul catalogo è sempre attivo il recapito <strong>marcocretu0@gmail.com</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- BANNER COOKIE ---
function GdprCookieBanner({ isOpen, onDecision, onOpenPolicy }) {
  if (!isOpen) return null;

  return (
    <div className="gdpr-banner">
      <div className="gdpr-text">
        <strong>Informativa Privacy e Cookie:</strong> Utilizziamo memorie tecniche per il funzionamento del sito e link di affiliazione verso piattaforme esterne. Consulta la{' '}
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
function Home({ repartoAttivo, setRepartoAttivo, onOpenWheel, onOpenSupport }) {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte');
  const [filtroPrezzo, setFiltroPrezzo] = useState('Tutti');
  const [ricerca, setRicerca] = useState('');
  const [paginaCorrente, setPaginaCorrente] = useState(1);

  // Stati interattivi per Pesca Sportiva e Acquariofilia
  const [spotPesca, setSpotPesca] = useState('fiume');
  const [spettroLed, setSpettroLed] = useState('daylight');

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
    setRicerca('');
  };

  // Conta quanti prodotti ci sono in ogni sottocategoria per mostrarlo nelle card interattive
  const contaProdottiCategoria = (nomeReparto, nomeCat) => {
    return prodotti.filter((p) => {
      const repDb = p.reparto || '';
      const appartieneReparto = repDb.includes(nomeReparto) || (!p.reparto && nomeReparto === 'Pesca Sportiva');
      return appartieneReparto && p.categoria === nomeCat;
    }).length;
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
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const isWinter = repartoAttivo === 'Auto & Inverno 15 Nov';
  const isFishing = repartoAttivo === 'Pesca Sportiva';
  const isAquarium = repartoAttivo === 'Acquariofilia';
  const isApocalypse = repartoAttivo === 'Kit Emergenza 72h';

  return (
    <main className="container-main" style={{ flex: 1 }}>
      <SeoEngine
        repartoAttivo={repartoAttivo}
        filtroCategoria={filtroCategoria}
        prodotti={prodottiFiltrati}
      />

      <div className="seo-header-strip">
        <h1 className="seo-h1">
          {isFishing
            ? 'Ecoscandaglio Offerte Pesca Sportiva — Canne, Mulinelli, Esche e Sonar Testati'
            : isAquarium
            ? 'Configuratore Acquariofilia & Aquascaping — Plafoniere LED, Filtri, Vasche e Hardscape'
            : isWinter
            ? 'Speciale Obbligo 15 Novembre — I 4 Accessori Auto Indispensabili Visti su YouTube'
            : 'Radar Sconti Sopravvivenza — Kit Emergenza 72 Ore (Linee Guida UE)'}
        </h1>
      </div>

      {/* BENTO GRID A 5 CARD INTERATTIVE */}
      <div className="bento-grid">
        <div
          onClick={() => cambiaReparto('Pesca Sportiva')}
          className={`bento-card bento-fishing ${isFishing ? 'active' : ''}`}
          style={{ '--bg-img': 'url(/banner.jpg)' }}
        >
          <div className="bento-content">
            <span className="bento-tag" style={{ background: '#10b981', color: '#042f2e' }}>Sonar &amp; Spot</span>
            <h2>Pesca Sportiva</h2>
            <p>Canne, mulinelli, esche ed ecoscandagli</p>
          </div>
        </div>

        <div
          onClick={() => cambiaReparto('Acquariofilia')}
          className={`bento-card bento-aquarium ${isAquarium ? 'active' : ''}`}
          style={{ '--bg-img': 'url(/banner2.jpg)' }}
        >
          <div className="bento-content">
            <span className="bento-tag" style={{ background: '#06b6d4', color: '#04101c' }}>Aquascaping LED</span>
            <h2>Acquariofilia</h2>
            <p>Lampade LED, filtri, pompe e allestimento</p>
          </div>
        </div>

        <div
          onClick={() => cambiaReparto('Auto & Inverno 15 Nov')}
          className={`bento-card bento-winter ${isWinter ? 'active' : ''}`}
          style={{ '--bg-img': 'url(/auto.jpg)' }}
        >
          <div className="bento-content">
            <span className="bento-tag" style={{ background: '#0284c7', color: '#ffffff' }}>Speciale 15 Nov</span>
            <h2>Auto &amp; Inverno</h2>
            <p>Calze da neve, Jump Starter, Compressore e Telo</p>
          </div>
        </div>

        <div
          onClick={() => cambiaReparto('Kit Emergenza 72h')}
          className={`bento-card bento-apocalypse ${isApocalypse ? 'active' : ''}`}
          style={{ '--bg-img': 'url(/kit.jpg)' }}
        >
          <div className="bento-content">
            <span className="bento-tag" style={{ background: '#f59e0b', color: '#0f172a' }}>Linee Guida 72h</span>
            <h2>Kit Emergenza 72h</h2>
            <p>Zaini Grab-and-Go, radio dinamo e scorte</p>
          </div>
        </div>

        <div
          onClick={onOpenWheel}
          className="bento-card bento-promo"
          style={{ '--bg-img': 'url(/banner10.jpg)' }}
        >
          <div className="bento-wheel-deco">
            <SvgWheel rotazione={0} size={110} />
          </div>
          <div className="bento-content">
            <span className="bento-tag" style={{ background: '#dc2626' }}>Ruota della Fortuna</span>
            <h2>Coupon 100€ + 30%</h2>
            <p>Tocca per girare la ruota e riscattare il bonus</p>
          </div>
        </div>
      </div>

      {/* =========================================================
          1. DASHBOARD INTERATTIVA PESCA SPORTIVA (SONAR & ASSETTO)
         ========================================================= */}
      {isFishing && (
        <section className="fishing-hub">
          <div className="fishing-wave-strip"></div>
          <div className="fishing-top-row">
            <div>
              <div className="sonar-badge">
                <span className="radar-pulse"></span>
                <span>Ecoscandaglio Offerte Pesca • Scansione Attiva</span>
              </div>
              <h2 style={{ margin: '8px 0 4px 0', fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.4px' }}>
                Configuratore Interattivo Assetto da Pesca Sportiva
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#a7f3d0' }}>
                Seleziona il tuo ambiente di pesca o clicca su una postazione per filtrare le attrezzature testate:
              </p>
            </div>

            {/* Quadrante Radar Ecoscandaglio SVG Animato */}
            <div className="sonar-radar-box">
              <svg width="54" height="54" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="#042f2e" stroke="#10b981" strokeWidth="2" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(16,185,129,0.35)" strokeWidth="1" />
                <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
                <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(16,185,129,0.25)" strokeWidth="1" />
                <path
                  className="sonar-Sweep"
                  d="M50 50 L50 4 A46 46 0 0 1 92 32 Z"
                  fill="rgba(16, 185, 129, 0.45)"
                />
                <circle cx="66" cy="34" r="3.5" fill="#34d399" />
                <circle cx="34" cy="68" r="3" fill="#fbbf24" />
              </svg>
              <div style={{ textAlign: 'left', fontSize: '11.5px', lineHeight: '1.4' }}>
                <div style={{ fontWeight: '900', color: '#34d399', textTransform: 'uppercase' }}>
                  {spotPescaConfig[spotPesca].nome}
                </div>
                <div style={{ color: '#a7f3d0' }}>
                  Fondale: <strong>{spotPescaConfig[spotPesca].profondita}</strong> • Acqua: <strong>{spotPescaConfig[spotPesca].tempAcqua}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bottoni Scelta Ambiente di Pesca */}
          <div className="spot-selector-bar">
            <button
              type="button"
              onClick={() => setSpotPesca('fiume')}
              className={`spot-btn ${spotPesca === 'fiume' ? 'active' : ''}`}
            >
              Acqua Dolce (Fiume &amp; Lago)
            </button>
            <button
              type="button"
              onClick={() => setSpotPesca('mare')}
              className={`spot-btn ${spotPesca === 'mare' ? 'active' : ''}`}
            >
              Mare &amp; Scogliera
            </button>
            <button
              type="button"
              onClick={() => setSpotPesca('notturna')}
              className={`spot-btn ${spotPesca === 'notturna' ? 'active' : ''}`}
            >
              Carpfishing &amp; Notturna
            </button>

            {filtroCategoria !== 'Tutte' && (
              <button
                type="button"
                onClick={() => setFiltroCategoria('Tutte')}
                className="spot-btn"
                style={{ marginLeft: 'auto', background: '#ff5500', color: '#fff', borderColor: '#ff5500' }}
              >
                Mostra Tutto il Reparto Pesca
              </button>
            )}
          </div>

          <div className="spot-advice-box">
            <span><strong>Consiglio Tecnico Sonar:</strong> {spotPescaConfig[spotPesca].consiglio}</span>
          </div>

          <div className="fishing-4-grid">
            {setupPescaSportiva.map((item, idx) => {
              const count = contaProdottiCategoria('Pesca Sportiva', item.categoriaTarget);
              return (
                <div
                  key={idx}
                  onClick={() => setFiltroCategoria(item.categoriaTarget)}
                  className={`fishing-item-card ${filtroCategoria === item.categoriaTarget ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="fishing-item-tag">{item.tag}</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#34d399' }}>
                      {count} {count === 1 ? 'Articolo' : 'Articoli'} →
                    </span>
                  </div>
                  <h4>{item.titolo}</h4>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================
          2. DASHBOARD INTERATTIVA ACQUARIOFILIA (SPETTRO LED)
         ========================================================= */}
      {isAquarium && (
        <section className={`aquarium-hub spectrum-${spettroLed}`}>
          <div className="aquarium-led-bar"></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#67e8f9', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Plancia Aquascaping &amp; Biotopo • Simulatore Luce Attivo
              </span>
              <h2 style={{ margin: '6px 0 4px 0', fontSize: '22px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.4px' }}>
                Configuratore Ecosistema Acquario &amp; Spettro LED
              </h2>
            </div>

            {/* Controller Spettro Plafoniera LED Interattivo */}
            <div className="led-controller-box">
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#bae6fd', marginRight: '4px' }}>
                PROVA SPETTRO LUCE:
              </span>
              <button
                type="button"
                onClick={() => setSpettroLed('daylight')}
                className={`led-btn ${spettroLed === 'daylight' ? 'active' : ''}`}
              >
                Daylight 6500K
              </button>
              <button
                type="button"
                onClick={() => setSpettroLed('plant')}
                className={`led-btn ${spettroLed === 'plant' ? 'active' : ''}`}
              >
                Plant Grow RGB
              </button>
              <button
                type="button"
                onClick={() => setSpettroLed('moonlight')}
                className={`led-btn ${spettroLed === 'moonlight' ? 'active' : ''}`}
              >
                Moonlight Notturno
              </button>
            </div>
          </div>

          <div className="aquarium-params-strip">
            <div>
              <strong style={{ color: '#ffffff' }}>{spettroAcquarioConfig[spettroLed].titolo}:</strong>{' '}
              {spettroAcquarioConfig[spettroLed].descrizione}
            </div>
            <div style={{ fontWeight: '800', color: '#67e8f9', fontSize: '11.5px' }}>
              {spettroAcquarioConfig[spettroLed].parametri}
            </div>
          </div>

          <div className="aquarium-4-grid">
            {setupAcquariofilia.map((item, idx) => {
              const count = contaProdottiCategoria('Acquariofilia', item.categoriaTarget);
              return (
                <div
                  key={idx}
                  onClick={() => setFiltroCategoria(item.categoriaTarget)}
                  className={`aquarium-item-card ${filtroCategoria === item.categoriaTarget ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="aquarium-item-tag">{item.tag}</span>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#67e8f9' }}>
                      {count} {count === 1 ? 'Articolo' : 'Articoli'} →
                    </span>
                  </div>
                  <h4>{item.titolo}</h4>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================
          3. DASHBOARD AUTO & INVERNO (OBBLIGO 15 NOVEMBRE)
         ========================================================= */}
      {isWinter && (
        <section className="winter-hub">
          <div className="winter-road-strip"></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <div className="winter-badge">
                <span>Speciale Video YouTube • Scadenza 15 Novembre</span>
              </div>
              <h2 style={{ margin: '8px 0 0 0', fontSize: '22px', fontWeight: '800', textTransform: 'uppercase' }}>
                I 4 Accessori Auto Indispensabili per l'Inverno (E l'Obbligo del 15 Novembre)
              </h2>
            </div>
            {filtroCategoria !== 'Tutte' && (
              <button
                onClick={() => setFiltroCategoria('Tutte')}
                className="copy-badge"
                style={{ background: '#38bdf8', color: '#090d16', border: 'none', padding: '8px 14px' }}
              >
                Mostra Tutti i 4 Accessori
              </button>
            )}
          </div>

          <div className="winter-notice">
            <strong>Dal 15 Novembre scatta ufficialmente l'obbligo delle dotazioni invernali:</strong> fatti trovare pronto per neve, batteria scarica dal freddo, calo di pressione delle gomme e parabrezza ghiacciato. Clicca su uno dei 4 accessori protagonisti del video per filtrare le offerte:
          </div>

          <div className="winter-4-grid">
            {accessoriAuto15Nov.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setFiltroCategoria(item.categoriaTarget)}
                className={`winter-item-card ${filtroCategoria === item.categoriaTarget ? 'active' : ''}`}
              >
                <span className="winter-item-num">{item.num}</span>
                <h4>{item.titolo}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          4. DASHBOARD APOCALISSE / KIT EMERGENZA 72 ORE
         ========================================================= */}
      {isApocalypse && (
        <section className="apocalypse-hub">
          <div className="apocalypse-hazard-strip"></div>
          <div className="apocalypse-header">
            <div>
              <div className="radar-status">
                <span className="radar-pulse"></span>
                <span>Scanner Offerte Sopravvivenza 72 Ore: Attivo</span>
              </div>
              <h2 style={{ margin: '8px 0 4px 0', fontSize: '21px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.4px' }}>
                Configuratore Kit di Emergenza 72 Ore al Prezzo Più Basso
              </h2>
            </div>
            {filtroCategoria !== 'Tutte' && (
              <button
                onClick={() => setFiltroCategoria('Tutte')}
                className="copy-badge"
                style={{ background: '#f59e0b', color: '#0f172a', border: 'none', padding: '8px 14px' }}
              >
                Mostra Tutto il Kit 72h
              </button>
            )}
          </div>

          <div className="apocalypse-disclaimer">
            <strong>Nota Informativa Ufficiale:</strong> Le indicazioni dell'Unione Europea sul Kit da 72 ore <strong>non sono obbligatorie per legge</strong> e non impongono alcun vincolo, ma rappresentano linee guida pratiche per affrontare in autonomia le prime 72 ore di un'emergenza. Clicca su una categoria qui sotto per filtrare i migliori sconti verificati:
          </div>

          <div className="checklist-72h-grid">
            {lineeGuida72Ore.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setFiltroCategoria(item.categoriaTarget)}
                className={`checklist-item-card ${filtroCategoria === item.categoriaTarget ? 'active' : ''}`}
              >
                <h4>
                  <span>{item.titolo}</span>
                  <span style={{ fontSize: '11px', color: '#f8fafc' }}>Filtra →</span>
                </h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BARRA DI RICERCA E FILTRO PREZZO */}
      <div className="toolbar">
        <div className="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            aria-label="Cerca prodotto nel catalogo"
            className="search-input"
            placeholder={
              isFishing
                ? "Cerca nel reparto pesca: mulinello, canna spinning, trecciato, ecoscandaglio..."
                : isAquarium
                ? "Cerca nel reparto acquari: filtro esterno, plafoniera LED, riscaldatore, rocce..."
                : isWinter
                ? "Cerca: calze da neve, jump starter, mini compressore, telo termico..."
                : "Cerca nel bunker: torcia dinamo, radio, filtro acqua, zaino 72h..."
            }
            value={ricerca}
            onChange={(e) => setRicerca(e.target.value)}
          />
        </div>

        <select
          aria-label="Filtra per fascia di prezzo"
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

      {/* PILLOLE CATEGORIE */}
      <div className="category-pills">
        <button
          onClick={() => setFiltroCategoria('Tutte')}
          className={`cat-pill ${filtroCategoria === 'Tutte' ? 'active' : ''}`}
        >
          Tutti ({prodottiFiltrati.length})
        </button>
        {(repartiMap[repartoAttivo] || []).map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltroCategoria(cat)}
            className={`cat-pill ${filtroCategoria === cat ? 'active' : ''}`}
          >
            {cat} ({contaProdottiCategoria(repartoAttivo, cat)})
          </button>
        ))}
      </div>

      {/* GRIGLIA PRODOTTI */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)', fontWeight: '600' }}>
          Caricamento offerte in corso...
        </p>
      ) : prodottiPaginati.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Nessun articolo trovato con i filtri attuali in {repartoAttivo}.
          </p>
          <button
            onClick={() => { setRicerca(''); setFiltroCategoria('Tutte'); setFiltroPrezzo('Tutti'); }}
            className="cat-pill active"
          >
            Mostra Tutto il Reparto
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {prodottiPaginati.map((prodotto) => {
              const numPrezzo = parseFloat((prodotto.prezzo || '0').toString().replace(',', '.'));
              const prezzoBarrato = numPrezzo > 0 ? (numPrezzo * 1.35).toFixed(2) : null;
              const linkLower = (prodotto.link_affiliazione || '').toLowerCase();

              const isAliExpress = linkLower.includes('aliexpress');
              const isRedTheme = isAliExpress || (numPrezzo > 0 && numPrezzo <= 10);

              const gestisciClickProdotto = () => {
                if (!isAliExpress) {
                  navigator.clipboard.writeText('app39037').catch(() => {});
                }
              };

              let badgeClass = 'badge-orange';
              let badgeText = 'TEMU -30%';
              if (isAliExpress) {
                badgeClass = 'badge-red';
                badgeText = 'ALIEXPRESS DEAL';
              } else if (isFishing) {
                badgeClass = isRedTheme ? 'badge-red' : 'badge-emerald';
                badgeText = isRedTheme ? 'LAMPO PESCA' : 'SELEZIONE PESCA';
              } else if (isAquarium) {
                badgeClass = isRedTheme ? 'badge-red' : 'badge-cyan';
                badgeText = isRedTheme ? 'LAMPO ACQUARI' : 'AQUASCAPE PRO';
              } else if (isWinter) {
                badgeClass = 'badge-ice';
                badgeText = 'SPECIALE 15 NOV';
              } else if (isApocalypse) {
                badgeClass = 'badge-red';
                badgeText = 'SCORTA 72H';
              }

              return (
                <article
                  key={prodotto.id}
                  className="product-card"
                  itemScope
                  itemType="https://schema.org/Product"
                >
                  <span className={`discount-badge ${badgeClass}`}>
                    {badgeText}
                  </span>

                  <a
                    href={prodotto.link_affiliazione}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="product-img-wrapper"
                    onClick={gestisciClickProdotto}
                  >
                    {prodotto.immagine_url ? (
                      <img
                        src={prodotto.immagine_url}
                        alt={`${prodotto.titolo} - ${prodotto.categoria || repartoAttivo}`}
                        loading="lazy"
                        itemProp="image"
                      />
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>Immagine non disponibile</span>
                    )}
                  </a>

                  <div className="product-body">
                    <span className="product-cat-tag" itemProp="category">
                      {prodotto.categoria || repartoAttivo}
                    </span>

                    <h2 className="product-title" title={prodotto.titolo} itemProp="name">
                      {prodotto.titolo}
                    </h2>

                    <div
                      className="price-row"
                      itemProp="offers"
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <meta itemProp="priceCurrency" content="EUR" />
                      <meta itemProp="price" content={numPrezzo || 0} />
                      <link itemProp="availability" href="https://schema.org/InStock" />
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
                      rel="sponsored noopener noreferrer"
                      className={`buy-direct-btn ${isRedTheme ? 'btn-red' : 'btn-orange'}`}
                      itemProp="url"
                      onClick={gestisciClickProdotto}
                    >
                      <span>{isAliExpress ? 'Vedi su AliExpress' : 'Vedi Offerta'}</span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {totalePagine > 1 && (
            <nav className="pagination-bar" aria-label="Paginazione catalogo">
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
            </nav>
          )}
        </>
      )}

      {/* SEZIONE VIDEO YOUTUBE */}
      <section className="video-showcase-section">
        <div className="video-showcase-header">
          <div>
            <h3>I Nostri Video Test su YouTube</h3>
            <p>Oltre 100.000 visualizzazioni sul canale: guarda le prove prima di acquistare</p>
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
            href="https://youtu.be/MzimymF65zs?si=gPB_TaEGij8HXkqv"
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
            style={{ backgroundImage: 'url(/auto.jpg)' }}
          >
            <div className="video-play-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
            </div>
            <div className="video-card-info">
              <span>Nuovo Video • Obbligo 15 Novembre</span>
              <h4>I 4 Accessori Auto Indispensabili per l'Inverno</h4>
            </div>
          </a>

          <a
            href="https://youtu.be/FyFkfrBTf9w?si=JFopDujq3zsx0kr8"
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
            style={{ backgroundImage: 'url(/banner4.jpg)' }}
          >
            <div className="video-play-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
            </div>
            <div className="video-card-info">
              <span>Test Pesca Sportiva</span>
              <h4>Mulinelli ed Esche Artificiali: La Prova</h4>
            </div>
          </a>

          <a
            href="https://youtu.be/Nrcfqyx0ymU?si=EoAAyhkP-g1egMUI"
            target="_blank"
            rel="noopener noreferrer"
            className="video-card"
            style={{ backgroundImage: 'url(/kit.jpg)' }}
          >
            <div className="video-play-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
            </div>
            <div className="video-card-info">
              <span>Acquariofilia &amp; Kit 72h</span>
              <h4>Plafoniere LED, Filtri, Torce e Powerbank</h4>
            </div>
          </a>
        </div>
      </section>

      {/* BLOCCO SEMANTICO SEO */}
      <section className="seo-text-block">
        <h2>Recensioni ITA: Pesca Sportiva, Acquariofilia, Accessori Auto 15 Novembre e Kit 72 Ore</h2>
        <p>
          Recensioni ITA seleziona e testa sul campo i migliori prodotti in offerta: attrezzature per <strong>Pesca Sportiva</strong> (canne, mulinelli, artificiali ed ecoscandagli), <strong>Acquariofilia e Aquascaping</strong> (lampade LED, filtri, riscaldatori e hardscape), i <strong>4 Accessori Auto per l'obbligo del 15 Novembre</strong> e il <strong>Kit di Emergenza 72 Ore</strong>. Utilizzando il codice <strong>app39037</strong> sull'app Temu puoi ottenere un pacchetto di coupon da 100€ e il 30% di sconto extra. Per qualsiasi dubbio,{' '}
          <button
            onClick={onOpenSupport}
            style={{ background: 'none', border: 'none', color: 'var(--temu-orange)', fontWeight: '800', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
          >
            contatta la nostra Assistenza Clienti
          </button>.
        </p>
      </section>
    </main>
  );
}

// --- COMPONENTE ROOT ---
export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [repartoAttivo, setRepartoAttivo] = useState('Pesca Sportiva');
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

  const isFishing = repartoAttivo === 'Pesca Sportiva';
  const isAquarium = repartoAttivo === 'Acquariofilia';
  const isWinter = repartoAttivo === 'Auto & Inverno 15 Nov';
  const isApocalypse = repartoAttivo === 'Kit Emergenza 72h';

  return (
    <Router>
      <div
        className={`app-wrapper ${
          isDarkMode || isFishing || isAquarium || isWinter || isApocalypse ? 'dark' : ''
        } ${isFishing ? 'fishing-mode' : ''} ${isAquarium ? 'aquarium-mode' : ''} ${
          isWinter ? 'winter-mode' : ''
        } ${isApocalypse ? 'apocalypse-mode' : ''}`}
      >
        <TopBar />

        <header className="navbar">
          <Link to="/" className="brand-logo" onClick={() => setRepartoAttivo('Pesca Sportiva')}>
            <div className="logo-circle">
              <img src="/logo.png" alt="Logo Recensioni ITA" />
            </div>
            <div className="brand-text">
              <div className="brand-title">
                <strong>Recensioni</strong>
                <span>ITA</span>
              </div>
              <div className="brand-subtitle">Pesca • Acquari • Auto 15 Nov • 72h</div>
            </div>
          </Link>

          <div className="nav-center-trust">
            <button className="trust-item" onClick={() => setRepartoAttivo('Pesca Sportiva')}>
              <span className="trust-dot" style={{ background: '#10b981' }}></span>
              <span style={{ color: isFishing ? '#34d399' : 'inherit' }}>Pesca Sportiva</span>
            </button>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <button className="trust-item" onClick={() => setRepartoAttivo('Acquariofilia')}>
              <span style={{ color: isAquarium ? '#38bdf8' : 'inherit' }}>Acquariofilia</span>
            </button>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <button className="trust-item" onClick={() => setRepartoAttivo('Auto & Inverno 15 Nov')}>
              <span style={{ color: isWinter ? '#38bdf8' : 'inherit' }}>Auto 15 Nov</span>
            </button>
            <span style={{ color: 'var(--border-color)' }}>|</span>
            <button className="trust-item" onClick={() => setRepartoAttivo('Kit Emergenza 72h')}>
              <span style={{ color: isApocalypse ? '#f59e0b' : 'inherit' }}>Kit 72h</span>
            </button>
          </div>

          <div className="nav-actions">
            <button onClick={() => setLegalSection('support')} className="support-nav-btn" title="Assistenza Clienti">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Supporto</span>
            </button>

            <button onClick={() => setIsWheelOpen(true)} className="wheel-trigger-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <Home
                repartoAttivo={repartoAttivo}
                setRepartoAttivo={setRepartoAttivo}
                onOpenWheel={() => setIsWheelOpen(true)}
                onOpenSupport={() => setLegalSection('support')}
              />
            }
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        {/* PULSANTE FLUTTUANTE ASSISTENZA CLIENTI */}
        <button
          className="floating-support-btn"
          onClick={() => setLegalSection('support')}
          aria-label="Assistenza Clienti"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff5500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Assistenza</span>
        </button>

        <WheelModal isOpen={isWheelOpen} onClose={() => setIsWheelOpen(false)} />

        <LegalAndSupportModal
          activeSection={legalSection}
          onClose={() => setLegalSection(null)}
          onSelectSection={(sec) => setLegalSection(sec)}
        />

        <GdprCookieBanner
          isOpen={showGdprBanner}
          onDecision={handleGdprDecision}
          onOpenPolicy={(sec) => setLegalSection(sec)}
        />

        {/* FOOTER */}
        <footer className="site-footer">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Recensioni ITA</h4>
              <p>
                Il portale dedicato agli appassionati di pesca sportiva, acquariofilia, accessori auto invernali e preparazione alle emergenze (Kit 72 Ore).
              </p>
              <p style={{ marginTop: '10px' }}>
                Email Supporto:{' '}
                <a href="mailto:marcocretu0@gmail.com" style={{ color: '#ff5500', textDecoration: 'none', fontWeight: '700' }}>
                  marcocretu0@gmail.com
                </a>
              </p>
            </div>

            <div className="footer-col">
              <h4>Assistenza Clienti</h4>
              <ul className="footer-links">
                <li><button className="footer-link-btn" onClick={() => setLegalSection('support')}>Contatta il Supporto</button></li>
                <li><button className="footer-link-btn" onClick={() => setLegalSection('support')}>Info Resi e Garanzia</button></li>
                <li><button className="footer-link-btn" onClick={() => setIsWheelOpen(true)}>Ruota Bonus Coupon</button></li>
                <li><a href="https://www.youtube.com/@recensioniita9" target="_blank" rel="noopener noreferrer">Canale YouTube Ufficiale</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Informative Legali</h4>
              <ul className="footer-links">
                <li><button className="footer-link-btn" onClick={() => setLegalSection('privacy')}>Privacy Policy</button></li>
                <li><button className="footer-link-btn" onClick={() => setLegalSection('cookie')}>Cookie Policy</button></li>
                <li><button className="footer-link-btn" onClick={() => setLegalSection('terms')}>Termini e Condizioni</button></li>
                <li><button className="footer-link-btn" onClick={() => setShowGdprBanner(true)}>Preferenze Cookie</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Trasparenza Affiliazione</h4>
              <p>
                Partecipiamo ai programmi di affiliazione Temu e AliExpress. Acquistando tramite i nostri link o codici sconto, sostieni gratuitamente il canale senza alcun costo aggiuntivo.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>&copy; {new Date().getFullYear()} Recensioni ITA — Assistenza: marcocretu0@gmail.com</span>
            <span>Codice Sconto Ufficiale: <strong style={{ color: '#ff5500' }}>app39037</strong></span>
          </div>
        </footer>
      </div>
    </Router>
  );
}