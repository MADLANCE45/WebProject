import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function ChatAssistant({ isDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  // --- NUOVA MAGIA: APRI LA CHAT SE IL LINK È SPECIALE ---
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('ai') === 'true') {
      // Se nel link c'è scritto ?ai=true, apri il bot in automatico dopo 1 secondo!
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Ciao! 👋 Sono il tuo Personal Shopper Virtuale. Dimmi cosa stai cercando (es. "una tenda impermeabile" o "mulinello da spinning") e ti troverò le migliori offerte!' 
    }
  ]);
  
  const messagesEndRef = useRef(null);

  // Scrolla sempre verso il basso quando arriva un nuovo messaggio
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    // 1. Estraiamo le parole chiave ignorando le parole corte (es. "un", "la", "di")
    const keywords = userText.toLowerCase().split(' ').filter(w => w.length > 3);

    setTimeout(async () => {
      // 2. Cerchiamo nel database
      const { data, error } = await supabase.from('products').select('*');
      
      setIsTyping(false);

      if (error || !data) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Ops, ho un calo di connessione. Riprova tra poco!' }]);
        return;
      }

      // 3. Logica IA simulata: trova i prodotti che contengono le parole chiave cercate
      const risultati = data.filter(p => {
        const testoProdotto = `${p.titolo} ${p.categoria} ${p.sottocategoria} ${p.descrizione_estesa}`.toLowerCase();
        // Cerca se ALMENO UNA parola chiave è presente nel prodotto
        return keywords.some(kw => testoProdotto.includes(kw));
      }).slice(0, 3); // Restituiamo solo le 3 migliori opzioni per non intasare la chat

      if (risultati.length > 0) {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: 'Ecco i prodotti perfetti per la tua richiesta:' },
          { sender: 'bot', type: 'products', items: risultati }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          { sender: 'bot', text: 'Non ho trovato esattamente questo articolo. Prova a usare parole diverse (es. "acquario", "zaino", "esca").' }
        ]);
      }
    }, 1200); // Ritardo simulato per dare l'effetto "sto pensando..."
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // --- STILI ---
  const themeBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const themeText = isDarkMode ? '#F3F4F6' : '#111827';
  const themeBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const userBubble = '#FF6600';
  const botBubble = isDarkMode ? '#374151' : '#F3F4F6';

  return (
    <>
      {/* BOTTONE FLUTTUANTE */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: '#FF6600', color: 'white', border: 'none',
          boxShadow: '0 4px 15px rgba(255,102,0,0.4)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', transition: 'transform 0.2s',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* FINESTRA DELLA CHAT */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '20px', zIndex: 9998,
          width: '350px', height: '500px', maxWidth: '90vw',
          backgroundColor: themeBg, borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)', border: `1px solid ${themeBorder}`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          fontFamily: 'Inter, sans-serif'
        }}>
          {/* HEADER CHAT */}
          <div style={{ background: '#FF6600', color: 'white', padding: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🤖</span> Assistente AI
          </div>

          {/* AREA MESSAGGI */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                
                {/* Messaggio di testo normale */}
                {msg.text && (
                  <div style={{
                    padding: '10px 14px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.4',
                    background: msg.sender === 'user' ? userBubble : botBubble,
                    color: msg.sender === 'user' ? 'white' : themeText,
                    borderBottomRightRadius: msg.sender === 'user' ? '4px' : '12px',
                    borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '12px',
                  }}>
                    {msg.text}
                  </div>
                )}

                {/* Carosello Prodotti Trovati */}
                {msg.type === 'products' && msg.items && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '5px' }}>
                    {msg.items.map(prod => (
                      <Link to={`/prodotto/${prod.id}`} onClick={() => setIsOpen(false)} key={prod.id} style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', 
                        background: isDarkMode ? '#111827' : '#FFFFFF', border: `1px solid ${themeBorder}`, 
                        borderRadius: '8px', textDecoration: 'none', color: themeText
                      }}>
                        <img src={prod.immagine_url} alt={prod.titolo} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{prod.titolo}</div>
                          <div style={{ fontSize: '12px', color: '#FF6600', fontWeight: '900' }}>€ {prod.prezzo}</div>
                        </div>
                      </Link>
                    ))}
                    <div style={{ fontSize: '10px', color: '#9CA3AF', fontStyle: 'italic', marginTop: '4px' }}>*I link proposti sono affiliati.</div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Animazione "Sta digitando..." */}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', background: botBubble, padding: '10px 14px', borderRadius: '12px', borderBottomLeftRadius: '4px' }}>
                <span style={{ animation: 'blink 1s infinite' }}>...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* AREA INPUT */}
          <div style={{ padding: '10px', borderTop: `1px solid ${themeBorder}`, background: themeBg, display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Scrivi qui..." 
              style={{ flex: 1, padding: '10px', borderRadius: '20px', border: `1px solid ${themeBorder}`, background: isDarkMode ? '#111827' : '#F9FAFB', color: themeText, outline: 'none' }}
            />
            <button 
              onClick={handleSend}
              style={{ background: '#FF6600', color: 'white', border: 'none', borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}