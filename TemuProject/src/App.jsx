import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StarRating from './components/StarRating';
import { supabase } from './supabaseClient';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Admin from './Admin';
import Header from './components/Header';
import './App.css';
import ProductPage from './components/ProductPage'; // Modifica il percorso se l'hai salvato altrove
import ShareButtons from './components/ShareButtons'; // Modifica il percorso se l'hai salvato altrove
import ProductModal from './components/ProductModal'; // Modifica il percorso se l'hai salvato altrove
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
  }
};

// --- COMPONENTI MARKETING (TIMER E SHARE) ---
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60 + 14 * 60 + 59); // 02:14:59 in secondi

  useEffect(() => {
    // Rimuovi il punto e virgola dopo "interval" e usa const o let
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const ore = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const minuti = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const secondi = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '10px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block', marginBottom: '15px', border: '1px solid #FECACA' }}>
      ⏳ L'offerta scade tra: {ore}:{minuti}:{secondi}
    </div>
  );
}


// --- MODALE PRODOTTO OTTIMIZZATA ---
// --- MODALE PRODOTTO OTTIMIZZATA ---
// --- MODALE PRODOTTO OTTIMIZZATA ---


// --- TOP BAR PROMOZIONALE ---
function TopBar() {
  return (
    <div style={{ background: '#111827', color: 'white', textAlign: 'center', padding: '8px 4%', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>
      🔥 Spedizione Gratuita e Resi Gratuiti su Temu per 90 giorni! Scopri le offerte in basso.
    </div>
  )
}

function OffersPopup({ isDarkMode, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: isDarkMode ? '#1F2937' : '#FFFFFF', color: isDarkMode ? '#F9FAFB' : '#111827',
        width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative'
      }}>
        <button onClick={() => { setIsVisible(false); onClose(); }} style={{
          position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold'
        }}>X</button>
        <div style={{ height: '180px', backgroundImage: 'url(/banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div style={{ padding: '25px', textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#FF6600', fontSize: '24px', fontWeight: '900' }}>🔥 SELEZIONE PREMIUM</h2>
          <p style={{ margin: '0 0 20px 0', fontSize: '15px' }}>Abbiamo selezionato per te le migliori attrezzature su Temu. Fino al 70% in meno!</p>
          <button onClick={() => { setIsVisible(false); onClose(); }} style={{ background: '#FF6600', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '50px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', width: '100%' }}>
            Scopri i Prodotti
          </button>
        </div>
      </div>
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

function FakeSalesToast({ prodotti }) {
  const [vendita, setVendita] = useState(null);

  useEffect(() => {
    if (!prodotti || prodotti.length === 0) return;
    const nomi = ['Marco da Roma', 'Giulia da Milano', 'Luca da Napoli', 'Anna da Torino', 'Matteo da Firenze', 'Elena da Bologna', 'Davide da Palermo'];
    
    const interval = setInterval(() => {
      const prodottoCasuale = prodotti[Math.floor(Math.random() * prodotti.length)];
      const nomeCasuale = nomi[Math.floor(Math.random() * nomi.length)];
      const minutiCasuali = Math.floor(Math.random() * 12) + 1;
      
      // Salviamo anche il link di affiliazione per aprirlo al click
      setVendita({ 
        nome: nomeCasuale, 
        titolo: prodottoCasuale.titolo, 
        tempo: minutiCasuali, 
        link: prodottoCasuale.link_affiliazione 
      });
      
      setTimeout(() => setVendita(null), 6000);
    }, 18000);

    return () => clearInterval(interval);
  }, [prodotti]);

  if (!vendita) return null;

  return (
    <div 
      onClick={() => window.open(vendita.link, '_blank')} /* Apre il link Temu se l'utente clicca */
      style={{
        cursor: 'pointer', /* Mostra la manina */
        position: 'fixed', bottom: '20px', left: '20px', background: 'white', color: '#111827', 
        padding: '12px 15px', borderRadius: '10px', boxShadow: '0 8px 25px rgba(0,0,0,0.3)', 
        zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '320px',
        borderLeft: '4px solid #059669', transition: 'all 0.3s ease-in-out'
      }}>
      <div style={{ fontSize: '24px' }}>🛍️</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>{vendita.nome} ha appena acquistato:</p>
        <p style={{ margin: '2px 0', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {vendita.titolo}
        </p>
        <p style={{ margin: 0, fontSize: '10px', color: '#059669', fontWeight: '600' }}>Circa {vendita.tempo} minuti fa • Clicca per vedere</p>
      </div>
    </div>
  );
}
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slides = [
    { id: 1, image: '/banner.jpg', title: 'Attrezzatura da Pesca Pro 🎣', subtitle: 'Ecoscandagli, mulinelli ed esche testate per te.' },
    { id: 2, image: '/banner2.jpg', title: 'Acquascaping Perfetto 🐠', subtitle: 'Illuminazione LED e filtri a prezzi imbattibili.' }
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
  )
}

function CookieBanner() {
  const [visibile, setVisibile] = useState(false);
  useEffect(() => { if (!localStorage.getItem('cookie_accettati')) setVisibile(true); }, []);
  if (!visibile) return null;
  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#111827', color: '#fff', padding: '15px 4%', zIndex: 9999, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
      <p style={{ margin: 0, fontSize: '13px', flex: 1 }}>Utilizziamo i link affiliati Temu. Acquistando supporti il canale YouTube senza rincari.</p>
      <button onClick={() => { localStorage.setItem('cookie_accettati', 'true'); setVisibile(false); }} style={{ background: '#FF6600', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
    </div>
  )
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
// --- GIOCO A PREMI: RUOTA DELLA FORTUNA ---
// --- GIOCO A PREMI: RUOTA DELLA FORTUNA ---
function WheelOfFortune({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [canPlay, setCanPlay] = useState(true);

  // Controllo se ha già giocato oggi
  useEffect(() => {
    const lastSpin = localStorage.getItem('temu_last_spin');
    const today = new Date().toDateString();
    if (lastSpin === today) {
      setCanPlay(false);
    }
  }, [isOpen]);

  // I tuoi link forniti per la ruota
  const prizes = [
    { title: "🎉 0€ Regali + Sconto 30%", link: "https://temu.to/k/ef2vpiu4nll", code: "ale016189", desc: "Ottieni 0€ regali e usa il codice nell'app per un 30% extra! Spedizione e resi gratuiti (entro 90gg)." },
    { title: "🎁 Pacchetto Coupon 100€", link: "https://temu.to/k/eu5kgk41cby", code: "app39037", desc: "Il tuo pacchetto di coupon 100€ è qui! Sconto extra del 30% sull'app Temu." },
    { title: "🔥 Risparmio Gigante 100€", link: "https://temu.to/k/eq781iq9pn5", code: "app39037", desc: "Prendi subito il tuo pacchetto di coupon 100€ e sconto 30%!" },
    { title: "⭐️ Offerte Esclusive VIP", link: "https://temu.to/k/eudiy0642tx", code: "alg203906", desc: "Articoli di alta qualità a prezzi bassissimi. Acquista ora e risparmia alla grande!" },
    { title: "🌟 Scrigno del Tesoro", link: "https://temu.to/m/u1te59jbio9", code: "", desc: "Scopri lo scrigno del tesoro di Temu! Approfitta di offerte imperdibili." },
    { title: "😢 Ritenta Domani", link: null, code: "", desc: "Peccato, non hai vinto. Torna domani per un altro giro!" }
  ];

  const handleSpin = () => {
    if (!canPlay) return;
    setSpinning(true);
    
    // Simula 3 secondi di "giro della ruota"
    setTimeout(() => {
      // 85% probabilità di vincere, 15% di perdere
      const isWin = Math.random() > 0.15;
      let prize;
      if (isWin) {
        prize = prizes[Math.floor(Math.random() * (prizes.length - 1))];
      } else {
        prize = prizes[prizes.length - 1]; 
      }
      
      setResult(prize);
      setSpinning(false);
      setCanPlay(false);
      localStorage.setItem('temu_last_spin', new Date().toDateString());
    }, 3000);
  };

  return (
    <>
      {/* BOTTONE FLUTTUANTE GIRA LA RUOTA (Fisso in alto a destra) */}
      <div 
        onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', top: '90px', right: '15px', background: '#EF4444', color: 'white', padding: '12px 18px', borderRadius: '50px', cursor: 'pointer', zIndex: 9998, boxShadow: '0 4px 15px rgba(239,68,68,0.5)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'transform 0.2s' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '20px' }}>🎡</span> 
        <span style={{ display: window.innerWidth > 600 ? 'inline' : 'none' }}>Vinci Coupon</span>
      </div>

      {/* MODALE RUOTA */}
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: isDarkMode ? '#1F2937' : '#FFFFFF', color: isDarkMode ? '#F9FAFB' : '#111827', width: '100%', maxWidth: '400px', borderRadius: '16px', padding: '30px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => {setIsOpen(false); if(result) setResult(null);}} style={{ position: 'absolute', top: '10px', right: '15px', background: 'transparent', border: 'none', fontSize: '20px', color: '#9CA3AF', cursor: 'pointer' }}>✖</button>
            
            <h2 style={{ fontSize: '24px', margin: '0 0 10px 0', color: '#EF4444', fontWeight: '900' }}>Ruota della Fortuna 🎡</h2>
            <p style={{ fontSize: '13px', marginBottom: '20px', color: '#6B7280' }}>Gira e vinci fantastici regali e coupon Temu! Hai 1 giro al giorno.</p>

            {!result ? (
              <div style={{ padding: '10px', position: 'relative' }}>
                
                {/* Il pescatore con la canna da pesca animata */}
                <div style={{ 
                  fontSize: '40px', 
                  marginBottom: '10px', 
                  position: 'relative', 
                  zIndex: 2,
                  animation: spinning ? 'reeling 0.2s infinite alternate' : 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}>
                  <span style={{ fontSize: '45px' }}>🧑‍🎣</span>
                  {/* Canna da pesca che si inclina durante il giro */}
                  <span style={{ 
                    transform: spinning ? 'rotate(-25deg) scale(1.1)' : 'rotate(0deg)', 
                    transition: 'transform 0.1s ease-in-out',
                    marginTop: '-12px',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#4B5563'
                  }}>
                    /
                  </span>
                </div>

                <style>{`
                  @keyframes reeling {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(-5px) rotate(-10deg); }
                  }
                `}</style>

                {/* Ruota circolare multicolore a spicchi */}
                <div style={{
                  position: 'relative',
                  width: '230px',
                  height: '230px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  border: isDarkMode ? '6px solid #4B5563' : '6px solid #111827',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  background: 'conic-gradient(#FF6600 0deg 60deg, #10B981 60deg 120deg, #3B82F6 120deg 180deg, #FBBF24 180deg 240deg, #A855F7 240deg 300deg, #EF4444 300deg 360deg)',
                  transition: 'transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)',
                  transform: spinning ? 'rotate(2160deg)' : 'rotate(0deg)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}>
                  {/* Linee divisorie degli spicchi */}
                  <div style={{ position: 'absolute', width: '100%', height: '2px', background: 'rgba(255,255,255,0.3)', transform: 'rotate(0deg)' }}></div>
                  <div style={{ position: 'absolute', width: '100%', height: '2px', background: 'rgba(255,255,255,0.3)', transform: 'rotate(60deg)' }}></div>
                  <div style={{ position: 'absolute', width: '100%', height: '2px', background: 'rgba(255,255,255,0.3)', transform: 'rotate(120deg)' }}></div>
                  
                  {/* Icone dei premi allineate negli spicchi */}
                  <span style={{ position: 'absolute', top: '25px', fontSize: '22px' }}>🎉</span>
                  <span style={{ position: 'absolute', right: '25px', top: '65px', fontSize: '22px' }}>🎁</span>
                  <span style={{ position: 'absolute', right: '25px', bottom: '65px', fontSize: '22px' }}>🔥</span>
                  <span style={{ position: 'absolute', bottom: '25px', fontSize: '22px' }}>⭐️</span>
                  <span style={{ position: 'absolute', left: '25px', bottom: '65px', fontSize: '22px' }}>🌟</span>
                  <span style={{ position: 'absolute', left: '25px', top: '65px', fontSize: '22px' }}>😢</span>

                  {/* Centro della ruota a forma di Boa galleggiante */}
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'white',
                    border: '4px solid #111827',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '18px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
                    zIndex: 10
                  }}>
                    🔴
                  </div>
                </div>

                {/* Bottone di Azione */}
                <div style={{ marginTop: '30px' }}>
                  {canPlay ? (
                    <button onClick={handleSpin} disabled={spinning} className={spinning ? "" : "temu-buy-btn"} style={{ background: spinning ? '#D1D5DB' : '#FF6600', color: 'white', padding: '14px 40px', borderRadius: '50px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: spinning ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(255,102,0,0.3)' }}>
                      {spinning ? 'Pescando...' : 'LANCIA LA LENZA! 🎣'}
                    </button>
                  ) : (
                    <p style={{ color: '#EF4444', fontWeight: 'bold', marginTop: '15px' }}>Hai già pescato oggi! ⏰ Torna domani.</p>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ background: isDarkMode ? '#374151' : '#F9FAFB', padding: '20px', borderRadius: '12px', marginTop: '20px', border: result.link ? '2px solid #10B981' : '2px solid #EF4444' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', color: result.link ? '#10B981' : '#EF4444' }}>{result.title}</h3>
                <p style={{ fontSize: '13px', lineHeight: '1.5', marginBottom: '15px' }}>{result.desc}</p>
                
                {result.code && (
                  <div style={{ background: isDarkMode ? '#111827' : '#FFFFFF', padding: '10px', borderRadius: '8px', border: '2px dashed #FF6600', marginBottom: '15px' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Cerca questo codice nell'App:</span><br/>
                    <strong style={{ fontSize: '22px', color: '#FF6600', letterSpacing: '1px' }}>{result.code}</strong>
                  </div>
                )}

                {result.link ? (
                  <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#FF6600', color: 'white', padding: '15px', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 10px rgba(255,102,0,0.3)' }}>
                    Riscatta Premio 🎁
                  </a>
                ) : (
                  <button onClick={() => {setIsOpen(false); setResult(null);}} style={{ background: '#6B7280', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Chiudi</button>
                )}
                
                {result.link && <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '15px', lineHeight: '1.3' }}>⚠️ Solo per utenti con ordini idonei. Si applicano T&C. Annuncio.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}


// --- PAGINA PRINCIPALE ---
function Home({ isDarkMode }) {
  // 1. STATI (Senza doppioni)
  const [prodotti, setProdotti] = useState([]);
  const [repartoAttivo, setRepartoAttivo] = useState('🎣 Pesca Sportiva');
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte');
  const [filtroSottocategoria, setFiltroSottocategoria] = useState('Tutte'); 
  const [filtroPrezzo, setFiltroPrezzo] = useState('Tutti');
  const [ricerca, setRicerca] = useState('');
  const [filtroSconto, setFiltroSconto] = useState('Tutti'); // AGGIUNTO QUI IN ALTO
  const [popupClosed, setPopupClosed] = useState(false);
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const prodottiPerPagina = 18;

  useEffect(() => {
    async function getProdotti() {
      const { data } = await supabase.from('products').select('*');
      if (data) {
        const prodottiMescolati = data.sort(() => Math.random() - 0.5);
        setProdotti(prodottiMescolati);
      }
    }
    getProdotti();
  }, []);

  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto); 
    setFiltroCategoria('Tutte'); 
    setFiltroSottocategoria('Tutte'); 
    setFiltroPrezzo('Tutti'); 
    setRicerca('');
    setFiltroSconto('Tutti'); // Resetta anche lo sconto
  }

  // 2. FILTRAGGIO PRODOTTI (Logica unita e corretta)
  const prodottiFiltrati = prodotti.filter(p => {
    let passaReparto = p.reparto === repartoAttivo || (!p.reparto && repartoAttivo === '🎣 Pesca Sportiva');
    let passaRicerca = p.titolo.toLowerCase().includes(ricerca.toLowerCase());
    let passaCategoria = filtroCategoria === 'Tutte' || p.categoria === filtroCategoria;
    let passaSottocategoria = filtroSottocategoria === 'Tutte' || p.sottocategoria === filtroSottocategoria;
    
    let passaPrezzo = true;
    if (p.prezzo) {
      const prezzoNum = parseFloat(p.prezzo.toString().replace(',', '.'));
      if (filtroPrezzo === '0-10') passaPrezzo = prezzoNum < 10;
      else if (filtroPrezzo === '10-30') passaPrezzo = prezzoNum >= 10 && prezzoNum <= 30;
      else if (filtroPrezzo === '30+') passaPrezzo = prezzoNum > 30;
    }

    // Controllo sconto dinamico (calcolato con la tua formula)
    let passaSconto = true;
    if (filtroSconto !== 'Tutti') {
      const scontoGenerato = 45 + ((p.id * 3) % 30);
      passaSconto = scontoGenerato >= parseInt(filtroSconto);
    }

    // Unico return finale che combina tutto!
    return passaReparto && passaRicerca && passaCategoria && passaSottocategoria && passaPrezzo && passaSconto;
  });

  // 3. COLORI E PAGINAZIONE
  const bgPrincipale = isDarkMode ? '#111827' : '#F9FAFB';
  const textPrincipale = isDarkMode ? '#F3F4F6' : '#111827';
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#374151' : '#E5E7EB';

  const indiceUltimoProdotto = currentPage * prodottiPerPagina;
  const indicePrimoProdotto = indiceUltimoProdotto - prodottiPerPagina;
  
  const prodottiPaginati = prodottiFiltrati.slice(indicePrimoProdotto, indiceUltimoProdotto);
  const totalePagine = Math.ceil(prodottiFiltrati.length / prodottiPerPagina);

  // 4. RENDER HTML
  return (
// ... qui continua il tuo codice HTML ( <div style={{ fontFamily: 'Inter' ... )
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: bgPrincipale, paddingBottom: '100px', minHeight: '100vh', color: textPrincipale }}>
      {!popupClosed && <OffersPopup isDarkMode={isDarkMode} onClose={() => setPopupClosed(true)} />}
      <ToastPromo />
      <FakeSalesToast prodotti={prodotti} />
      <ExitIntentPopup isDarkMode={isDarkMode} />
      <WheelOfFortune isDarkMode={isDarkMode} />
      
      <HeroSlider />
    
      {/* IL NUOVO HEADER DINAMICO INSERITO QUI */}
      {/* IL NUOVO HEADER DINAMICO INSERITO QUI */}
      <Header 
        repartiMap={repartiMap}
        repartoAttivo={repartoAttivo}
        setRepartoAttivo={setRepartoAttivo}
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        isDarkMode={isDarkMode} /* <--- AGGIUNGI QUESTA RIGA */
      />

      <div style={{ padding: '20px 0' }}>
        <PromoBanner />

        {/* Manteniamo solo la barra di ricerca e il filtro prezzo */}
        {/* BARRA DI RICERCA E FILTRI */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '30px', padding: '0 4%' }}>
          
          <input 
             type="text" 
             placeholder="Cerca prodotto..." 
             value={ricerca} 
             onChange={(e) => setRicerca(e.target.value)} 
             style={{ flex: 2, minWidth: '200px', padding: '14px 20px', borderRadius: '12px', border: `2px solid ${cardBorder}`, background: cardBg, color: textPrincipale, outline: 'none', fontSize: '16px' }} 
          />
          
          {/* Filtro Prezzo */}
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

          {/* NUOVO Filtro Sconti */}
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

        {/* GRIGLIA PRODOTTI OTTIMIZZATA CON SCONTO E STELLE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', padding: '0 4%' }}>
          {prodottiPaginati.map((prodotto) => {
            // Calcolo dinamico del prezzo originale barrato (+30%)
            const prezzoNum = prodotto.prezzo ? parseFloat(prodotto.prezzo.toString().replace(',', '.')) : 0;
            const prezzoBarrato = (prezzoNum * 1.3).toFixed(2);
            
            // Genera uno sconto verosimile tra il 45% e il 75% usando l'ID
            const scontoPercentuale = 45 + ((prodotto.id * 3) % 30);

            return (
              
                <Link 
                  to={`/prodotto/${prodotto.id}`}
                  key={prodotto.id} 
                  onClick={(e) => {
                    e.preventDefault(); // Blocca il caricamento della nuova pagina
                    setProdottoSelezionato(prodotto); // Apre il Modal istantaneamente
                  }}
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', padding: '15px', borderRadius: '20px', background: cardBg, border: 'none', boxShadow: isDarkMode ? '0 20px 40px -10px rgba(0,0,0,0.5)' : '0 20px 40px -10px rgba(15,23,42,0.06)', transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                {/* Badge Angolare */}
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#FF6600', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', zIndex: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Temu Pick
                </span>

                {/* 1. IMMAGINE CON BADGE SCONTO */}
                <div style={{ position: 'relative', height: '180px', width: '100%', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDarkMode ? '#111827' : '#F9FAFB', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#EF4444', color: 'white', padding: '4px 8px', borderRadius: '20px', fontSize: '13px', fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 5 }}>
                    -{scontoPercentuale}%
                  </div>
                  {prodotto.immagine_url ? (
                    <img src={prodotto.immagine_url} alt={prodotto.titolo} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/e5e7eb/6b7280?text=Immagine+Non+Disponibile'; }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : <span style={{ color: '#9CA3AF' }}>No Img</span>}
                </div>
                
                {/* 2. PREZZO ATTUALE GIGANTE E PREZZO SBARRATO */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '900', fontSize: '24px', color: '#FF6600' }}>€ {prodotto.prezzo}</span>
                  <span style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'line-through' }}>{prezzoBarrato}€</span>
                </div>

                {/* 3. TITOLO BREVE */}
                <h3 title={prodotto.titolo} style={{ fontSize: '14px', margin: '0 0 8px 0', color: textPrincipale, lineHeight: '1.3', fontWeight: '700', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px' }}>
                  {prodotto.titolo}
                </h3>

                {/* 4. LE STELLE E LA SCARSITÀ (Qui c'è il nostro componente corretto!) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <StarRating productId={prodotto.id} />
                  </div>
                  <div style={{ color: '#EF4444', fontWeight: '600', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚡ Offerta Lampo</span> 
                    <span style={{ color: '#D1D5DB' }}>|</span> 
                    <span style={{ color: '#059669' }}>+500 venduti</span>
                  </div>
                </div>
                
                {/* 5. CALL TO ACTION MODALE */}
                <div style={{ marginTop: 'auto', background: isDarkMode ? '#374151' : '#111827', color: 'white', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center' }}>
                  Scopri Dettagli
                </div>
              </Link>
            );
          })}
          
        </div>
      </div>
      {/* ... qui finisce il tuo prodottiPaginati.map(...) ... */}
          
        {/* ^ Questo è il div che chiude la griglia dei prodotti */}

        {/* CONTROLLI DI PAGINAZIONE (Frecce) */}
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
     <ProductModal 
        prodotto={prodottoSelezionato} 
        tuttiProdotti={prodotti} /* Passa l'array completo dei tuoi prodotti qui */
        isDarkMode={isDarkMode} 
        onClose={() => setProdottoSelezionato(null)} 
      />
      
    </div>
  )
}

// --- COMPONENTE ROOT ---
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }}>
        <TopBar />
        <CookieBanner />
        
        {/* HEADER EFFETTO VETRO (APPLE STYLE) */}
        <nav style={{ 
          padding: '15px 4%', 
          background: isDarkMode ? 'rgba(31, 41, 55, 0.75)' : 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(16px)', 
          WebkitBackdropFilter: 'blur(16px)', 
          borderBottom: isDarkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          position: 'sticky', 
          top: 0, 
          zIndex: 100,
          boxShadow: isDarkMode ? 'none' : '0 10px 30px -10px rgba(0,0,0,0.05)'
        }}>
          <Link to="/" style={{ textDecoration: 'none', color: isDarkMode ? 'white' : '#111827', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: '900' }}>Recensioni<span style={{ color: '#FF6600' }}>ITA</span></span>
          </Link>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {/* Tasto Dark Mode */}
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: isDarkMode ? '#374151' : '#F3F4F6', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} title="Cambia Tema">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            {/* LINK E ICONA GRUPPO FACEBOOK */}
            <a href="https://www.facebook.com/groups/969436699293635/" target="_blank" rel="noopener noreferrer" title="Unisciti al Gruppo Facebook" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
               <svg width="26" height="26" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>

            {/* LINK CANALE YOUTUBE */}
            <a href="https://youtube.com/@recensioniita9?si=Rdg3mXWsViQtWvup" target="_blank" rel="noopener noreferrer" title="Visita il Canale" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </nav>
        
        <div style={{ flex: 1 }}>
          <Routes>
  <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
  <Route path="/admin" element={<Admin />} />
  <Route path="/prodotto/:id" element={<ProductPage isDarkMode={isDarkMode} />} /> {/* LA NUOVA ROTTA */}
  
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

export default App;