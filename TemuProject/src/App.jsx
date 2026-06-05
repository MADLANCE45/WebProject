import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Admin from './Admin'

const repartiMap = {
  '🎣 Pesca Sportiva': {
    'Attrezzatura da Pesca': ['Canne da pesca', 'Mulinelli', 'Esche e Ami', 'Fili e Accessori'],
    'Abbigliamento Tecnico': ['Occhiali polarizzati', 'Cappelli e Visiere', 'Guanti', 'Calzature'],
    'Accessori e Logistica': ['Borse termiche', 'Zaini impermeabili', 'Scatole porta-attrezzi'],
    'Elettronica e Utilità': ['Torce frontali', 'Bilance digitali portatili', 'Powerbank solari']
  },
  '🐠 Acquariofilia': {
    'Vasche e Mobili': ['Acquari in vetro', 'Vaschette in plastica', 'Mobili di supporto', 'Reti da allevamento'],
    'Tecnica e Manutenzione': ['Filtri e Pompe', 'Illuminazione LED', 'Riscaldatori', 'Sistemi CO2'],
    'Allestimento (Hardscape)': ['Rocce e Legni', 'Sabbia e Ghiaia', 'Decorazioni in resina'],
    'Accessori Vari': ['Retini', 'Calamite puliscivetro', 'Mangiatoie automatiche']
  }
};

// --- BANNER PROMOZIONALE AGGIUNTO ---
function PromoBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FF6600 0%, #FF8C00 100%)',
      margin: '0 4% 30px 4%',
      borderRadius: '16px',
      padding: '30px 20px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      boxShadow: '0 10px 25px rgba(255, 102, 0, 0.3)'
    }}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '900', textTransform: 'uppercase' }}>
        🎁 Regalo per i Nuovi Utenti Temu!
      </h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '500' }}>
        Scarica l'app dal nostro link e usa il codice <strong style={{ background: 'white', color: '#FF6600', padding: '4px 10px', borderRadius: '8px', letterSpacing: '1px' }}>RECENSIONI30</strong> per un 30% di sconto sul tuo primo ordine!
      </p>
      <a href="INSERISCI_QUI_IL_TUO_LINK_AFFILIATO_GENERALE" target="_blank" rel="noopener noreferrer" 
         style={{
           background: '#111827',
           color: 'white',
           padding: '14px 30px',
           borderRadius: '50px',
           textDecoration: 'none',
           fontWeight: 'bold',
           fontSize: '16px',
           transition: 'transform 0.2s',
           display: 'inline-block'
         }}
         onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
         onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
        Riscatta Sconto Ora
      </a>
    </div>
  );
}

