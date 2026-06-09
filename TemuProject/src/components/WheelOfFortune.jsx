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

  const prizes = [
    { title: "Sconto 30% Extra", link: "https://temu.to/k/ef2vpiu4nll", code: "ale016189", desc: "Ottieni 0€ regali e usa il codice nell'app per un 30% extra! Spedizione e resi gratuiti." },
    { title: "Pacchetto 100€", link: "https://temu.to/k/eu5kgk41cby", code: "app39037", desc: "Il tuo pacchetto di coupon 100€ è qui! Sconto extra del 30% sull'app Temu." },
    { title: "Super Sconto 100€", link: "https://temu.to/k/eq781iq9pn5", code: "app39037", desc: "Prendi subito il tuo pacchetto di coupon 100€ e sconto 30%!" },
    { title: "Accesso VIP", link: "https://temu.to/k/eudiy0642tx", code: "alg203906", desc: "Articoli di alta qualità a prezzi bassissimi. Acquista ora e risparmia alla grande!" },
    { title: "Scrigno Segreto", link: "https://temu.to/m/u1te59jbio9", code: "", desc: "Scopri lo scrigno del tesoro di Temu! Approfitta di offerte imperdibili." },
    { title: "Ritenta", link: null, code: "", desc: "Peccato, non hai vinto. Torna domani per un altro giro!" }
  ];

  // Etichette che compaiono graficamente sugli spicchi
  const wheelLabels = ["30%", "100€", "100€", "VIP", "BOX", "NULLA"];

  const handleSpin = () => {
    if (!canPlay) return;
    setSpinning(true);
    
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
    }, 3500);
  };

  return (
    <>
      {/* BOTTONE FLUTTUANTE ELEGANTE */}
      <div 
        onClick={() => setIsOpen(true)}
        style={{ position: 'fixed', top: '90px', right: '15px', background: '#FF6600', color: 'white', padding: '12px 20px', borderRadius: '50px', cursor: 'pointer', zIndex: 9998, boxShadow: '0 4px 20px rgba(255, 102, 0, 0.4)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 102, 0, 0.6)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 102, 0, 0.4)'; }}
      >
        {/* Icona SVG Pacchetto Regalo elegante */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"></polyline>
          <rect x="2" y="7" width="20" height="5"></rect>
          <line x1="12" y1="22" x2="12" y2="7"></line>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </svg>
        <span style={{ display: window.innerWidth > 600 ? 'inline' : 'none', letterSpacing: '0.5px' }}>Vinci Coupon</span>
      </div>

      {/* MODALE RUOTA */}
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: isDarkMode ? '#1F2937' : '#FFFFFF', color: isDarkMode ? '#F9FAFB' : '#111827', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '40px 30px', textAlign: 'center', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            {/* Tasto Chiudi SVG */}
            <button onClick={() => {setIsOpen(false); if(result) setResult(null);}} style={{ position: 'absolute', top: '15px', right: '20px', background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.color='#FF6600'} onMouseLeave={(e)=>e.currentTarget.style.color='#9CA3AF'}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <h2 style={{ fontSize: '26px', margin: '0 0 8px 0', color: '#FF6600', fontWeight: '900', letterSpacing: '-0.5px' }}>Gira e Vinci</h2>
            <p style={{ fontSize: '14px', marginBottom: '30px', color: '#6B7280' }}>Tenta la fortuna per sbloccare sconti extra. Hai a disposizione 1 giro al giorno.</p>

            {!result ? (
              <div style={{ position: 'relative', margin: '0 auto 20px auto', width: '260px', height: '260px', display: 'flex', justifyContent: 'center' }}>
                
                {/* Il cursore in alto (Freccetta fissa) */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  zIndex: 10,
                  width: '0',
                  height: '0',
                  borderLeft: '15px solid transparent',
                  borderRight: '15px solid transparent',
                  borderTop: '25px solid #111827', // Freccia Nera (o bianca in dark mode)
                  filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.3))'
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  zIndex: 11,
                  width: '0',
                  height: '0',
                  borderLeft: '11px solid transparent',
                  borderRight: '11px solid transparent',
                  borderTop: '18px solid #FF6600', // Interno Freccia Arancione
                }}></div>

                {/* Struttura della Ruota Alternata */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: isDarkMode ? '6px solid #374151' : '6px solid #F3F4F6',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15), inset 0 0 20px rgba(0,0,0,0.1)',
                  background: 'conic-gradient(#FF6600 0deg 60deg, #FFF7ED 60deg 120deg, #FF6600 120deg 180deg, #FFF7ED 180deg 240deg, #FF6600 240deg 300deg, #FFF7ED 300deg 360deg)',
                  transition: 'transform 3.5s cubic-bezier(0.1, 0.8, 0.2, 1)',
                  transform: spinning ? 'rotate(2520deg)' : 'rotate(0deg)',
                  overflow: 'hidden'
                }}>
                  
                  {/* Testi degli spicchi calcolati geometricamente */}
                  {wheelLabels.map((label, index) => (
                    <div key={index} style={{
                      position: 'absolute',
                      width: '80px', height: '50%',
                      left: '50%', top: '0',
                      transformOrigin: 'bottom center',
                      transform: `translateX(-50%) rotate(${index * 60 + 30}deg)`,
                      display: 'flex', justifyContent: 'center', paddingTop: '20px',
                      fontWeight: '900', fontSize: '18px',
                      color: index % 2 === 0 ? '#FFFFFF' : '#FF6600',
                      textShadow: index % 2 === 0 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                    }}>
                       {label}
                    </div>
                  ))}

                  {/* Perno Centrale Metallico */}
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '36px', height: '36px',
                    background: '#FFFFFF',
                    border: '6px solid #111827',
                    borderRadius: '50%',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    zIndex: 5
                  }}></div>
                </div>
              </div>
            ) : (
              <div style={{ background: isDarkMode ? '#374151' : '#F9FAFB', padding: '30px 20px', borderRadius: '16px', border: result.link ? '2px solid #10B981' : '2px solid #6B7280' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', color: result.link ? '#10B981' : isDarkMode ? '#F3F4F6' : '#374151' }}>{result.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}>{result.desc}</p>
                
                {result.code && (
                  <div style={{ background: isDarkMode ? '#111827' : '#FFFFFF', padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
                    <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Codice Promozionale</span><br/>
                    <strong style={{ fontSize: '24px', color: '#FF6600', letterSpacing: '2px', display: 'block', marginTop: '5px' }}>{result.code}</strong>
                  </div>
                )}

                {result.link ? (
                  <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#FF6600', color: 'white', padding: '16px', textDecoration: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='#E65C00'} onMouseLeave={(e)=>e.currentTarget.style.background='#FF6600'}>
                    Riscatta Premio
                  </a>
                ) : (
                  <button onClick={() => {setIsOpen(false); setResult(null);}} style={{ background: '#111827', color: 'white', padding: '14px 24px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Chiudi</button>
                )}
                
                {result.link && <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '15px', lineHeight: '1.4' }}>Solo per ordini idonei in app. Si applicano T&C.</p>}
              </div>
            )}

            {/* Pulsante di Avvio */}
            {!result && (
              <div style={{ marginTop: '10px' }}>
                {canPlay ? (
                  <button onClick={handleSpin} disabled={spinning} style={{ background: spinning ? '#E5E7EB' : '#111827', color: spinning ? '#9CA3AF' : 'white', padding: '16px 40px', borderRadius: '50px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: spinning ? 'not-allowed' : 'pointer', transition: 'all 0.2s', width: '100%' }}>
                    {spinning ? 'Estrazione in corso...' : 'Gira la Ruota'}
                  </button>
                ) : (
                  <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '15px', borderRadius: '12px', fontWeight: '600', fontSize: '14px' }}>
                    Hai già tentato la fortuna oggi. Riprova domani!
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}