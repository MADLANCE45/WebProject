import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import Header from './Header';
import ProductModal from './ProductModal';
import StarRating from './StarRating';
import ProductCard from './ProductCard';
import WheelOfFortune from './WheelOfFortune';
import ProductFinder from './ProductFinder';

// ---> INCOLLA LA MAPPA QUI <---
const repartiMap = {
  '🎣 Pesca Sportiva': {
    'Attrezzatura da Pesca': ['Canne da pesca', 'Mulinelli', 'Esche e Ami', 'Fili e Accessori'],
    'Abbigliamento Tecnico': ['Occhiali polarizzati', 'Cappelli e Visiere', 'Guanti', 'Calzature'],
    'Accessori e Logistica': ['Borse termiche', 'Zaini impermeabili', 'Scatole porta-attrezzi'],
    'Elettronica e Utilità': ['Ecoscandagli e Sonar', 'Bilance digitali', 'Torce frontali e Lampade', 'Action Cam e Supporti', 'Powerbank solari']
  },
  '🐠 Acquariofilia': {
    'Vasche e Mobili': ['Acquari in vetro', 'Vaschette in plastica', 'Mobili di supporto', 'Reti da allevamento'],
    'Tecnica e Manutenzione': ['Filtri e Pompe', 'Illuminazione LED', 'Riscaldatori', 'Sistemi CO2'],
    'Allestimento (Hardscape)': ['Rocce e Legni', 'Sabbia e Ghiaia', 'Decorazioni in resina'],
    'Accessori Vari': ['Retini', 'Calamite puliscivetro', 'Mangiatoie automatiche']
  },
  '🏕️ Campeggio e Bivacco': {
    'Tende e Riposo': ['Tende da campeggio', 'Sacchi a pelo', 'Sedie e Lettini'],
    'Cucina da Campo': ['Fornelli a gas', 'Thermos e Borracce', 'Pentolame compatto'],
    'Utensili e Accessori': ['Torce e Lampade', 'Coltelli multiuso', 'Zaini', 'Repellenti zanzare']
  }
};

export default function Home({ isDarkMode }) {
  const [prodotti, setProdotti] = useState([]);
  const [repartoAttivo, setRepartoAttivo] = useState('🎣 Pesca Sportiva');
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte');
  const [filtroSottocategoria, setFiltroSottocategoria] = useState('Tutte'); 
  const [filtroPrezzo, setFiltroPrezzo] = useState('Tutti');
  const [ricerca, setRicerca] = useState('');
  const [filtroSconto, setFiltroSconto] = useState('Tutti'); 
  const [popupClosed, setPopupClosed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const prodottiPerPagina = 20;

  // 1. Il tuo useEffect che carica e mescola i prodotti
  useEffect(() => {
    async function getProdotti() {
      const { data } = await supabase.from('products').select('*');
      if (data) {
        // Ordinati dal più recente al più vecchio (fissi, senza rimescolamento casuale)
        const prodottiOrdinati = data.sort((a, b) => b.id - a.id);
        setProdotti(prodottiOrdinati);
      }
    }
    getProdotti();
  }, []);

  // 2. IL NUOVO useEffect DA INCOLLARE QUI SOTTO:
  // Resetta sempre alla pagina 1 quando l'utente cambia un qualsiasi filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [repartoAttivo, filtroCategoria, filtroSottocategoria, filtroPrezzo, filtroSconto, ricerca]);
  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto); 
    setFiltroCategoria('Tutte'); 
    setFiltroSottocategoria('Tutte'); 
    setFiltroPrezzo('Tutti'); 
    setRicerca('');
    setFiltroSconto('Tutti'); 
  }

  const prodottiFiltrati = prodotti.filter(p => {
    let passaReparto = p.reparto === repartoAttivo || (!p.reparto && repartoAttivo === '🎣 Pesca Sportiva');
    let passaRicerca = p.titolo ? p.titolo.toLowerCase().includes(ricerca.toLowerCase()) : false;
    
    // LA MAGIA È QUI: Controlliamo se la parola selezionata corrisponde 
    // alla Categoria (es. "Attrezzatura") OPPURE alla Sottocategoria (es. "Mulinelli")
    let passaCategoria = 
      filtroCategoria === 'Tutte' || 
      p.categoria === filtroCategoria || 
      p.sottocategoria === filtroCategoria;
    
    let passaSottocategoria = filtroSottocategoria === 'Tutte' || p.sottocategoria === filtroSottocategoria;
    
    let passaPrezzo = true;
    if (p.prezzo) {
      const prezzoNum = parseFloat(p.prezzo.toString().replace(',', '.'));
      if (filtroPrezzo === '0-10') passaPrezzo = prezzoNum < 10;
      else if (filtroPrezzo === '10-30') passaPrezzo = prezzoNum >= 10 && prezzoNum <= 30;
      else if (filtroPrezzo === '30+') passaPrezzo = prezzoNum > 30;
    }

    let passaSconto = true;
    if (filtroSconto !== 'Tutti') {
      const scontoGenerato = 45 + ((p.id * 3) % 30);
      passaSconto = scontoGenerato >= parseInt(filtroSconto);
    }

    return passaReparto && passaRicerca && passaCategoria && passaSottocategoria && passaPrezzo && passaSconto;
  });

  const bgPrincipale = isDarkMode ? '#111827' : '#F9FAFB';
  const textPrincipale = isDarkMode ? '#F3F4F6' : '#111827';
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#374151' : '#E5E7EB';

  const indiceUltimoProdotto = currentPage * prodottiPerPagina;
  const indicePrimoProdotto = indiceUltimoProdotto - prodottiPerPagina;
  
  const prodottiPaginati = prodottiFiltrati.slice(indicePrimoProdotto, indiceUltimoProdotto);
  const totalePagine = Math.ceil(prodottiFiltrati.length / prodottiPerPagina);