// --- CAROSELLO MIGLIORATO (Meno scuro) ---
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slides = [
    { 
      id: 1, 
      image: 'https://images.unsplash.com/photo-1510253687831-0f9829983949?q=80&w=2070&auto=format&fit=crop', 
      title: 'Attrezzatura da Pesca 🎣', 
      subtitle: 'La migliore attrezzatura selezionata da Temu per le tue avventure.' 
    },
    { 
      id: 2, 
      image: 'https://images.unsplash.com/photo-1543886567-54876b509bc9?q=80&w=2070&auto=format&fit=crop', 
      title: 'Aquascaping Perfetto 🐠', 
      subtitle: 'Vasche, filtri e decorazioni a prezzi imbattibili.' 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1)), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '450px', overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
      {slides.map((slide, index) => (
        <div key={slide.id} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `linear-gradient(rgba(0,0,0, 0.2), rgba(0,0,0, 0.7)), url(${slide.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: current === index ? 1 : 0, transition: 'opacity 1s ease-in-out',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', padding: '0 20px'
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '0 0 10px 0', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
            {slide.title}
          </h1>
          <p style={{ fontSize: '20px', maxWidth: '600px', fontWeight: '400', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {slide.subtitle}
          </p>
        </div>
      ))}
    </div>
  )
}

function CookieBanner() {
  const [visibile, setVisibile] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('cookie_accettati')) setVisibile(true);
  }, []);
  const accettaCookie = () => { localStorage.setItem('cookie_accettati', 'true'); setVisibile(false); }
  if (!visibile) return null;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111827', color: '#fff', padding: '15px 4%', zIndex: 9999, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
      <p style={{ margin: 0, fontSize: '13px', flex: 1 }}>Utilizziamo i link affiliati Temu. Acquistando supporti il canale YouTube <strong>senza rincari</strong> sul tuo prezzo.</p>
      <button onClick={accettaCookie} style={{ background: '#FF6600', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>OK, ho capito</button>
    </div>
  )
}

// --- VETRINA PUBBLICA (Tema Chiaro Moderno) ---
function Home() {
  const [prodotti, setProdotti] = useState([])
  const [repartoAttivo, setRepartoAttivo] = useState('🎣 Pesca Sportiva')
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte')
  const [filtroSottocategoria, setFiltroSottocategoria] = useState('Tutte') 
  const [ricerca, setRicerca] = useState('')

  useEffect(() => { ottieniProdotti() }, [])

  async function ottieniProdotti() {
    const { data, error } = await supabase.from('products').select('*')
    if (!error) setProdotti(data)
  }

  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto)
    setFiltroCategoria('Tutte')
    setFiltroSottocategoria('Tutte')
    setRicerca('')
  }

  const prodottiFiltrati = prodotti.filter(p => {
    let passaReparto = p.reparto === repartoAttivo || (!p.reparto && repartoAttivo === '🎣 Pesca Sportiva');
    let passaRicerca = p.titolo.toLowerCase().includes(ricerca.toLowerCase());
    let passaCategoria = filtroCategoria === 'Tutte' || p.categoria === filtroCategoria;
    let passaSottocategoria = filtroSottocategoria === 'Tutte' || p.sottocategoria === filtroSottocategoria;
    return passaReparto && passaRicerca && passaCategoria && passaSottocategoria;
  });

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#F9FAFB', paddingBottom: '100px', minHeight: '100vh', color: '#111827' }}>
      
      <HeroSlider />

      {/* REPARTI MACRO - Design Pulito */}
      <div style={{ display: 'flex', width: '100%', background: 'white', borderBottom: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div onClick={() => cambiaReparto('🎣 Pesca Sportiva')} 
             style={{ flex: 1, textAlign: 'center', padding: '25px 10px', cursor: 'pointer', fontWeight: '800', fontSize: '20px',
                      color: repartoAttivo === '🎣 Pesca Sportiva' ? '#FF6600' : '#6B7280', 
                      borderBottom: repartoAttivo === '🎣 Pesca Sportiva' ? '4px solid #FF6600' : '4px solid transparent' }}>
          🎣 PESCA SPORTIVA
        </div>
        <div onClick={() => cambiaReparto('🐠 Acquariofilia')} 
             style={{ flex: 1, textAlign: 'center', padding: '25px 10px', cursor: 'pointer', fontWeight: '800', fontSize: '20px',
                      color: repartoAttivo === '🐠 Acquariofilia' ? '#FF6600' : '#6B7280', 
                      borderBottom: repartoAttivo === '🐠 Acquariofilia' ? '4px solid #FF6600' : '4px solid transparent' }}>
          🐠 ACQUARIOFILIA
        </div>
      </div>

      <div style={{ padding: '40px 4%' }}>
        
        {/* BANNER INSERITO QUI */}
        <PromoBanner />

        {/* FILTRI CHIARE E MODERNI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
            <button onClick={() => setFiltroCategoria('Tutte')} style={{ padding: '8px 20px', borderRadius: '50px', border: 'none', background: filtroCategoria === 'Tutte' ? '#111827' : '#E5E7EB', color: filtroCategoria === 'Tutte' ? 'white' : '#374151', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tutte le Categorie</button>
            {Object.keys(repartiMap[repartoAttivo]).map(cat => (
              <button key={cat} onClick={() => {setFiltroCategoria(cat); setFiltroSottocategoria('Tutte');}} style={{ padding: '8px 20px', borderRadius: '50px', border: 'none', background: filtroCategoria === cat ? '#111827' : '#E5E7EB', color: filtroCategoria === cat ? 'white' : '#374151', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{cat}</button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Cerca prodotto..." value={ricerca} onChange={(e) => setRicerca(e.target.value)} style={{ flex: 1, minWidth: '250px', padding: '12px 20px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none' }} />
          </div>
        </div>

        {/* GRIGLIA PRODOTTI STILE E-COMMERCE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {prodottiFiltrati.map((prodotto) => (
            <div key={prodotto.id} style={{ background: 'white', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px rgba(0,0,0,0.04)', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-5px)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              
              <div style={{ height: '200px', width: '100%', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F9FAFB', borderRadius: '8px', overflow: 'hidden' }}>
                {prodotto.immagine_url ? (
                  <img src={prodotto.immagine_url} alt={prodotto.titolo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ color: '#9CA3AF' }}>Immagine</span>
                )}
              </div>
              
              <h3 title={prodotto.titolo} style={{ fontSize: '15px', margin: '0 0 8px 0', color: '#111827', lineHeight: '1.4', fontWeight: '600', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prodotto.titolo}</h3>
              <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 15px 0' }}>{prodotto.sottocategoria}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontWeight: '800', fontSize: '20px', color: '#111827' }}>€ {prodotto.prezzo}</span>
                <a href={prodotto.link_affiliazione} target="_blank" rel="noopener noreferrer" style={{ background: '#FF6600', color: 'white', padding: '10px 15px', textDecoration: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', transition: 'background 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#E65C00'} onMouseLeave={(e) => e.target.style.background = '#FF6600'}>
                  Vedi su Temu
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <CookieBanner />
        
        {/* NAVBAR BIANCA E PULITA */}
        <nav style={{ padding: '15px 4%', background: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#111827', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: '900' }}>
              Recensioni<span style={{ color: '#FF6600' }}>ITA</span>
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {/* Link YouTube */}
            <a href="https://youtube.com/@recensioniita9?si=Rdg3mXWsViQtWvup" target="_blank" rel="noopener noreferrer">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <Link to="/admin" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>Admin</Link>
          </div>
        </nav>
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        
        <footer style={{ background: '#111827', color: '#9CA3AF', padding: '40px 4%', textAlign: 'center', fontSize: '14px' }}>
          <p style={{ margin: '0 0 10px 0', color: 'white', fontWeight: 'bold' }}>Sostieni il canale Recensioni ITA acquistando tramite i nostri link affiliati!</p>
          &copy; {new Date().getFullYear()} Recensioni ITA. Tutti i diritti riservati.
        </footer>
      </div>
    </Router>
  )
}

export default App