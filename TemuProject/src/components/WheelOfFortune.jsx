import React, { useState, useEffect } from 'react';

export default function WheelOfFortune({ isDarkMode }) {
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