return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: bgPrincipale, paddingBottom: '100px', minHeight: '100vh', color: textPrincipale }}>
      
      {/* 1. POPUP E INTERFACCIE SULLO SCHERMO (Overlay fissi) */}
      {/* 1. POPUP E INTERFACCIE SULLO SCHERMO (Overlay fissi) */}
      <WheelOfFortune isDarkMode={isDarkMode} />
      <ToastPromo />
      <ExitIntentPopup isDarkMode={isDarkMode} />
      <FakeSalesToast prodotti={prodotti} isDarkMode={isDarkMode} />
      
      {/* IL NOSTRO NUOVO ASSISTENTE BOT */}
      <ProductFinder 
        isDarkMode={isDarkMode}
        cambiaReparto={cambiaReparto}
        setFiltroCategoria={setFiltroCategoria}
        setRicerca={setRicerca}
      />
      
      {/* 2. SLIDER DEI BANNER PRINCIPALI */}
      <HeroSlider />
      
      {/* 3. MENU DELLE CATEGORIE (HEADER) */}
      <Header 
        repartiMap={repartiMap}
        repartoAttivo={repartoAttivo}
        setRepartoAttivo={cambiaReparto}
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        isDarkMode={isDarkMode}
      />

      {/* 4. BANNER PROMOZIONALE REGALO NUOVO UTENTE (Orizzontale tra Header e Prodotti) */}
      <PromoBanner />

      {/* 5. IL RESTO DELLA PAGINA (Filtri e Griglia Prodotti) */}
      <div style={{ padding: '20px 0' }}>
      
        {/* Barra di ricerca e Filtri per prezzo/sconto */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px', padding: '0 4%' }}>
          <input 
             type="text" 
             placeholder="Cerca prodotto..." 
             value={ricerca} 
             onChange={(e) => setRicerca(e.target.value)} 
             style={{ flex: 2, minWidth: '200px', padding: '14px 20px', borderRadius: '12px', border: `2px solid ${cardBorder}`, background: cardBg, color: textPrincipale, outline: 'none', fontSize: '16px' }} 
          />
          
          <select 
             value={filtroPrezzo} 
             onChange={(e) => setFiltroPrezzo(e.target.value)} 
             style={{ flex: 1, minWidth: '150px', padding: '14px 20px', borderRadius: '12px', border: `2px solid ${cardBorder}`, background: cardBg, color: textPrincipale, outline: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            <option value="Tutti">Tutti i prezzi</option>
            <option value="0-10">Sotto i 10 €</option>
            <option value="10-30">Tra 10 € e 30 €</option>
            <option value="30+">Oltre 30 €</option>
          </select>

          <select 
             value={filtroSconto} 
             onChange={(e) => setFiltroSconto(e.target.value)} 
             style={{ flex: 1, minWidth: '150px', padding: '14px 20px', borderRadius: '12px', border: `2px solid ${cardBorder}`, background: cardBg, color: textPrincipale, outline: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            <option value="Tutti">Tutti gli sconti</option>
            <option value="30">Offerte 30% e oltre</option>
            <option value="50">Offerte 50% e oltre</option>
            <option value="70">Offerte 70% e oltre</option>
          </select>
        </div>

        {/* Griglia dei Prodotti */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', padding: '0 4%' }}>
          {prodottiPaginati.map((prodotto) => {
            const prezzoNum = prodotto.prezzo ? parseFloat(prodotto.prezzo.toString().replace(',', '.')) : 0;
            const prezzoBarrato = (prezzoNum * 1.3).toFixed(2);
            const scontoPercentuale = 45 + ((prodotto.id * 3) % 30);

            return (
                <Link 
                  to={`/prodotto/${prodotto.id}`}
                  key={prodotto.id} 
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', padding: '15px', borderRadius: '20px', background: cardBg, border: 'none', boxShadow: isDarkMode ? '0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(15,23,42,0.06)', transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#FF6600', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', zIndex: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Temu Pick
                </span>

                <div style={{ position: 'relative', height: '180px', width: '100%', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDarkMode ? '#111827' : '#F9FAFB', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#EF4444', color: 'white', padding: '4px 8px', borderRadius: '20px', fontSize: '13px', fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 5 }}>
                    -{scontoPercentuale}%
                  </div>
                  {prodotto.immagine_url ? (
                    <img src={prodotto.immagine_url} alt={prodotto.titolo} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/e5e7eb/6b7280?text=Immagine+Non+Disponibile'; }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : <span style={{ color: '#9CA3AF' }}>No Img</span>}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '900', fontSize: '24px', color: '#FF6600' }}>€ {prodotto.prezzo}</span>
                  <span style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'line-through' }}>{prezzoBarrato}€</span>
                </div>

                <h3 title={prodotto.titolo} style={{ fontSize: '14px', margin: '0 0 8px 0', color: textPrincipale, lineHeight: '1.3', fontWeight: '700', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px' }}>
                  {prodotto.titolo}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', fontSize: '12px' }}>
                  <div style={{ color: '#EF4444', fontWeight: '600', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚡ Offerta Lampo</span> 
                    <span style={{ color: '#D1D5DB' }}>|</span> 
                    <span style={{ color: '#059669' }}>+500 venduti</span>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto', background: isDarkMode ? '#374151' : '#111827', color: 'white', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                  Scopri Dettagli
                </div>
              </Link>
            );
          })}
        </div>
      </div>
          
      {/* Impaginazione dei Prodotti */}
      {totalePagine > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px', paddingBottom: '20px' }}>
          
          <button 
            onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo(0, 0); }} 
            disabled={currentPage === 1}
            style={{ background: currentPage === 1 ? (isDarkMode ? '#374151' : '#E5E7EB') : '#FF6600', color: currentPage === 1 ? '#9CA3AF' : 'white', padding: '12px 25px', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            ← Precedente
          </button>
          
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: isDarkMode ? '#F9FAFB' : '#111827' }}>
            Pagina {currentPage} di {totalePagine}
          </span>
          
          <button 
            onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalePagine)); window.scrollTo(0, 0); }} 
            disabled={currentPage === totalePagine}
            style={{ background: currentPage === totalePagine ? (isDarkMode ? '#374151' : '#E5E7EB') : '#FF6600', color: currentPage === totalePagine ? '#9CA3AF' : 'white', padding: '12px 25px', borderRadius: '50px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: currentPage === totalePagine ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            Successiva →
          </button>
          
        </div>
      )}
    </div>
  );
}
// --- HERO SLIDER ---
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slides = [
    { id: 1, image: '/banner.jpg', title: 'Attrezzatura da Pesca Pro 🎣', subtitle: 'Ecoscandagli, mulinelli ed esche testate per te.' },
    { id: 2, image: '/banner2.jpg', title: 'Acquascaping Perfetto 🐠', subtitle: 'Illuminazione LED e filtri a prezzi imbattibili.' },
    { id: 3, image: '/banner10.jpg', title: 'Avventura Outdoor 🏕️', subtitle: 'Tende, riposo e cucina da campo per il tuo bivacco.' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1)), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden', backgroundColor: '#111827' }}>
      {slides.map((slide, index) => (
        <div key={slide.id} style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `linear-gradient(rgba(0,0,0, 0.4), rgba(0,0,0, 0.7)), url(${slide.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center', opacity: current === index ? 1 : 0, transition: 'opacity 1s ease-in-out',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'white', padding: '0 20px'
        }}>
          <h1 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 10px 0' }}>{slide.title}</h1>
          <p style={{ fontSize: '18px', maxWidth: '600px', fontWeight: '400' }}>{slide.subtitle}</p>
        </div>
      ))}
    </div>
  );
}


function PromoBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    // Controlla se l'utente ha già chiuso questo banner in precedenza
    return !localStorage.getItem('promo_banner_chiuso');
  });

  if (!isVisible) return null;

  return (
    <div style={{
      background: 'linear-gradient(to right, #FF6600, #FF8C00)',
      margin: '0 4% 30px 4%', 
      borderRadius: '12px', 
      padding: '16px 24px',
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      gap: '20px',
      boxShadow: '0 4px 15px rgba(255, 102, 0, 0.15)',
      flexWrap: 'wrap',
      position: 'relative'
    }}>
      {/* Sezione Testo (Allineata a sinistra, pulita e leggibile) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: '1 1 450px', textAlign: 'left' }}>
        <span style={{ fontSize: '24px' }}>🎁</span>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Regalo per Nuovi Utenti!
          </h3>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', opacity: 0.95, lineHeight: '1.4' }}>
            Scarica l'app Temu dal link esclusivo! Inserisci il codice <strong style={{ background: 'white', color: '#FF6600', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', display: 'inline-block' }}>app39037</strong> prima di pagare per sbloccare il <strong>30% di sconto</strong> e la <strong>spedizione gratuita</strong> sul tuo primo ordine!
          </p>
        </div>
      </div>

      {/* Sezione Azioni (Bottone + Pulsante per chiudere) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <a href="https://temu.to/m/u1te59jbio9" target="_blank" rel="noopener noreferrer" style={{ background: '#111827', color: 'white', padding: '10px 24px', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', whiteSpace: 'nowrap' }}>
          Riscatta Sconto
        </a>
        <button 
          onClick={() => { 
            localStorage.setItem('promo_banner_chiuso', 'true'); 
            setIsVisible(false); 
          }} 
          style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '18px', cursor: 'pointer', opacity: 0.7, padding: '5px' }}
          title="Nascondi annuncio"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
function ToastPromo() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Il messaggino appare dopo 6 secondi che l'utente è sulla pagina
    const timer = setTimeout(() => setIsVisible(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '85px', right: '20px', background: 'white', color: '#111827', 
      padding: '15px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', 
      maxWidth: '300px', zIndex: 9998, borderLeft: '4px solid #FF6600', fontSize: '14px', lineHeight: '1.5'
    }}>
      <button onClick={() => setIsVisible(false)} style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '16px' }}>✖</button>
      <p style={{ margin: '0 0 12px 0', paddingRight: '15px' }}>
        💸 <strong>Non perdere l'occasione!</strong> Richiedi il tuo pacchetto di coupon da 100€ e approfitta di uno sconto del 30% cercando <strong>app39037</strong> nell'app Temu.
      </p>
      <a href="https://temu.to/k/e1kyawnufsf" target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: '#FF6600', color: 'white', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
        Fai clic qui per iniziare!
      </a>
      <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#9CA3AF', textAlign: 'right' }}>Annuncio.</p>
    </div>
  );
}
// --- FAKE SALES TOAST (RIPROVA SOCIALE) ---
// --- FAKE SALES TOAST (CLICCABILE) ---

function FakeSalesToast({ prodotti, isDarkMode }) { // <-- Aggiunto isDarkMode
  const [vendita, setVendita] = useState(null);

  useEffect(() => {
    if (!prodotti || prodotti.length === 0) return;
    const nomi = ['Marco da Roma', 'Giulia da Milano', 'Luca da Napoli', 'Anna da Torino', 'Matteo da Firenze', 'Elena da Bologna', 'Davide da Palermo'];
    
    const interval = setInterval(() => {
      const prodottoCasuale = prodotti[Math.floor(Math.random() * prodotti.length)];
      const nomeCasuale = nomi[Math.floor(Math.random() * nomi.length)];
      const minutiCasuali = Math.floor(Math.random() * 12) + 1;
      
      setVendita({ 
        nome: nomeCasuale, 
        titolo: prodottoCasuale.titolo, 
        tempo: minutiCasuali, 
        link: prodottoCasuale.link_affiliazione 
      });
      
      setTimeout(() => setVendita(null), 4000); // <-- Ridotto a 4 secondi di visibilità
    }, 18000); 

    return () => clearInterval(interval);
  }, [prodotti]);

  if (!vendita) return null;

  // Colori dinamici in base al tema
  const bg = isDarkMode ? '#1F2937' : 'white';
  const text = isDarkMode ? '#F9FAFB' : '#111827';
  const textMuted = isDarkMode ? '#9CA3AF' : '#6B7280';

  return (
    <div 
      onClick={() => window.open(vendita.link, '_blank')} 
      style={{
        cursor: 'pointer', 
        position: 'fixed', bottom: '20px', left: '20px', 
        background: bg, color: text, // <-- Applica i colori dinamici
        padding: '12px 15px', borderRadius: '10px', boxShadow: '0 8px 25px rgba(0,0,0,0.3)', 
        zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px',
        borderLeft: '4px solid #059669', transition: 'all 0.3s ease-in-out'
      }}>
      <div style={{ fontSize: '24px' }}>🛍️</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '11px', color: textMuted }}>{vendita.nome} ha appena acquistato:</p>
        <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {vendita.titolo}
        </p>
        <p style={{ margin: 0, fontSize: '10px', color: '#059669', fontWeight: '600' }}>Circa {vendita.tempo} minuti fa • Clicca per vedere</p>
      </div>
    </div>
  );
}


// --- 3. EXIT-INTENT POPUP (RECUPERO UTENTI) ---
function ExitIntentPopup({ isDarkMode }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Se il cursore esce dalla parte superiore dello schermo (verso le schede del browser)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
      <div style={{ background: isDarkMode ? '#1F2937' : '#FFFFFF', color: isDarkMode ? '#F9FAFB' : '#111827', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '30px', textAlign: 'center', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderTop: '5px solid #FF6600' }}>
        <button onClick={() => setIsVisible(false)} style={{ position: 'absolute', top: '10px', right: '15px', background: 'transparent', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✖</button>
        
        <div style={{ fontSize: '45px', marginBottom: '10px' }}>🎁</div>
        <h2 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#FF6600', fontWeight: '900' }}>Aspetta! Non scappare!</h2>
        <p style={{ fontSize: '15px', marginBottom: '25px', color: isDarkMode ? '#D1D5DB' : '#4B5563', lineHeight: '1.5' }}>
          Hai già visto la sezione segreta di Temu con gli articoli a <strong>meno di 5€</strong> e la spedizione gratuita?
        </p>
        
        {/* SOSTITUISCI QUESTO LINK CON IL TUO LINK DI AFFILIAZIONE ALLA HOMEPAGE DI TEMU */}
        <a href="https://temu.to/k/iltuolinkgenerico" target="_blank" rel="noopener noreferrer" onClick={() => setIsVisible(false)} className="temu-buy-btn" style={{ display: 'block', background: '#FF6600', color: 'white', padding: '15px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 10px rgba(255,102,0,0.3)' }}>
          Mostrami le Offerte sotto i 5€
        </a>
        
        <button onClick={() => setIsVisible(false)} style={{ background: 'transparent', border: 'none', color: '#9CA3AF', fontSize: '12px', marginTop: '15px', cursor: 'pointer', textDecoration: 'underline' }}>
          No grazie, voglio perdere queste offerte
        </button>
      </div>
    </div>
  );
}
