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

// --- CAROSELLO CON IMMAGINI SPETTACOLARI E TEMA DARK ---
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slides = [
    { 
      id: 1, 
      image: 'https://images.unsplash.com/photo-1510253687831-0f9829983949?q=80&w=2070&auto=format&fit=crop', 
      title: 'Momenti di Pesca 🎣', 
      subtitle: 'Attrezzatura premium per trasformare ogni lancio in un tramonto indimenticabile.' 
    },
    { 
      id: 2, 
      image: 'https://images.unsplash.com/photo-1543886567-54876b509bc9?q=80&w=2070&auto=format&fit=crop', 
      title: 'Scenografie Sommerse 🐠', 
      subtitle: 'Vasche spettacolari e accessori per dare vita ad aquascape da sogno.' 
    },
    { 
      id: 3, 
      image: 'https://images.unsplash.com/photo-1620803154860-244e8c15c898?q=80&w=2070&auto=format&fit=crop', 
      title: 'I Prezzi di Temu 🔥', 
      subtitle: 'La selezione di Recensioni ITA per garantirti il risparmio che cerchi.' 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1)), 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '550px', overflow: 'hidden', backgroundColor: '#0B132B' }}>
      {slides.map((slide, index) => (
        <div key={slide.id} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: `linear-gradient(rgba(11, 19, 43, 0.4), rgba(11, 19, 43, 0.95)), url(${slide.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: current === index ? 1 : 0, transition: 'opacity 1.2s ease-in-out',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', padding: '0 20px'
        }}>
          <h1 style={{ fontSize: '56px', fontWeight: '900', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '3px', textShadow: '0 4px 15px rgba(0,0,0,0.8)', transform: current === index ? 'scale(1)' : 'scale(0.95)', transition: 'transform 1.2s ease-out' }}>
            {slide.title}
          </h1>
          <p style={{ fontSize: '20px', maxWidth: '700px', lineHeight: '1.6', color: '#E0FBFC', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontWeight: '300' }}>
            {slide.subtitle}
          </p>
          <button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} style={{ marginTop: '40px', padding: '16px 40px', fontSize: '18px', fontWeight: 'bold', background: '#F97316', color: '#0B132B', border: 'none', borderRadius: '50px', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 8px 25px rgba(249, 115, 22, 0.5)' }} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(249, 115, 22, 0.7)'}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(249, 115, 22, 0.5)'}}>
            Scopri i Prodotti
          </button>
        </div>
      ))}
      <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '15px' }}>
        {slides.map((_, idx) => (
          <div key={idx} onClick={() => setCurrent(idx)} style={{ width: '10px', height: '10px', borderRadius: '50%', background: current === idx ? '#F97316' : 'rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'background 0.3s', transform: current === idx ? 'scale(1.5)' : 'scale(1)' }} />
        ))}
      </div>
    </div>
  )
}

function CookieBanner() {
  const [visibile, setVisibile] = useState(false);
  useEffect(() => {
    const cookieAccettati = localStorage.getItem('cookie_accettati');
    if (!cookieAccettati) setVisibile(true);
  }, []);
  const accettaCookie = () => { localStorage.setItem('cookie_accettati', 'true'); setVisibile(false); }
  if (!visibile) return null;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1C2541', color: '#fff', padding: '20px 4%', zIndex: 9999, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderTop: '2px solid #F97316', boxShadow: '0 -10px 30px rgba(0,0,0,0.5)' }}>
      <p style={{ margin: 0, fontSize: '14px', flex: 1, minWidth: '300px', lineHeight: '1.6', color: '#9CA3AF' }}>
        <strong style={{ color: 'white' }}>Informativa Privacy & Affiliazioni:</strong> Utilizziamo i cookie. Acquistando tramite i nostri link Temu, supporti Recensioni ITA ricevendo una piccola commissione <strong>senza alcun rincaro sul prezzo finale</strong>.
      </p>
      <button onClick={accettaCookie} style={{ background: '#F97316', color: '#1C2541', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>Accetto</button>
    </div>
  )
}

function Footer() {
  return (
    <footer style={{ background: '#0B132B', color: '#9CA3AF', padding: '60px 4% 40px 4%', marginTop: 'auto', borderTop: '1px solid #1C2541' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>Supporta Recensioni ITA</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#6B7280' }}>Siamo affiliati al programma Temu. Le nostre selezioni sono indipendenti e pensate per offrirti le migliori occasioni sui mercati della pesca e dell'acquariofilia. Un click non ti costa nulla, ma aiuta il canale a crescere.</p>
        </div>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>Unisciti a Noi</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#6B7280', marginBottom: '20px' }}>Video settimanali, unboxing e recensioni sincere dei prodotti proposti sul sito.</p>
          <a href="https://youtube.com/@recensioniita9?si=Rdg3mXWsViQtWvup" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#DC2626', color: 'white', padding: '12px 25px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '15px', transition: 'background 0.2s', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }} onMouseEnter={(e) => e.currentTarget.style.background = '#991B1B'} onMouseLeave={(e) => e.currentTarget.style.background = '#DC2626'}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            Iscriviti su YouTube
          </a>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '60px', borderTop: '1px solid #1C2541', paddingTop: '25px', fontSize: '13px', color: '#4B5563' }}>&copy; {new Date().getFullYear()} Recensioni ITA. Tutti i diritti riservati.</div>
    </footer>
  )
}

// --- LA VETRINA PUBBLICA (Tema Dark Ocean) ---
function Home() {
  const [prodotti, setProdotti] = useState([])
  const [repartoAttivo, setRepartoAttivo] = useState('🎣 Pesca Sportiva')
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte')
  const [filtroSottocategoria, setFiltroSottocategoria] = useState('Tutte') 
  const [filtroPrezzo, setFiltroPrezzo] = useState('Tutti')
  const [ricerca, setRicerca] = useState('')
  const [paginaCorrente, setPaginaCorrente] = useState(1)
  const prodottiPerPagina = 18

  useEffect(() => { ottieniProdotti() }, [])
  useEffect(() => { setPaginaCorrente(1) }, [repartoAttivo, filtroCategoria, filtroSottocategoria, filtroPrezzo, ricerca])

  async function ottieniProdotti() {
    const { data, error } = await supabase.from('products').select('*')
    if (!error) setProdotti(data)
  }

  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto)
    setFiltroCategoria('Tutte')
    setFiltroSottocategoria('Tutte')
    setFiltroPrezzo('Tutti')
    setRicerca('')
  }

  const cambiaCategoria = (nuovaCat) => {
    setFiltroCategoria(nuovaCat)
    setFiltroSottocategoria('Tutte') 
  }

  const prodottiDelReparto = prodotti.filter(p => p.reparto === repartoAttivo || (!p.reparto && repartoAttivo === '🎣 Pesca Sportiva'))
  const prodottiFiltrati = prodottiDelReparto.filter(prodotto => {
    let passaRicerca = prodotto.titolo.toLowerCase().includes(ricerca.toLowerCase()) || prodotto.sottocategoria.toLowerCase().includes(ricerca.toLowerCase());
    let passaCategoria = filtroCategoria === 'Tutte' || prodotto.categoria === filtroCategoria;
    let passaSottocategoria = filtroSottocategoria === 'Tutte' || prodotto.sottocategoria === filtroSottocategoria;
    
    let passaPrezzo = true;
    if (filtroPrezzo === 'sotto_20') passaPrezzo = prodotto.prezzo < 20;
    if (filtroPrezzo === '20_50') passaPrezzo = prodotto.prezzo >= 20 && prodotto.prezzo <= 50;
    if (filtroPrezzo === 'sopra_50') passaPrezzo = prodotto.prezzo > 50;
    
    return passaRicerca && passaCategoria && passaSottocategoria && passaPrezzo;
  });

  const indiceUltimoProdotto = paginaCorrente * prodottiPerPagina
  const indicePrimoProdotto = indiceUltimoProdotto - prodottiPerPagina
  const prodottiVisualizzati = prodottiFiltrati.slice(indicePrimoProdotto, indiceUltimoProdotto)
  const numeroPagine = Math.ceil(prodottiFiltrati.length / prodottiPerPagina)

  return (
    // IL NUOVO SFONDO DARK (#0B132B)
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#0B132B', paddingBottom: '100px', minHeight: '100vh', color: 'white' }}>
      
      <HeroSlider />

      {/* REPARTI MACRO - Tema Sincronizzato con il Dark Mode */}
      <div style={{ display: 'flex', width: '100%', background: '#1C2541', borderBottom: '1px solid #3A506B' }}>
        <div onClick={() => cambiaReparto('🎣 Pesca Sportiva')} 
             style={{ flex: 1, textAlign: 'center', padding: '35px 10px', cursor: 'pointer', fontWeight: '900', fontSize: '26px', letterSpacing: '2px',
                      color: repartoAttivo === '🎣 Pesca Sportiva' ? '#F97316' : '#6B7280', 
                      backgroundColor: repartoAttivo === '🎣 Pesca Sportiva' ? '#0B132B' : '#1C2541', 
                      borderTop: repartoAttivo === '🎣 Pesca Sportiva' ? '6px solid #F97316' : '6px solid transparent', 
                      transition: 'all 0.3s' }}>
          🎣 PESCA SPORTIVA
        </div>
        <div onClick={() => cambiaReparto('🐠 Acquariofilia')} 
             style={{ flex: 1, textAlign: 'center', padding: '35px 10px', cursor: 'pointer', fontWeight: '900', fontSize: '26px', letterSpacing: '2px',
                      color: repartoAttivo === '🐠 Acquariofilia' ? '#F97316' : '#6B7280', 
                      backgroundColor: repartoAttivo === '🐠 Acquariofilia' ? '#0B132B' : '#1C2541', 
                      borderTop: repartoAttivo === '🐠 Acquariofilia' ? '6px solid #F97316' : '6px solid transparent', 
                      transition: 'all 0.3s' }}>
          🐠 ACQUARIOFILIA
        </div>
      </div>

      {/* PANNELLO FILTRI A ISOLA SULLO SFONDO DARK */}
      <div style={{ background: '#1C2541', margin: '40px 4% 30px 4%', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Categorie:</span>
          <button onClick={() => cambiaCategoria('Tutte')} style={{ padding: '10px 22px', borderRadius: '30px', border: '1px solid #3A506B', background: filtroCategoria === 'Tutte' ? '#F97316' : 'transparent', color: filtroCategoria === 'Tutte' ? '#0B132B' : '#E0FBFC', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.2s' }}>Tutte</button>
          {Object.keys(repartiMap[repartoAttivo]).map(cat => (
            <button key={cat} onClick={() => cambiaCategoria(cat)} style={{ padding: '10px 22px', borderRadius: '30px', border: '1px solid #3A506B', background: filtroCategoria === cat ? '#F97316' : 'transparent', color: filtroCategoria === cat ? '#0B132B' : '#E0FBFC', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'all 0.2s' }}>{cat}</button>
          ))}
        </div>

        {filtroCategoria !== 'Tutte' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '25px', paddingLeft: '20px', borderLeft: '3px solid #3A506B' }}>
            <button onClick={() => setFiltroSottocategoria('Tutte')} style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', border: 'none', background: filtroSottocategoria === 'Tutte' ? '#3A506B' : '#0B132B', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Tutto</button>
            {repartiMap[repartoAttivo][filtroCategoria].map(sub => (
              <button key={sub} onClick={() => setFiltroSottocategoria(sub)} style={{ padding: '8px 16px', fontSize: '13px', borderRadius: '8px', border: 'none', background: filtroSottocategoria === sub ? '#3A506B' : '#0B132B', color: '#9CA3AF', cursor: 'pointer' }}>{sub}</button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', background: '#0B132B', padding: '20px', borderRadius: '12px', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '250px', display: 'flex', alignItems: 'center', background: '#1C2541', border: '1px solid #3A506B', borderRadius: '8px', padding: '0 15px' }}>
            <span style={{ color: '#6B7280', fontSize: '18px' }}>🔍</span>
            <input type="text" placeholder={`Cerca in ${repartoAttivo.split(' ')[1]}...`} value={ricerca} onChange={(e) => setRicerca(e.target.value)} style={{ width: '100%', padding: '15px 10px', border: 'none', outline: 'none', fontSize: '15px', color: 'white', background: 'transparent' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#9CA3AF' }}>Prezzo:</span>
            <select value={filtroPrezzo} onChange={(e) => setFiltroPrezzo(e.target.value)} style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid #3A506B', background: '#1C2541', cursor: 'pointer', outline: 'none', fontSize: '15px', color: 'white', fontWeight: 'bold' }}>
              <option value="Tutti">Qualsiasi</option>
              <option value="sotto_20">Fino a 20 €</option>
              <option value="20_50">Da 20 a 50 €</option>
              <option value="sopra_50">Oltre 50 €</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRIGLIA PRODOTTI IN DARK MODE */}
      <div style={{ padding: '10px 4%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '15px', borderBottom: '1px solid #1C2541' }}>
          <h2 style={{ margin: 0, color: 'white', fontSize: '26px', fontWeight: '900', letterSpacing: '1px' }}>
            {ricerca ? `Risultati per "${ricerca}"` : (filtroSottocategoria !== 'Tutte' ? filtroSottocategoria : (filtroCategoria !== 'Tutte' ? filtroCategoria : 'In Evidenza'))} 
            <span style={{ color: '#F97316', fontSize: '18px', marginLeft: '15px', fontWeight: 'bold' }}>{prodottiFiltrati.length} articoli</span>
          </h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '30px' }}>
          {prodottiVisualizzati.map((prodotto) => (
            <div key={prodotto.id} style={{ background: '#1C2541', border: '1px solid #3A506B', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', transition: 'all 0.3s ease', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4); border-color: #F97316'; e.currentTarget.style.transform = 'translateY(-8px)' }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2); border-color: #3A506B'; e.currentTarget.style.transform = 'translateY(0)' }}>
              
              <a href={prodotto.link_affiliazione} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '220px', width: '100%', marginBottom: '20px', textDecoration: 'none', background: 'white', borderRadius: '12px', padding: '10px' }}>
                {prodotto.immagine_url ? (
                  <img src={prodotto.immagine_url} alt={prodotto.titolo} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '14px', fontWeight: 'bold' }}>Nessuna foto</div>
                )}
              </a>
              
              <h3 title={prodotto.titolo} style={{ fontSize: '16px', margin: '0 0 10px 0', color: 'white', lineHeight: '1.5', fontWeight: 'bold', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', height: '48px' }}>{prodotto.titolo}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '13px', margin: '0 0 20px 0', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{prodotto.sottocategoria}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #3A506B', paddingTop: '20px' }}>
                <span style={{ fontWeight: '900', fontSize: '24px', color: '#E0FBFC' }}>€ {prodotto.prezzo}</span>
                <a href={prodotto.link_affiliazione} target="_blank" rel="noopener noreferrer" style={{ background: '#F97316', color: '#0B132B', padding: '12px 20px', textDecoration: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '900', textAlign: 'center', transition: 'background 0.2s', boxShadow: '0 4px 10px rgba(249, 115, 22, 0.3)' }} onMouseEnter={(e) => e.target.style.background = '#ea580c'} onMouseLeave={(e) => e.target.style.background = '#F97316'}>
                  Ordina su Temu
                </a>
              </div>
            </div>
          ))}
        </div>

        {prodottiFiltrati.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: '#1C2541', borderRadius: '16px', border: '2px dashed #3A506B', marginTop: '30px' }}>
            <p style={{ color: '#9CA3AF', fontSize: '20px', fontWeight: 'bold' }}>Non ci sono prodotti che corrispondono a questi criteri.</p>
            <button onClick={() => cambiaCategoria('Tutte')} style={{ marginTop: '25px', padding: '12px 30px', background: 'transparent', border: '2px solid #F97316', color: '#F97316', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.3s' }} onMouseEnter={(e)=>{e.currentTarget.style.background='#F97316'; e.currentTarget.style.color='#0B132B'}} onMouseLeave={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#F97316'}}>Reset Filtri</button>
          </div>
        )}

        {numeroPagine > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '60px', paddingTop: '30px', borderTop: '1px solid #3A506B' }}>
            <button onClick={() => setPaginaCorrente(prev => Math.max(prev - 1, 1))} disabled={paginaCorrente === 1} style={{ padding: '12px 25px', background: paginaCorrente === 1 ? '#0B132B' : '#1C2541', color: paginaCorrente === 1 ? '#3A506B' : 'white', border: '1px solid #3A506B', borderRadius: '8px', cursor: paginaCorrente === 1 ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}>&laquo; Indietro</button>
            <span style={{ color: '#9CA3AF', fontSize: '16px', fontWeight: 'bold' }}>Pagina <span style={{ color: 'white' }}>{paginaCorrente}</span> di {numeroPagine}</span>
            <button onClick={() => setPaginaCorrente(prev => Math.min(prev + 1, numeroPagine))} disabled={paginaCorrente === numeroPagine} style={{ padding: '12px 25px', background: paginaCorrente === numeroPagine ? '#0B132B' : '#1C2541', color: paginaCorrente === numeroPagine ? '#3A506B' : 'white', border: '1px solid #3A506B', borderRadius: '8px', cursor: paginaCorrente === numeroPagine ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px' }}>Avanti &raquo;</button>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0B132B' }}>
        <CookieBanner />
        <nav style={{ padding: '20px 4%', background: '#0B132B', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid #1C2541' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '1px' }}>
              Recensioni<span style={{ color: '#F97316' }}>ITA</span>
            </span>
          </Link>
          <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            <a href="https://youtube.com/@recensioniita9?si=Rdg3mXWsViQtWvup" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '5px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="#F97316"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 'bold' }}>Negozio</Link>
            <Link to="/admin" style={{ color: '#6B7280', textDecoration: 'none', fontSize: '16px', fontWeight: '500' }}>Pannello Admin</Link>
          </div>
        </nav>
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App