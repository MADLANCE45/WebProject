import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// IMPORT CORRETTO E AGGIORNATO QUI SOTTO:
import { Helmet, HelmetProvider } from 'react-helmet-async'; 
import { supabase } from '../supabaseClient'; 
import StarRating from './StarRating';
import ShareButtons from './ShareButtons'; 

export default function ProductPage({ isDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prodotto, setProdotto] = useState(null);
  const [correlati, setCorrelati] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function fetchProdotto() {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (data) {
        setProdotto(data);
        const { data: corr } = await supabase.from('products').select('*').eq('categoria', data.categoria).neq('id', data.id).limit(3);
        if (corr) setCorrelati(corr);
      }
    }
    fetchProdotto();
    window.scrollTo(0, 0);
  }, [id]);

  if (!prodotto) return <div style={{ padding: '100px', textAlign: 'center', color: isDarkMode ? '#FFF' : '#000', fontSize: '20px' }}>🎣 Pescando i dettagli dell'offerta...</div>;

  const bg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const text = isDarkMode ? '#F9FAFB' : '#111827';
  let prezzoBarrato = "0.00";
  if(prodotto.prezzo) {
    prezzoBarrato = ((parseFloat(prodotto.prezzo.toString().replace(',', '.'))) * 1.3).toFixed(2);
  }

  // --- 1. FUNZIONE: MANIPOLAZIONE DINAMICA DEL TITOLO (SEO) ---
  const generaTitoloSEO = (titoloOriginale, idProd) => {
    if (!titoloOriginale) return "Offerta Speciale";
    const titoloBreve = titoloOriginale.split(' ').slice(0, 6).join(' ').replace(/,$/, ''); 
    
    const suffissi = [
      " - Offerta Lampo ⚡",
      " | Recensione e Test 2026",
      " - Miglior Prezzo 🔥",
      " | Opinioni Reali",
      " - Sconto Esclusivo 🎁"
    ];
    const suffisso = suffissi[(idProd || 0) % suffissi.length];
    
    return `${titoloBreve}${suffisso}`;
  };

  const titoloOttimizzato = generaTitoloSEO(prodotto.titolo, prodotto.id);

  const recensioniList = [
    { nome: "Ale A.", testo: "Prodotto eccellente, spedizione super veloce! Davvero consigliato per il prezzo." },
    { nome: "Giulia F.", testo: "Rapporto qualità-prezzo imbattibile. Arrivato prima del previsto e ben imballato." },
    { nome: "Matteo R.", testo: "Tutto perfetto, i materiali sembrano di ottima qualità. Sicuramente comprerò ancora da qui." },
    { nome: "Simona C.", testo: "Esattamente come in foto. Molto utile e pratico, fa esattamente quello che promette." }
  ];
  const idNum = prodotto.id || 1;
  const rec1 = recensioniList[idNum % recensioniList.length];

  const BloccoTitolo = (
    <>
      <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', display: 'inline-block' }}>{prodotto.reparto} &gt; {prodotto.categoria}</span>
      <h1 style={{ fontSize: isMobile ? '22px' : '26px', margin: '0 0 20px 0', lineHeight: '1.4' }}>{titoloOttimizzato}</h1>
    </>
  );

  const BloccoImmagine = (
    <div style={{ height: isMobile ? '300px' : '400px', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', background: isDarkMode ? '#111827' : '#F3F4F6', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }}>
      <span style={{ position: 'absolute', top: '15px', left: '15px', background: '#FF6600', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '5px 10px', borderRadius: '6px', zIndex: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Top Scelta</span>
      {prodotto.immagine_url ? <img src={prodotto.immagine_url} alt={titoloOttimizzato} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', mixBlendMode: isDarkMode ? 'normal' : 'darken' }} /> : 'Nessuna Immagine'}
    </div>
  );

  const BloccoAcquisto = (
    <>
      <div style={{ background: isDarkMode ? '#374151' : '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '12px 15px', borderRadius: '6px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '22px' }}>⏳</span>
        <span style={{ fontSize: '13.5px', color: isDarkMode ? '#FCA5A5' : '#B91C1C', fontWeight: 'bold', lineHeight: '1.4' }}>Affrettati! Le offerte lampo e la disponibilità<br/>possono terminare in qualsiasi momento.</span>
      </div>
      
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span style={{ fontWeight: '900', fontSize: '46px', color: '#FF6600', letterSpacing: '-1px' }}>€ {prodotto.prezzo}</span>
        <span style={{ fontSize: '16px', color: '#9CA3AF', textDecoration: 'line-through' }}>{prezzoBarrato}€</span>
      </div>

      <a href={prodotto.link_affiliazione} className="temu-buy-btn" target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: 'linear-gradient(135deg, #FF7B00 0%, #FF4400 100%)', color: 'white', padding: '18px', textDecoration: 'none', borderRadius: '14px', fontSize: '22px', fontWeight: '900', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(255, 102, 0, 0.5)', marginBottom: '10px', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
        🔥 Vai all'Offerta su Temu
      </a>
      <p style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: '1.2', textAlign: 'center', marginBottom: isMobile ? '0' : '30px' }}>
        * In qualità di Affiliato, ricevo una commissione per gli acquisti idonei.
      </p>
    </>
  );

  const BloccoRecensioni = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div style={{ background: isDarkMode ? '#374151' : '#F9FAFB', padding: '20px', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><StarRating productId={prodotto.id} /></div>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>✓ Acquisto Verificato</span>
        </div>
        <hr style={{ border: 'none', borderTop: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`, margin: '0' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 'bold' }}>Consiglia agli amici:</span>
          <ShareButtons prodotto={prodotto} />
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: '14px', marginBottom: '12px', color: text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recensioni Recenti</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: isDarkMode ? '#1F2937' : '#FFFFFF', padding: '15px', borderRadius: '10px', border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#FBBF24', fontSize: '14px' }}>★★★★★</span><span style={{ fontWeight: 'bold', fontSize: '13px' }}>{rec1.nome}</span>
            </div>
            <p style={{ fontSize: '13px', margin: 0, color: isDarkMode ? '#D1D5DB' : '#4B5563', fontStyle: 'italic' }}>"{rec1.testo}"</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <HelmetProvider>
      <div style={{ background: isDarkMode ? 'radial-gradient(circle at top, #1E293B 0%, #0F172A 100%)' : 'radial-gradient(circle at top, #FFFFFF 0%, #F1F5F9 100%)', minHeight: '100vh', padding: '30px 4%' }}>
        
        <Helmet>
          <title>{titoloOttimizzato} | Recensioni ITA</title>
          <meta name="description" content={`Stai cercando opinioni su ${titoloOttimizzato}? Scoprilo oggi a soli €${prodotto.prezzo}. Spedizione sempre gratuita.`} />
          <meta property="og:title" content={titoloOttimizzato} />
          <meta property="og:image" content={prodotto.immagine_url} />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": titoloOttimizzato,
              "image": [prodotto.immagine_url],
              "description": `Recensione e dettagli di ${titoloOttimizzato}.`,
              "offers": {
                "@type": "Offer",
                "url": window.location.href,
                "priceCurrency": "EUR",
                "price": prodotto.prezzo ? prodotto.prezzo.toString().replace(',', '.') : "0.00",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "124"
              }
            })}
          </script>
        </Helmet>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: isDarkMode ? '#374151' : '#E5E7EB', color: text, border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ← Torna al catalogo
          </button>

          <div style={{ background: bg, borderRadius: '16px', padding: isMobile ? '20px' : '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>{BloccoTitolo}</div>{BloccoImmagine}<div>{BloccoAcquisto}</div>{BloccoRecensioni}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'flex-start', flexDirection: 'row' }}>
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {BloccoImmagine}
                  {BloccoRecensioni}
                </div>
                <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column' }}>
                  {BloccoTitolo}
                  {BloccoAcquisto}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
}