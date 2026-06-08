import React from 'react';

export default function ShareButtons({ prodotto }) {
  // Sicurezza: se il prodotto non ha ancora caricato, non mostrare nulla
  if (!prodotto) return null;

  const messaggio = `Guarda questa offerta: ${prodotto.titolo} a soli €${prodotto.prezzo}!`;
  const linkSito = window.location.href; 
  
  const waLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(messaggio + " " + linkSito)}`;
  const tgLink = `https://t.me/share/url?url=${encodeURIComponent(linkSito)}&text=${encodeURIComponent(messaggio)}`;

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '6px 12px', borderRadius: '50px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
        💬 WhatsApp
      </a>
      <a href={tgLink} target="_blank" rel="noopener noreferrer" style={{ background: '#0088cc', color: 'white', padding: '6px 12px', borderRadius: '50px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
        ✈️ Telegram
      </a>
    </div>
  );
}