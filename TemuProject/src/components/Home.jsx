import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import Header from './Header';
import ProductModal from './ProductModal';
import StarRating from './StarRating';
import ProductCard from './ProductCard';
import WheelOfFortune from './WheelOfFortune';


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
export default function Home({ isDarkMode, ricerca, setRicerca }) {
  
  
  // ... resto dei tuoi useState (ricerca, prodotti, ecc.)
  const [prodotti, setProdotti] = useState([]);
  const navigate = useNavigate();
  const [repartoAttivo, setRepartoAttivo] = useState('🎣 Pesca Sportiva');
  const volantini = ['🎣 Pesca Sportiva', '🐠 Acquariofilia', '🏕️ Campeggio e Bivacco'];
  const [indiceVolantino, setIndiceVolantino] = useState(0);

  // Timer: Cambia il giornale in automatico ogni 10 secondi
  useEffect(() => {
    const timer = setInterval(() => {
      setIndiceVolantino((prev) => (prev + 1) % volantini.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  const [filtroCategoria, setFiltroCategoria] = useState('Tutte');
  const [filtroSottocategoria, setFiltroSottocategoria] = useState('Tutte'); 
  const [filtroPrezzo, setFiltroPrezzo] = useState('Tutti');
  
  const [filtroSconto, setFiltroSconto] = useState('Tutti');
  const [filtroNoDogana, setFiltroNoDogana] = useState(false); 
  const [popupClosed, setPopupClosed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const prodottiPerPagina = 18;
  const [mostraFiltri, setMostraFiltri] = useState(false);
  
  // --- INIZIO LOGICA GIORNALE ---
  // Prendiamo i primi 4 prodotti del catalogo per metterli in prima pagina (puoi cambiare la logica in futuro per scegliere i best-seller)
  // --- INIZIO LOGICA VOLANTINO / GIORNALE ---
  // Prendiamo i primi 9 prodotti (il sistema li mescola già in automatico ogni giorno!)
  // Ordina i prodotti dal più costoso al più economico per dare un senso logico al volantino
  const prodottiVolantino = [...prodotti]
    .sort((a, b) => parseFloat(b.prezzo) - parseFloat(a.prezzo)) 
    .slice(0, 9);
  const prodottoCopertina = prodottiVolantino[0];
  const prodottiSpalla = prodottiVolantino.slice(1, 7); // 4 prodotti a lato
  const prodottiStriscia = prodottiVolantino.slice(5, 9); // 4 prodotti in basso

  const handleNewsClick = (idProdotto) => {
    navigate(`/prodotto/${idProdotto}`);
  };
  // --- FINE LOGICA VOLANTINO / GIORNALE ---
  // --- FINE LOGICA GIORNALE ---
  // 1. Il tuo useEffect che carica e mescola i prodotti
  
  useEffect(() => {
    async function getProdotti() {
      setLoading(true); // <-- INIZIA IL CARICAMENTO
      
      const { data, error } = await supabase.from('products').select('*');
      
      if (error) {
        console.error("Errore nel caricamento:", error);
        setLoading(false);
        return;
      }

      if (data) {
        const oggi = new Date().toDateString();
        let seed = oggi.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

        const randomGiornaliero = () => {
          let x = Math.sin(seed++) * 10000;
          return x - Math.floor(x);
        };

        let prodottiMescolati = [...data];
        for (let i = prodottiMescolati.length - 1; i > 0; i--) {
          const j = Math.floor(randomGiornaliero() * (i + 1));
          [prodottiMescolati[i], prodottiMescolati[j]] = [prodottiMescolati[j], prodottiMescolati[i]];
        }

        setProdotti(prodottiMescolati);
        setLoading(false); // <-- FINE DEL CARICAMENTO
      }
    }
    getProdotti();
  }, []);

  // 2. IL NUOVO useEffect DA INCOLLARE QUI SOTTO:
  // Resetta sempre alla pagina 1 quando l'utente cambia un qualsiasi filtro
 // 2. IL NUOVO useEffect DA INCOLLARE QUI SOTTO:
  // Resetta sempre alla pagina 1 quando l'utente cambia un qualsiasi filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [repartoAttivo, filtroCategoria, filtroSottocategoria, filtroPrezzo, filtroSconto, ricerca]);

  // --- NUOVA MAGIA: SCROLL AUTOMATICO DURANTE LA RICERCA ---
  useEffect(() => {
    // Se l'utente digita almeno 3 lettere, la pagina scivola giù verso i prodotti
    if (ricerca && ricerca.length >= 3) {
      const catalogo = document.getElementById('sezione-ricerca');
      if (catalogo) {
        setTimeout(() => {
          catalogo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    }
  }, [ricerca]);

  const cambiaReparto = (nuovoReparto) => {
    setRepartoAttivo(nuovoReparto); 
    setFiltroCategoria('Tutte'); 
    setFiltroSottocategoria('Tutte'); 
    setFiltroPrezzo('Tutti'); 
    setRicerca('');
    setFiltroSconto('Tutti'); 
  }

  const testoRicerca = (ricerca || "").toString().trim().toLowerCase();

  const prodottiFiltrati = prodotti.filter(p => {
    const haRicerca = testoRicerca.length > 0;

    // TECNICA SMART KEYWORDS (STESSA DEL CHATBOT)
    let passaRicerca = true;
    if (haRicerca) {
      // Usiamo "testoRicerca" che è sicuro, non crasherà mai
      const keywords = testoRicerca.split(' ').filter(w => w.length > 2);
      
      if (keywords.length > 0) {
        const testoProdotto = `${p.titolo} ${p.reparto} ${p.categoria} ${p.sottocategoria} ${p.descrizione_estesa}`.toLowerCase();
        // Il prodotto passa se contiene ALMENO UNA delle parole digitate dall'utente
        passaRicerca = keywords.some(kw => testoProdotto.includes(kw));
      } else {
        // Se scrive parole cortissime (es. "da"), usa un controllo classico di sicurezza
        passaRicerca = p.titolo ? p.titolo.toLowerCase().includes(testoRicerca) : false;
      }
    }

    // Se l'utente compie una ricerca, disattiviamo momentaneamente il blocco del reparto per cercare ovunque
    let passaReparto = haRicerca 
      ? passaRicerca 
      : (p.reparto === repartoAttivo || (!p.reparto && repartoAttivo === '🎣 Pesca Sportiva'));
    
    let passaCategoria = haRicerca 
      ? true 
      : (filtroCategoria === 'Tutte' || p.categoria === filtroCategoria || p.sottocategoria === filtroCategoria);
    
    let passaSottocategoria = haRicerca ? true : (filtroSottocategoria === 'Tutte' || p.sottocategoria === filtroSottocategoria);
    
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

    let passaDogana = filtroNoDogana ? p.no_dogana === true : true;

    return passaReparto && passaRicerca && passaCategoria && passaSottocategoria && passaPrezzo && passaSconto && passaDogana;
  });
  const bgPrincipale = isDarkMode ? '#111827' : '#F9FAFB';
  const textPrincipale = isDarkMode ? '#F3F4F6' : '#111827';
  const cardBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const cardBorder = isDarkMode ? '#374151' : '#E5E7EB';

  const indiceUltimoProdotto = currentPage * prodottiPerPagina;
  const indicePrimoProdotto = indiceUltimoProdotto - prodottiPerPagina;
  
  const prodottiPaginati = prodottiFiltrati.slice(indicePrimoProdotto, indiceUltimoProdotto);
  const totalePagine = Math.ceil(prodottiFiltrati.length / prodottiPerPagina);
// Aggiungi questa riga prima del filter

  //   <div> ...
return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: bgPrincipale, paddingBottom: '100px', minHeight: '100vh', color: textPrincipale }}>
      
      <WheelOfFortune isDarkMode={isDarkMode} />
      <ToastPromo />
      <ExitIntentPopup isDarkMode={isDarkMode} />
      <FakeSalesToast prodotti={prodotti} isDarkMode={isDarkMode} />
      
      {/* 1. I 3 PROTAGONISTI IN CIMA: MENU DELLE CATEGORIE (HEADER) */}
      <Header 
        repartiMap={repartiMap}
        repartoAttivo={repartoAttivo}
        setRepartoAttivo={cambiaReparto}
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        isDarkMode={isDarkMode}
      />

      <div style={{ padding: '20px 0' }}>
      
        {/* 2. BARRA DI RICERCA E FILTRI COMPATTI */}
        <div style={{ marginBottom: '25px', padding: '0 4%' }}>
          
          {/* RIGA 1: RICERCA + BOTTONE FILTRI */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            
            {/* Barra di ricerca principale */}
            <div style={{ flex: '1', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: '#9CA3AF' }}>🔍</span>
              <input 
                type="text" 
                placeholder="Cerca un prodotto..." 
                value={ricerca} 
                onChange={(e) => setRicerca(e.target.value)} 
                style={{ width: '100%', padding: '10px 15px 10px 38px', borderRadius: '50px', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB', background: isDarkMode ? '#1F2937' : '#FFFFFF', color: textPrincipale, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            
            {/* Pulsante per mostrare/nascondere i filtri avanzati */}
            <button 
              onClick={() => setMostraFiltri(!mostraFiltri)}
              style={{ flex: '0 0 auto', padding: '10px 16px', borderRadius: '50px', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB', background: mostraFiltri ? (isDarkMode ? '#374151' : '#F3F4F6') : (isDarkMode ? '#1F2937' : '#FFFFFF'), color: textPrincipale, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
            >
              <span>⚙️</span> Filtri
            </button>
            
          </div>

          {/* RIGA 2: FILTRI AVANZATI (Visibili solo se mostraFiltri è true) */}
          {mostraFiltri && (
            <div id="sezione-filtri-avanzati" style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '12px',
              overflowX: 'auto', 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none', 
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '4px' // Leggero padding per non tagliare eventuali ombre
            }}>
              <style>{`#sezione-filtri-avanzati::-webkit-scrollbar { display: none; }`}</style>
              
              <select value={filtroPrezzo} onChange={(e) => setFiltroPrezzo(e.target.value)} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '50px', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB', background: isDarkMode ? '#1F2937' : '#FFFFFF', color: textPrincipale, outline: 'none', fontSize: '13px', cursor: 'pointer' }}>
                <option value="Tutti">Prezzo: Tutti</option>
                <option value="0-10">Sotto i 10 €</option>
                <option value="10-30">10 € - 30 €</option>
                <option value="30+">Oltre 30 €</option>
              </select>

              <select value={filtroSconto} onChange={(e) => setFiltroSconto(e.target.value)} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '50px', border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB', background: isDarkMode ? '#1F2937' : '#FFFFFF', color: textPrincipale, outline: 'none', fontSize: '13px', cursor: 'pointer' }}>
                <option value="Tutti">Sconto: Tutti</option>
                <option value="30">Più del 30%</option>
                <option value="50">Più del 50%</option>
              </select>

              <button onClick={() => setFiltroNoDogana(!filtroNoDogana)} style={{ flex: '0 0 auto', padding: '8px 14px', borderRadius: '50px', border: filtroNoDogana ? '1px solid #059669' : (isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB'), background: filtroNoDogana ? 'rgba(5, 150, 105, 0.15)' : (isDarkMode ? '#1F2937' : '#FFFFFF'), color: filtroNoDogana ? '#10B981' : textPrincipale, fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🇪🇺</span> {filtroNoDogana ? 'Magazzino EU' : 'Anche Extra-UE'}
              </button>
              
            </div>
          )}
        </div>

        
        {/* 3. IL GIORNALE DELLE OFFERTE (EFFETTO QUOTIDIANO REALE) */}
        {/* LA CONDIZIONE AVVOLGE TUTTO IL BLOCCO: SE C'È RICERCA, IL GIORNALE SCOMPARE */}
        {ricerca === "" && (
          <div style={{ position: 'relative', maxWidth: '1400px', width: '96%', margin: '0 auto 40px auto' }}>
            
            <button onClick={() => setIndiceVolantino(prev => prev === 0 ? volantini.length - 1 : prev - 1)} style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: '#111827', color: 'white', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❮</button>
            <button onClick={() => setIndiceVolantino(prev => (prev + 1) % volantini.length)} style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: '#111827', color: 'white', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>❯</button>

            {/* Sfondo tipo carta stampata con bordo da pagina */}
            <div style={{ background: isDarkMode ? '#1F2937' : '#FCFBF8', border: isDarkMode ? '1px solid #374151' : '1px solid #D1D5DB', borderRadius: '2px', padding: 'clamp(15px, 3vw, 25px)', boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.5)' : '2px 10px 30px rgba(0,0,0,0.08)' }}>
              
              {(() => {
                const repartoCorrente = volantini[indiceVolantino];
                const prodottiDelGiorno = prodotti.filter(p => p.reparto === repartoCorrente).slice(0, 10);
                if (prodottiDelGiorno.length === 0) return <div style={{textAlign: 'center', padding: '30px', fontSize: '14px'}}>Stampa in corso...</div>;

                const prodottiOrdinati = [...prodottiDelGiorno].sort((a, b) => parseFloat(b.prezzo || 0) - parseFloat(a.prezzo || 0));
                const prodottoCopertina = prodottiOrdinati[0];
                const prodottiSpalla = prodottiOrdinati.slice(1, 5);
                const prodottiStriscia = prodottiOrdinati.slice(5, 10);
                
                // Data dinamica per sembrare un quotidiano di oggi
                const dataOggi = new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                return (
                  <>
                    {/* TESTATA DEL GIORNALE - Stile Editoriale Moderno */}
                    <div style={{ textAlign: 'center', borderBottom: isDarkMode ? '2px solid #4B5563' : '2px solid #E5E7EB', paddingBottom: '15px', marginBottom: '30px' }}>
                      <h1 style={{ fontFamily: '"Georgia", "Times New Roman", serif', fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 'bold', margin: '0', textTransform: 'uppercase', letterSpacing: '-1px', color: isDarkMode ? '#F9FAFB' : '#111827', lineHeight: '1' }}>
                        Gazzetta delle Offerte
                      </h1>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB', padding: '8px 5px', marginTop: '15px', fontFamily: 'system-ui, sans-serif', fontSize: 'clamp(10px, 2vw, 12px)', color: isDarkMode ? '#9CA3AF' : '#6B7280', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        <span style={{ fontWeight: '500' }}>Edizione Digitale</span>
                        <span style={{ color: '#FF6600', fontWeight: '800', fontSize: 'clamp(12px, 2.5vw, 14px)', letterSpacing: '2px' }}>{repartoCorrente}</span>
                        <span style={{ fontWeight: '500' }}>{dataOggi}</span>
                      </div>
                    </div>

                    {/* CORPO DEL GIORNALE - Layout a 2 Colonne Pulito */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                      
                      {/* COLONNA SINISTRA: L'ARTICOLO PRINCIPALE */}
                      <div onClick={() => handleNewsClick(prodottoCopertina.id)} style={{ flex: '1 1 500px', cursor: 'pointer', display: 'flex', flexDirection: 'column', paddingRight: '15px', borderRight: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB' }}>
                        <span style={{ display: 'inline-block', color: '#EF4444', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>In Evidenza</span>
                        <h2 style={{ fontFamily: '"Georgia", serif', fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: '1.1', color: isDarkMode ? '#F9FAFB' : '#111827' }}>{prodottoCopertina.titolo}</h2>
                        
                        <div style={{ width: '100%', height: 'clamp(250px, 40vw, 350px)', backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', overflow: 'hidden' }}>
                          <img src={prodottoCopertina.immagine_url || "https://placehold.co/600x400"} alt={prodottoCopertina.titolo} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', mixBlendMode: isDarkMode ? 'normal' : 'multiply', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB', paddingTop: '15px' }}>
                          <span style={{ fontSize: '13px', color: isDarkMode ? '#9CA3AF' : '#6B7280', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prezzo Consigliato</span>
                          <span style={{ fontSize: '2.8rem', fontWeight: '900', color: '#FF6600', lineHeight: '1', letterSpacing: '-1px' }}>{prodottoCopertina.prezzo ? `${prodottoCopertina.prezzo}€` : "TOP"}</span>
                        </div>
                      </div>

                      {/* COLONNA DESTRA: GLI ARTICOLI SPALLA */}
                      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: isDarkMode ? '#D1D5DB' : '#111827', textTransform: 'uppercase', borderBottom: isDarkMode ? '2px solid #374151' : '2px solid #111827', paddingBottom: '8px', fontFamily: 'system-ui, sans-serif' }}>I Più Letti</span>

                        {prodottiSpalla.slice(0, 4).map((p, index) => (
                          <div key={index} onClick={() => handleNewsClick(p.id)} style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', cursor: 'pointer', paddingBottom: '15px', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #F3F4F6' }}>
                            <div style={{ width: '100px', height: '100px', flexShrink: 0, backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', borderRadius: '6px', padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <img src={p.immagine_url || "https://placehold.co/150"} alt={p.titolo} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: isDarkMode ? 'normal' : 'multiply' }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', height: '100px' }}>
                              <div>
                                <h3 style={{ fontFamily: '"Georgia", serif', fontSize: '14px', fontWeight: 'bold', margin: '0 0 6px 0', color: isDarkMode ? '#F9FAFB' : '#111827', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.3' }}>{p.titolo}</h3>
                                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: isDarkMode ? '#9CA3AF' : '#6B7280', margin: '0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                  {(() => { const incipit = ["Vero affare del giorno.", "Fortemente consigliato.", "Ribasso clamoroso.", "Molto ricercato."]; return `${incipit[(p.id || index) % incipit.length]} Qualità costruttiva eccellente per la sua fascia di prezzo.`; })()}
                                </p>
                              </div>
                              <span style={{ fontSize: '18px', fontWeight: '900', color: '#FF6600', textAlign: 'right' }}>{p.prezzo ? `${p.prezzo}€` : "Vedi"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* STRISCIA OFFERTE LAMPO */}
                    <div style={{ marginTop: '30px', borderTop: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB', paddingTop: '15px' }}>
                      <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: '800', color: isDarkMode ? '#9CA3AF' : '#6B7280', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif', letterSpacing: '1px', marginBottom: '10px', backgroundColor: isDarkMode ? '#374151' : '#F3F4F6', padding: '4px 8px', borderRadius: '4px' }}>Flash News • Ultime Aggiunte</span>
                      
                      <div style={{ display: 'flex', overflowX: 'auto', gap: '25px', paddingBottom: '10px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {prodottiStriscia.map((p, index) => (
                          <div key={index} onClick={() => handleNewsClick(p.id)} style={{ flex: '0 0 220px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                            <div style={{ width: '50px', height: '50px', flexShrink: 0, backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', borderRadius: '4px', padding: '2px' }}>
                              <img src={p.immagine_url || "https://placehold.co/100"} alt={p.titolo} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: isDarkMode ? 'normal' : 'multiply' }} />
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <h4 style={{ fontFamily: 'system-ui, sans-serif', margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600', color: isDarkMode ? '#E5E7EB' : '#374151', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{p.titolo}</h4>
                              <span style={{ fontSize: '15px', fontWeight: '800', color: '#EF4444' }}>{p.prezzo ? `${p.prezzo}€` : "Offerta"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* 4. GRIGLIA GENERALE DEL CATALOGO ... (lasciala invariata da qui in giù) test*/}
        {loading ? (
          // --- EFFETTO DI CARICAMENTO (Spinner) ---
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTop: '4px solid #FF6600', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{"@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }"}</style>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px', padding: '0 4%' }}>
            {prodottiPaginati.map((prodotto) => {
              
              const prezzoNum = prodotto.prezzo ? parseFloat(prodotto.prezzo.toString().replace(',', '.')) : 0;
              const prezzoBarrato = (prezzoNum * 1.3).toFixed(2);
              const scontoPercentuale = 45 + ((prodotto.id * 3) % 30);
              const coloreBrand = prodotto.piattaforma === 'AliExpress' ? '#E62E04' : '#FF6600';

              return (
                  <Link 
                    to={`/prodotto/${prodotto.id}`}
                    key={prodotto.id} 
                    style={{ 
                      textDecoration: 'none', color: 'inherit', cursor: 'pointer', position: 'relative', 
                      display: 'flex', flexDirection: 'column', padding: '15px', borderRadius: '20px', 
                      background: cardBg, 
                      border: `1px solid ${coloreBrand}30`, 
                      borderTop: `4px solid ${coloreBrand}`, 
                      boxShadow: isDarkMode ? `0 10px 30px ${coloreBrand}15` : `0 10px 30px ${coloreBrand}15`, 
                      transition: 'transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease' 
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-5px)'; 
                      e.currentTarget.style.boxShadow = `0 15px 35px ${coloreBrand}35`; 
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'translateY(0)'; 
                      e.currentTarget.style.boxShadow = `0 10px 30px ${coloreBrand}15`; 
                    }}
                  >
                  {/* BADGE DINAMICO */}
                  <span style={{ 
                    position: 'absolute', top: '12px', left: '12px', 
                    background: coloreBrand, 
                    color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '3px 6px', 
                    borderRadius: '4px', zIndex: 2, textTransform: 'uppercase', letterSpacing: '0.5px' 
                  }}>
                    {prodotto.piattaforma === 'AliExpress' ? 'AliExpress Choice' : 'Temu Pick'}
                  </span>

                  <div style={{ position: 'relative', height: '180px', width: '100%', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDarkMode ? '#111827' : '#F9FAFB', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '8px', right: '8px', background: '#EF4444', color: 'white', padding: '4px 8px', borderRadius: '20px', fontSize: '13px', fontWeight: '900', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 5 }}>
                      -{scontoPercentuale}%
                    </div>
                    {prodotto.immagine_url ? (
                      <img 
                        src={prodotto.immagine_url} 
                        loading="lazy" /* <-- LAZY LOADING AGGIUNTO QUI */
                        alt={prodotto.titolo} 
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/e5e7eb/6b7280?text=Immagine+Non+Disponibile'; }} 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                      />
                    ) : <span style={{ color: '#9CA3AF' }}>No Img</span>}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '900', fontSize: '24px', color: coloreBrand }}>€ {prodotto.prezzo}</span>
                    <span style={{ fontSize: '13px', color: '#6B7280', textDecoration: 'line-through' }}>{prezzoBarrato}€</span>
                  </div>

                  {/* Trova questo tag h3 e sostituiscilo con questa versione migliorata */}
<h3 
  title={prodotto.titolo} 
  style={{ 
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', /* Font nativo modernissimo */
    fontSize: '13px', /* Più compatto e raffinato */
    fontWeight: '500', /* Elegante, non troppo spesso */
    color: isDarkMode ? '#F3F4F6' : '#374151', /* Grigio scuro premium invece del nero sparato */
    margin: '0 0 8px 0', 
    lineHeight: '1.4', 
    display: '-webkit-box', 
    WebkitLineClamp: 2, 
    WebkitBoxOrient: 'vertical', 
    overflow: 'hidden', 
    height: '36px', /* Allinea tutte le card in modo simmetrico */
    letterSpacing: '-0.3px' /* Stringe leggermente i caratteri per un look più "smart" */
  }}>
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
        )}
        
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
// --- NUOVA HERO SECTION PREMIUM ---


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
