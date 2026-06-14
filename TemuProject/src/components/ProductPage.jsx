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
       const { data: corr } = await supabase.from('products').select('*').eq('categoria', data.categoria).neq('id', data.id).limit(4);
        if (corr) setCorrelati(corr);
      }
    }
    fetchProdotto();
    window.scrollTo(0, 0);
  }, [id]);

  if (!prodotto) return <div style={{ padding: '100px', textAlign: 'center', color: isDarkMode ? '#FFF' : '#000', fontSize: '20px' }}>🎣 Pescando i dettagli dell'offerta...</div>;
const bgPrincipale = isDarkMode ? '#111827' : '#F9FAFB'; // Sfondo generale
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF'; // Sfondo del box prodotto
  const textPrincipale = isDarkMode ? '#F9FAFB' : '#111827'; // Testo BIANCO in dark mode
  const textSecondario = isDarkMode ? '#D1D5DB' : '#4B5563'; // Grigio chiaro per le descrizioni
  const cardBorder = isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB';
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
      <h1 style={{ 
  fontSize: isMobile ? '22px' : '26px', 
  margin: '0 0 20px 0', 
  lineHeight: '1.4',
  color: isDarkMode ? '#F9FAFB' : '#111827' 
}}>
  {titoloOttimizzato}
</h1>
    </>
  );
  // --- AGGIUNGI QUESTA FUNZIONE QUI ---
  // --- FUNZIONE: VERDETTO DINAMICO MULTIPLO E LEGALE ---
  const generaVerdetto = (prodotto) => {
    const idNum = prodotto.id || 1;
    const reparto = prodotto.reparto || '';

    // Libreria di opinioni per la Pesca
    const verdettiPesca = [
      "Un'ottima aggiunta alla tua attrezzatura. Lo abbiamo selezionato perché offre resistenza in pesca e praticità a un prezzo decisamente accessibile.",
      "Dopo aver valutato diverse opzioni, questo articolo spicca per il suo incredibile rapporto qualità-prezzo. Ideale per chi vuole affidabilità sull'acqua senza svuotare il portafoglio.",
      "Materiali sorprendentemente solidi per questa fascia di prezzo. È diventato uno dei nostri 'best buy' consigliati per affrontare le sessioni di pesca in totale tranquillità.",
      "Una piacevole scoperta. Si difende benissimo anche contro prodotti che costano il doppio. Assolutamente approvato per la tua cassetta degli attrezzi."
    ];

    // Libreria di opinioni per l'Acquariofilia
    const verdettiAcquario = [
      "Ideale per il tuo allestimento. Garantisce ottime prestazioni per l'ecosistema della tua vasca, permettendoti di mantenere i costi di gestione contenuti.",
      "Un'ottima soluzione per acquariofili attenti al budget. Efficienza, sicurezza per i pesci e praticità d'uso sono i suoi punti forti.",
      "L'abbiamo inserito tra i nostri preferiti perché aiuta a mantenere l'acquario in salute in modo semplice ed economico. Un acquisto intelligente a lungo termine."
    ];

    // Libreria di opinioni per il Campeggio
    const verdettiCampeggio = [
      "Perfetto per le tue avventure outdoor. Un compromesso eccellente per chi ama il bivacco e cerca attrezzatura compatta senza spendere cifre esorbitanti.",
      "Leggero, pratico e resistente. Un accessorio che aggiunge tanto comfort e che non dovrebbe mai mancare nello zaino o in tenda.",
      "Design intelligente e costo imbattibile. Ha superato le nostre aspettative per quanto riguarda l'utilità in condizioni all'aperto."
    ];

    // Selezione matematica (l'ID del prodotto decide quale frase pescare, così rimane sempre fissa per quel prodotto)
    if (reparto.includes('Pesca')) return verdettiPesca[idNum % verdettiPesca.length];
    if (reparto.includes('Acquario')) return verdettiAcquario[idNum % verdettiAcquario.length];
    if (reparto.includes('Campeggio')) return verdettiCampeggio[idNum % verdettiCampeggio.length];
    
    // Frase generica di sicurezza
    return `Un'ottima scelta per la categoria ${prodotto.categoria || 'selezionata'}. Abbiamo valutato questo prodotto come una delle migliori alternative economiche attualmente disponibili online.`;
  };

  const verdettoTesto = generaVerdetto(prodotto);

 
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

      <a 
        href={prodotto.link_affiliazione} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
          display: 'block',
          textAlign: 'center',
          backgroundColor: prodotto.piattaforma === 'AliExpress' ? '#E62E04' : '#FF6600', 
          color: 'white', 
          padding: '12px', 
          borderRadius: '8px', 
          textDecoration: 'none', 
          fontWeight: 'bold',
          transition: 'background-color 0.2s',
          marginTop: '15px'
        }}
      >
        {prodotto.piattaforma === 'AliExpress' ? '🔴 Vai su AliExpress' : '🟠 Vai su Temu'}
      </a>
        
      <p style={{ fontSize: '11px', color: '#9CA3AF', lineHeight: '1.2', textAlign: 'center', marginTop: '10px', marginBottom: isMobile ? '0' : '15px' }}>
        * In qualità di Affiliato, ricevo una commissione per gli acquisti idonei.
      </p>

      {/* --- BOX CARATTERISTICHE (SOLO DESKTOP) --- */}
      {!isMobile && prodotto.descrizione_estesa && (
        <div style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', background: isDarkMode ? '#1F2937' : '#F9FAFB', border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: isDarkMode ? '#F9FAFB' : '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📌</span> Caratteristiche Principali
          </h4>
          <div 
             style={{ fontSize: '13px', lineHeight: '1.8', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
             dangerouslySetInnerHTML={{ __html: prodotto.descrizione_estesa }} 
          />
        </div>
      )}
    </>
  );
// --- BOX CARATTERISTICHE SALVATO IN UNA VARIABILE ---
  const BoxCaratteristiche = prodotto.descrizione_estesa ? (
    <div style={{ marginTop: '20px', padding: '20px', borderRadius: '12px', background: isDarkMode ? '#1F2937' : '#F9FAFB', border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: isDarkMode ? '#F9FAFB' : '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>📌</span> Caratteristiche Principali
      </h4>
      <div 
         style={{ fontSize: '13px', lineHeight: '1.8', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
         dangerouslySetInnerHTML={{ __html: prodotto.descrizione_estesa }} 
      />
    </div>
  ) : null;
  const BloccoRecensioni = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {/* 1. STELLE E CONDIVISIONE */}
      <div style={{ background: isDarkMode ? '#374151' : '#F9FAFB', padding: '20px', borderRadius: '12px', border: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`, display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><StarRating productId={prodotto.id} /></div>
          <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>🎯 Voto Recensioni ITA</span>
        </div>
        <hr style={{ border: 'none', borderTop: `1px solid ${isDarkMode ? '#4B5563' : '#E5E7EB'}`, margin: '0' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 'bold' }}>Consiglia agli amici:</span>
          <ShareButtons prodotto={prodotto} />
        </div>
      </div>

      {/* 2. BOX: CARATTERISTICHE (SOLO MOBILE) */}
      {isMobile && prodotto.descrizione_estesa && (
        <div style={{ padding: '20px', borderRadius: '12px', background: isDarkMode ? '#1F2937' : '#F9FAFB', border: `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: isDarkMode ? '#F9FAFB' : '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📌</span> Caratteristiche Principali
          </h4>
          <div 
             style={{ fontSize: '13px', lineHeight: '1.8', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}
             dangerouslySetInnerHTML={{ __html: prodotto.descrizione_estesa }} 
          />
        </div>
      )}

      {/* 3. BOX: IL VERDETTO DELL'ESPERTO */}
      <div style={{
        backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
        borderLeft: '4px solid #FF6600',
        padding: '20px',
        borderRadius: '0 12px 12px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ fontSize: '24px' }}>💡</span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: isDarkMode ? '#F9FAFB' : '#111827' }}>
            Il Verdetto di Recensioni ITA
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: isDarkMode ? '#D1D5DB' : '#4B5563' }}>
          {verdettoTesto}
        </p>
      </div>

    </div>
  );

  // --- NUOVO BLOCCO PRODOTTI CORRELATI ---
  const BloccoCorrelati = correlati.length > 0 && (
    <div style={{ marginTop: '50px' }}>
      <h3 style={{ fontSize: '20px', marginBottom: '20px', color: textPrincipale, display: 'inline-block', borderBottom: '3px solid #FF6600', paddingBottom: '8px' }}>
        💡 Potrebbe interessarti anche...
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {correlati.map(corr => (
          <div 
            onClick={() => { navigate(`/prodotto/${corr.id}`); window.scrollTo(0,0); }} 
            key={corr.id} 
            style={{ cursor: 'pointer', background: cardBg, border: cardBorder, borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} 
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; }} 
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <img src={corr.immagine_url} alt={corr.titolo} style={{ height: '120px', width: '100%', objectFit: 'contain', marginBottom: '15px', mixBlendMode: isDarkMode ? 'normal' : 'darken' }} />
            <h4 style={{ fontSize: '13px', margin: '0 0 10px 0', textAlign: 'center', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '36px', lineHeight: '1.4', color: textPrincipale }}>{corr.titolo}</h4>
            <span style={{ fontWeight: '900', color: '#FF6600', fontSize: '18px', marginTop: 'auto' }}>€ {corr.prezzo}</span>
          </div>
        ))}
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
        </Helmet>

        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* FIX TASTO INDIETRO: Ora porta sempre alla home ('/') */}
          <button onClick={() => navigate('/')} style={{ marginBottom: '20px', background: isDarkMode ? '#374151' : '#E5E7EB', color: text, border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = isDarkMode ? '#4B5563' : '#D1D5DB'} onMouseLeave={(e) => e.currentTarget.style.background = isDarkMode ? '#374151' : '#E5E7EB'}>
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

          {/* ECCO LA SEZIONE DEI PRODOTTI CONSIGLIATI */}
          {BloccoCorrelati}

        </div>
      </div>
    </HelmetProvider>
  );
}