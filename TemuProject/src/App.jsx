import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Admin from './Admin';

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

function ShareButtons({ prodotto }) {
  const messaggio = `Guarda questa offerta: ${prodotto.titolo} a soli €${prodotto.prezzo}!`;
  const linkSito = window.location.href; 
  
  const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(messaggio + " " + linkSito)}`;
  const tgLink = `https://t.me/share/url?url=${encodeURIComponent(linkSito)}&text=${encodeURIComponent(messaggio)}`;

  return (
    <div style={{ display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '15px' }}>
      <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '8px 15px', borderRadius: '50px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
        💬 WhatsApp
      </a>
      <a href={tgLink} target="_blank" rel="noopener noreferrer" style={{ background: '#0088cc', color: 'white', padding: '8px 15px', borderRadius: '50px', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
        ✈️ Telegram
      </a>
    </div>
  );
}

// --- MODALE PRODOTTO OTTIMIZZATA ---
// --- MODALE PRODOTTO OTTIMIZZATA ---
// --- MODALE PRODOTTO OTTIMIZZATA ---
function ProductModal({ prodotto, tuttiProdotti, onClose, isDarkMode }) {
  if (!prodotto) return null;

  const bg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const text = isDarkMode ? '#F9FAFB' : '#111827';
  const categoriaSafe = prodotto.categoria || '';
  
  const correlati = tuttiProdotti
    .filter(p => p.categoria === categoriaSafe && p.id !== prodotto.id)
    .slice(0, 3);

  let prezzoBarrato = "0.00";
  if(prodotto.prezzo) {
    prezzoBarrato = ((parseFloat(prodotto.prezzo.toString().replace(',', '.'))) * 1.3).toFixed(2);
  }

  const percentualeVenduta = 75 + ((prodotto.id * 7) % 20); 

  return (
    <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: bg, color: text, width: '100%', maxWidth: '800px', maxHeight: '90vh', borderRadius: '16px', overflowY: 'auto', position: 'relative', display: 'flex', flexDirection: 'column', padding: '25px' }}>
        
        <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: '#E5E7EB', color: '#111827', border: 'none', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer', fontWeight: 'bold', zIndex: 10 }}>X</button>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
          
          {/* ================= COLONNA SINISTRA ================= */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: isDarkMode ? '#111827' : '#F3F4F6', borderRadius: '12px', overflow: 'hidden' }}>
               {prodotto.immagine_url ? <img src={prodotto.immagine_url} alt={prodotto.titolo} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /> : 'Nessuna Immagine'}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#FBBF24', fontSize: '22px', letterSpacing: '2px' }}>★★★★★</span>
              <span style={{ color: '#6B7280', fontSize: '15px', fontWeight: 'bold' }}>(4.8)</span>
            </div>

            {/* RECENSIONI SOTTO L'IMMAGINE */}
            <div style={{ borderTop: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB', paddingTop: '15px', textAlign: 'left' }}>
              <h4 style={{ fontSize: '13px', margin: '0 0 10px 0', color: '#6B7280', textTransform: 'uppercase' }}>Recensioni Recenti</h4>
              
              {(() => {
                const nomiList = ['Marco D.', 'Simona R.', 'Alessandro T.', 'Francesca B.', 'Giuseppe M.', 'Valentina C.', 'Luca F.', 'Chiara S.', 'Andrea P.', 'Martina L.'];
                const recensioniList = [
                  "Prodotto fantastico, arrivato in soli 6 giorni. Identico alla foto!",
                  "Rapporto qualità prezzo imbattibile. Lo consiglio vivamente.",
                  "Ottimo acquisto! La spedizione è stata più veloce del previsto.",
                  "Qualità sorprendente per il prezzo pagato. Ne comprerò sicuramente un altro.",
                  "Esattamente quello che cercavo, molto utile e ben imballato.",
                  "Tutto perfetto, non delude mai. 5 stelle super meritate!",
                  "L'ho preso per un regalo ed è stato apprezzatissimo. Top!",
                  "Materiali ottimi, non me lo aspettavo a questo prezzo così basso."
                ];

                const nome1 = nomiList[(prodotto.id * 2) % nomiList.length];
                const nome2 = nomiList[(prodotto.id * 5 + 3) % nomiList.length];
                const rec1 = recensioniList[(prodotto.id * 3) % recensioniList.length];
                const rec2 = recensioniList[(prodotto.id * 7 + 1) % recensioniList.length];

                return (
                  <>
                    <div style={{ marginBottom: '10px', background: isDarkMode ? '#1F2937' : '#F9FAFB', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#FBBF24', fontSize: '12px' }}>★★★★★</span>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 'bold' }}>✓ Acquisto Verificato</span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>{nome1}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', fontStyle: 'italic' }}>"{rec1}"</div>
                    </div>

                    <div style={{ background: isDarkMode ? '#1F2937' : '#F9FAFB', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#FBBF24', fontSize: '12px' }}>★★★★★</span>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 'bold' }}>✓ Acquisto Verificato</span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '4px' }}>{nome2}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px', fontStyle: 'italic' }}>"{rec2}"</div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* ================= COLONNA DESTRA ================= */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>{prodotto.reparto} &gt; {prodotto.categoria}</span>
            <h2 style={{ fontSize: '22px', margin: '10px 0', lineHeight: '1.4' }}>{prodotto.titolo}</h2>
            
            <div style={{ background: isDarkMode ? '#374151' : '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '10px', borderRadius: '4px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>⏳</span>
              <span style={{ fontSize: '13px', color: isDarkMode ? '#FCA5A5' : '#B91C1C', fontWeight: 'bold', lineHeight: '1.3' }}>Le offerte lampo e la disponibilità<br/>possono terminare in qualsiasi momento.</span>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <span style={{ fontSize: '14px', color: '#6B7280', textDecoration: 'line-through', marginRight: '10px' }}>{prezzoBarrato}€</span>
              <span style={{ fontWeight: '900', fontSize: '38px', color: '#FF6600' }}>€ {prodotto.prezzo}</span>
            </div>

            {/* BOTTONE GIGANTE SUBITO SOTTO IL PREZZO */}
            <a href={prodotto.link_affiliazione} className="temu-buy-btn" target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#FF6600', color: 'white', padding: '16px', textDecoration: 'none', borderRadius: '8px', fontSize: '20px', fontWeight: '900', textAlign: 'center', boxShadow: '0 4px 15px rgba(255,102,0,0.4)', marginBottom: '20px' }}>
              🔥 Vai all'Offerta su Temu
            </a>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 'bold' }}>🔥 {percentualeVenduta}% Venduto</span>
              <div style={{ flex: 1, height: '6px', background: '#FEE2E2', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${percentualeVenduta}%`, height: '100%', background: '#EF4444', borderRadius: '10px' }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', background: isDarkMode ? '#1F2937' : '#F9FAFB', padding: '15px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#059669', fontWeight: '600' }}><span>📦</span> Spedizione GRATUITA</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}><span>↩️</span> Reso gratuito entro 90 giorni</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}><span>🔒</span> Pagamenti sicuri al 100%</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 'bold' }}>Condividi questa offerta:</span>
              <ShareButtons prodotto={prodotto} />
            </div>

            <p style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: '1.4', textAlign: 'center', marginTop: 'auto' }}>* In qualità di Affiliato, ricevo una commissione per gli acquisti idonei.</p>

          </div>
        </div>

        {/* ================= CORRELATI ================= */}
        {correlati.length > 0 && (
          <div style={{ marginTop: '30px', borderTop: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`, paddingTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>💡 Potrebbe interessarti anche...</h3>
            <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '10px' }}>
              {correlati.map(corr => (
                <div onClick={() => { window.open(corr.link_affiliazione, '_blank'); }} key={corr.id} style={{ minWidth: '160px', flex: '1', cursor: 'pointer', textDecoration: 'none', color: 'inherit', border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`, borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <img src={corr.immagine_url} alt={corr.titolo} style={{ height: '100px', width: '100%', objectFit: 'contain', marginBottom: '10px' }} />
                  <h4 style={{ fontSize: '12px', margin: '0 0 10px 0', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '34px', lineHeight: '1.4' }}>{corr.titolo}</h4>
                  <span style={{ fontWeight: '900', color: '#FF6600', fontSize: '16px', marginTop: 'auto' }}>€ {corr.prezzo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

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
        prize = prizes[Math.floor(Math.random() * (prizes.length - 1))]; // Prende uno dei primi 5
      } else {
        prize = prizes[prizes.length - 1]; // Prende l'ultimo "Ritenta domani"
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
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '80px', display: 'inline-block', transition: 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)', transform: spinning ? 'rotate(2160deg)' : 'rotate(0deg)' }}>
                  🎯
                </div>
                <div style={{ marginTop: '30px' }}>
                  {canPlay ? (
                    <button onClick={handleSpin} disabled={spinning} className={spinning ? "" : "temu-buy-btn"} style={{ background: spinning ? '#D1D5DB' : '#FF6600', color: 'white', padding: '15px 40px', borderRadius: '50px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: spinning ? 'not-allowed' : 'pointer' }}>
                      {spinning ? 'Girando...' : 'GIRA ORA!'}
                    </button>
                  ) : (
                    <p style={{ color: '#EF4444', fontWeight: 'bold' }}>Hai già giocato oggi! ⏰ Torna domani.</p>
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
  const [prodotti, setProdotti] = useState([])
  const [repartoAttivo, setRepartoAttivo] = useState('🎣 Pesca Sportiva')
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte')
  const [filtroSottocategoria, setFiltroSottocategoria] = useState('Tutte') 
  const [filtroPrezzo, setFiltroPrezzo] = useState('Tutti') 
  const [ricerca, setRicerca] = useState('')
  const [popupClosed, setPopupClosed] = useState(false)
  const [prodottoSelezionato, setProdottoSelezionato] = useState(null) // STATO MODALE

  useEffect(() => { ottieniProdotti() }, [])

  async function ottieniProdotti() {
    const { data, error } = await supabase.from('products').select('*')
    if (!error) setProdotti(data)
  }

  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto); setFiltroCategoria('Tutte'); setFiltroSottocategoria('Tutte'); setFiltroPrezzo('Tutti'); setRicerca('');
  }

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

    return passaReparto && passaRicerca && passaCategoria && passaSottocategoria && passaPrezzo;
  });

  const bgPrincipale = isDarkMode ? '#111827' : '#F9FAFB';
  const textPrincipale = isDarkMode ? '#F3F4F6' : '#111827';
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#374151' : '#E5E7EB';

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: bgPrincipale, paddingBottom: '100px', minHeight: '100vh', color: textPrincipale }}>
      {/* Popups e Notifiche */}
      {/* Popups e Notifiche */}
      {!popupClosed && <OffersPopup isDarkMode={isDarkMode} onClose={() => setPopupClosed(true)} />}
      <ToastPromo />
      <FakeSalesToast prodotti={prodotti} />
      <ExitIntentPopup isDarkMode={isDarkMode} />
      <WheelOfFortune isDarkMode={isDarkMode} />
       {/* Aggiungi questa riga! */}
      <HeroSlider />
    
      {/* BANNER SELEZIONE REPARTI */}
      <div style={{ display: 'flex', gap: '20px', padding: '30px 4%', flexWrap: 'wrap' }}>
        
        {/* Banner Pesca */}
        <div 
          onClick={() => cambiaReparto('🎣 Pesca Sportiva')} 
          style={{ 
            flex: '1 1 300px', 
            height: '140px',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(/banner.jpg)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '16px',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            cursor: 'pointer', 
            border: repartoAttivo === '🎣 Pesca Sportiva' ? '4px solid #FF6600' : '4px solid transparent',
            boxShadow: repartoAttivo === '🎣 Pesca Sportiva' ? '0 0 20px rgba(255,102,0,0.4)' : '0 4px 10px rgba(0,0,0,0.1)',
            transform: repartoAttivo === '🎣 Pesca Sportiva' ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '900', margin: 0, textShadow: '0 2px 5px rgba(0,0,0,0.8)', letterSpacing: '1px' }}>
            🎣 PESCA SPORTIVA
          </h2>
        </div>

        {/* Banner Acquariofilia */}
        <div 
          onClick={() => cambiaReparto('🐠 Acquariofilia')} 
          style={{ 
            flex: '1 1 300px', 
            height: '140px',
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(/banner2.jpg)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '16px',
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            cursor: 'pointer', 
            border: repartoAttivo === '🐠 Acquariofilia' ? '4px solid #FF6600' : '4px solid transparent',
            boxShadow: repartoAttivo === '🐠 Acquariofilia' ? '0 0 20px rgba(255,102,0,0.4)' : '0 4px 10px rgba(0,0,0,0.1)',
            transform: repartoAttivo === '🐠 Acquariofilia' ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s ease'
          }}
        >
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: '900', margin: 0, textShadow: '0 2px 5px rgba(0,0,0,0.8)', letterSpacing: '1px' }}>
            🐠 ACQUARIOFILIA
          </h2>
        </div>
      </div>

      <div style={{ padding: '40px 0' }}>
        <PromoBanner />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px', padding: '0 4%' }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
            <button onClick={() => setFiltroCategoria('Tutte')} style={{ padding: '8px 20px', borderRadius: '50px', border: 'none', background: filtroCategoria === 'Tutte' ? '#FF6600' : (isDarkMode?'#374151':'#E5E7EB'), color: filtroCategoria === 'Tutte' ? 'white' : (isDarkMode?'#D1D5DB':'#374151'), cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Tutte le Categorie</button>
            {Object.keys(repartiMap[repartoAttivo]).map(cat => (
              <button key={cat} onClick={() => {setFiltroCategoria(cat); setFiltroSottocategoria('Tutte');}} style={{ padding: '8px 20px', borderRadius: '50px', border: 'none', background: filtroCategoria === cat ? '#FF6600' : (isDarkMode?'#374151':'#E5E7EB'), color: filtroCategoria === cat ? 'white' : (isDarkMode?'#D1D5DB':'#374151'), cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{cat}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input type="text" placeholder="Cerca prodotto..." value={ricerca} onChange={(e) => setRicerca(e.target.value)} style={{ flex: 2, minWidth: '200px', padding: '12px 20px', borderRadius: '10px', border: `1px solid ${cardBorder}`, background: cardBg, color: textPrincipale, outline: 'none' }} />
            
            <select value={filtroPrezzo} onChange={(e) => setFiltroPrezzo(e.target.value)} style={{ flex: 1, minWidth: '150px', padding: '12px 20px', borderRadius: '10px', border: `1px solid ${cardBorder}`, background: cardBg, color: textPrincipale, outline: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              <option value="Tutti">Tutti i prezzi</option>
              <option value="0-10">Sotto i 10 €</option>
              <option value="10-30">Tra 10 € e 30 €</option>
              <option value="30+">Oltre 30 €</option>
            </select>
          </div>
        </div>

        {/* GRIGLIA PRODOTTI OTTIMIZZATA CON SCONTO E STELLE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', padding: '0 4%' }}>
          {prodottiFiltrati.map((prodotto) => {
            // Calcolo dinamico del prezzo originale barrato (+30%)
            const prezzoNum = prodotto.prezzo ? parseFloat(prodotto.prezzo.toString().replace(',', '.')) : 0;
            const prezzoBarrato = (prezzoNum * 1.3).toFixed(2);
            
            // Genera uno sconto verosimile tra il 45% e il 75% usando l'ID
            const scontoPercentuale = 45 + ((prodotto.id * 3) % 30);

            return (
              <div 
                key={prodotto.id} 
                onClick={() => setProdottoSelezionato(prodotto)} 
                style={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '15px',
                  borderRadius: '16px',
                  background: cardBg, 
                  border: `1px solid ${cardBorder}`, 
                  boxShadow: isDarkMode ? '0 4px 15px rgba(0,0,0,0.4)' : '0 4px 15px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s ease-out'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Badge Angolare */}
                <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#FF6600', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', zIndex: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Temu Pick
                </span>

                {/* 1. IMMAGINE CON BADGE SCONTO */}
                <div style={{ position: 'relative', height: '180px', width: '100%', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDarkMode ? '#111827' : '#F9FAFB', borderRadius: '10px', overflow: 'hidden' }}>
                  
                  {/* NUOVO BADGE SCONTO ROSSO IN ALTO A DESTRA */}
                  <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#EF4444', color: 'white', padding: '4px 8px', borderRadius: '20px', fontSize: '13px', fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 5 }}>
                    -{scontoPercentuale}%
                  </div>

                  {prodotto.immagine_url ? (
                    <img 
                      src={prodotto.immagine_url} 
                      alt={prodotto.titolo} 
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/e5e7eb/6b7280?text=Immagine+Non+Disponibile'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  ) : <span style={{ color: '#9CA3AF' }}>No Img</span>}
                </div>
                
                {/* 2. PREZZO ATTUALE GIGANTE E PREZZO SBARRATO */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '900', fontSize: '24px', color: '#FF6600' }}>
                    € {prodotto.prezzo}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'line-through' }}>
                    {prezzoBarrato}€
                  </span>
                </div>

                {/* 3. TITOLO BREVE (Troncato a 2 righe stabili) */}
                <h3 title={prodotto.titolo} style={{ fontSize: '14px', margin: '0 0 8px 0', color: textPrincipale, lineHeight: '1.3', fontWeight: '700', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px' }}>
                  {prodotto.titolo}
                </h3>

                {/* 4. LE STELLE E LA SCARSITÀ (SOCIAL PROOF) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#FBBF24', fontSize: '14px', letterSpacing: '1px' }}>★★★★★</span> 
                    <span style={{ color: '#6B7280', fontSize: '11px' }}>(4.8)</span>
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
              </div>
            );
          })}
        </div>
      </div>
      
      {/* RICHIESTA MODALE */}
      <ProductModal 
        prodotto={prodottoSelezionato} 
        tuttiProdotti={prodotti} 
        isDarkMode={isDarkMode} 
        onClose={() => setProdottoSelezionato(null)} 
        
      />
      
    </div>
  )
}

// --- COMPONENTE ROOT ---
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: isDarkMode ? '#111827' : '#F9FAFB' }}>
        <TopBar />
        <CookieBanner />
        
        <nav style={{ padding: '15px 4%', background: isDarkMode ? '#1F2937' : 'white', borderBottom: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
          <Link to="/" style={{ textDecoration: 'none', color: isDarkMode ? '#F9FAFB' : '#111827', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: '900' }}>Recensioni<span style={{ color: '#FF6600' }}>ITA</span></span>
          </Link>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: isDarkMode ? '#374151' : '#F3F4F6', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '16px', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Cambia Tema">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <a href="https://youtube.com/@recensioniita9?si=Rdg3mXWsViQtWvup" target="_blank" rel="noopener noreferrer" title="Visita il Canale">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </nav>
        
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
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

export default App;