import React, { useState, useEffect, useRef } from 'react';

export default function ProductFinder({ isDarkMode, cambiaReparto, setFiltroCategoria, setRicerca }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Ciao! 👋 Cosa stai cercando oggi?' }
  ]);
  
  // Aggiunto il pulsante Assistenza al menu iniziale
  const [options, setOptions] = useState([
    { label: '🎣 Pesca', value: 'pesca' },
    { label: '🐠 Acquario', value: 'acquario' },
    { label: '🏕️ Campeggio', value: 'campeggio' }, // <-- NUOVA RIGA
    { label: '🎧 Assistenza', value: 'assistenza' }
  ]);
  
  const messagesEndRef = useRef(null);

  const bgWindow = isDarkMode ? '#1F2937' : '#FFFFFF';
  const textMain = isDarkMode ? '#F9FAFB' : '#111827';
  const bgBot = isDarkMode ? '#374151' : '#F3F4F6';
  const textBot = isDarkMode ? '#F9FAFB' : '#1F2937';
  const border = isDarkMode ? '#374151' : '#E5E7EB';

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, options, isOpen]);

  const handleOptionClick = (val, label) => {
    setMessages(prev => [...prev, { sender: 'user', text: label }]);
    setOptions([]); 

    setTimeout(() => {
      if (val === 'pesca') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ottimo! Mare o Acqua Dolce?' }]);
        setOptions([
          { label: '🌊 Mare', value: 'mare' },
          { label: '💧 Acqua Dolce', value: 'dolce' }
        ]);
      } 
      else if (val === 'acquario') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Perfetto! Cerchi vasche o accessori per la manutenzione?' }]);
        setOptions([
          { label: '🪨 Vasche e Arredi', value: 'vasche' },
          { label: '⚙️ Filtri e Pompe', value: 'tecnica' }
        ]);
      } 
        else if (val === 'campeggio') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ottima scelta! Ti serve qualcosa per dormire, per mangiare o degli accessori utili?' }]);
        setOptions([
          { label: '⛺ Riposo', value: 'riposo' },
          { label: '🍳 Cucina', value: 'cucina' },
          { label: '🔦 Accessori', value: 'accessori' }
        ]);
      }
      else if (val === 'riposo') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ecco le migliori tende e brandine selezionate per te! 🚀' }]);
        eseguiRicerca('🏕️ Campeggio e Bivacco', 'Tende e Riposo', '');
      }
      else if (val === 'cucina') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ecco fornelletti e accessori da campo! 🚀' }]);
        eseguiRicerca('🏕️ Campeggio e Bivacco', 'Cucina da Campo', '');
      }
      else if (val === 'accessori') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ecco torce, coltellini e zaini perfetti per l\'avventura! 🚀' }]);
        eseguiRicerca('🏕️ Campeggio e Bivacco', 'Utensili e Accessori', '');
      }
      // --- INIZIO NUOVA SEZIONE ASSISTENZA ---
      else if (val === 'assistenza') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Come posso aiutarti? Seleziona un\'opzione qui sotto:' }]);
        setOptions([
          { label: '📦 Info Ordini/Spedizioni', value: 'ordini' },
          { label: '💬 Contatti', value: 'contatti' },
          { label: '🔙 Torna alla Ricerca', value: 'home' }
        ]);
      }
      else if (val === 'ordini') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'I prodotti recensiti sul nostro sito sono venduti e spediti da Temu. Per problemi legati a ordini, spedizioni, resi o rimborsi, ti invitiamo a contattare l\'assistenza clienti direttamente sull\'app di Temu. Risolveranno tutto in pochi minuti! 🛡️' }]);
        setTimeout(() => resetChat(), 5000); // Riavvia il bot dopo 5 secondi
      }
      else if (val === 'contatti') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Puoi contattarci per collaborazioni o info tecniche tramite i nostri canali social (trovi i link a fondo pagina). 📧' }]);
        setTimeout(() => resetChat(), 4000);
      }
      else if (val === 'home') {
         resetChat();
      }

      // --- FINE SEZIONE ASSISTENZA ---

      else if (val === 'mare' || val === 'dolce') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ecco le migliori attrezzature selezionate per te! 🚀' }]);
        eseguiRicerca('🎣 Pesca Sportiva', 'Tutte', val === 'mare' ? 'mare' : 'dolce');
      }
      else if (val === 'vasche') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ecco i migliori allestimenti scelti per te! 🚀' }]);
        eseguiRicerca('🐠 Acquariofilia', 'Vasche e Mobili', '');
      }
      else if (val === 'tecnica') {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ecco gli accessori tecnici migliori! 🚀' }]);
        eseguiRicerca('🐠 Acquariofilia', 'Tecnica e Manutenzione', '');
      }
    }, 600); 
  };

  const resetChat = () => {
    setMessages(prev => [...prev, { sender: 'bot', text: 'Posso aiutarti con altro?' }]);
    setOptions([
      { label: '🎣 Pesca', value: 'pesca' },
      { label: '🐠 Acquario', value: 'acquario' },
      { label: '🎧 Assistenza', value: 'assistenza' }
    ]);
  };

  const eseguiRicerca = (reparto, categoria, ricercaTxt) => {
    setTimeout(() => {
      cambiaReparto(reparto);
      setFiltroCategoria(categoria);
      setRicerca(ricercaTxt);
      setIsOpen(false); 
      window.scrollTo({ top: 400, behavior: 'smooth' }); 
      
      setTimeout(() => {
        setMessages([{ sender: 'bot', text: 'Ciao! 👋 Cosa stai cercando oggi?' }]);
        setOptions([
          { label: '🎣 Pesca', value: 'pesca' }, 
          { label: '🐠 Acquario', value: 'acquario' },
          { label: '🎧 Assistenza', value: 'assistenza' }
        ]);
      }, 1000);
    }, 1500); 
  };

  return (
    <>
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          style={{ position: 'fixed', bottom: '25px', right: '25px', width: '60px', height: '60px', backgroundColor: '#FF6600', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', boxShadow: '0 5px 15px rgba(255, 102, 0, 0.4)', zIndex: 9999, transition: 'transform 0.3s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span style={{ fontSize: '30px' }}>🤖</span>
          <div style={{ position: 'absolute', top: '0', right: '0', width: '15px', height: '15px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></div>
        </div>
      )}

      {isOpen && (
        <div style={{ position: 'fixed', bottom: '25px', right: '25px', width: '350px', maxWidth: '90vw', height: '450px', backgroundColor: bgWindow, borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: `1px solid ${border}` }}>
          
          <div style={{ backgroundColor: '#FF6600', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>Assistente Prodotti</h3>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>🟢 Online</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>✖</button>
          </div>

          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{ backgroundColor: msg.sender === 'user' ? '#FF6600' : bgBot, color: msg.sender === 'user' ? 'white' : textBot, padding: '10px 14px', borderRadius: msg.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0', fontSize: '14px', lineHeight: '1.4', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {options.length > 0 && (
            <div style={{ padding: '15px', borderTop: `1px solid ${border}`, backgroundColor: isDarkMode ? '#111827' : '#F9FAFB', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {options.map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleOptionClick(opt.value, opt.label)}
                  style={{ flex: '1 1 calc(50% - 8px)', padding: '10px', backgroundColor: 'transparent', border: `2px solid ${isDarkMode ? '#4B5563' : '#D1D5DB'}`, color: textMain, borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#FF6600'; e.currentTarget.style.color = '#FF6600'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDarkMode ? '#4B5563' : '#D1D5DB'; e.currentTarget.style.color = textMain; }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}