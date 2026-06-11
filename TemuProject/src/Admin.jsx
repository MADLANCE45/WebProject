import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 

export default function Admin() {
  // --- STATI PER IL LOGIN ---
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  // --- STATI PER I PRODOTTI ---
  const [prodotti, setProdotti] = useState([]);
  const [titolo, setTitolo] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [linkAffiliazione, setLinkAffiliazione] = useState('');
  const [immagineUrl, setImmagineUrl] = useState('');
  
  // Stati vuoti di default per OBBLIGARE la scelta
  const [reparto, setReparto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [sottocategoria, setSottocategoria] = useState('');
  
  const [loadingDb, setLoadingDb] = useState(false);
  const [filtroRepartoAdmin, setFiltroRepartoAdmin] = useState('Tutti');
  const [filtroCategoriaAdmin, setFiltroCategoriaAdmin] = useState('Tutte');

  const [editingId, setEditingId] = useState(null); // NULL = Prodotto nuovo, ID = Modifica in corso

  // --- MAPPA CATEGORIE (FONDAMENTALE PER I MENU) ---
  const repartiMap = {
    '🎣 Pesca Sportiva': {
      'Attrezzatura da Pesca': ['Canne da pesca', 'Mulinelli', 'Esche artificiali', 'Fili e Trecciati', 'Ami e Minuteria'],
      'Elettronica': ['Ecoscandagli', 'Droni subacquei', 'Bilance elettroniche'],
      'Abbigliamento': ['Stivali e Waders', 'Giacche impermeabili', 'Guanti e Cappelli']
    },
    '🐠 Acquariofilia': {
      'Vasche e Mobili': ['Acquari completi', 'Mobili per acquari', 'Vasche in vetro'],
      'Tecnica e Manutenzione': ['Filtri esterni', 'Filtri interni', 'Pompe di movimento', 'Riscaldatori', 'Impianti CO2'],
      'Illuminazione': ['Plafoniere LED', 'Tubi fluorescenti', 'Timer e Controller'],
      'Allestimento (Hardscape)': ['Legni e Radici', 'Rocce e Pietre', 'Sabbia e Ghiaino', 'Substrato fertile']
    },
    '🏕️ Campeggio e Bivacco': {
      'Tende e Riposo': ['Tende da campeggio', 'Sacchi a pelo', 'Sedie e Lettini'],
      'Cucina da Campo': ['Fornelli a gas', 'Thermos e Borracce', 'Pentolame compatto'],
      'Utensili e Accessori': ['Torce e Lampade', 'Coltelli multiuso', 'Zaini', 'Repellenti zanzare']
    }
  };

  // --- CONTROLLO AUTENTICAZIONE ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      fetchProdotti();
    }
  }, [session]);

  // --- FUNZIONI LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Errore di accesso: " + error.message);
    setLoadingAuth(false);
  };

  // --- FUNZIONI DATABASE E GESTIONE PRODOTTI ---
  const fetchProdotti = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) console.error("Errore nel caricamento prodotti:", error);
    else setProdotti(data);
  };

  const handleModifica = (prodotto) => {
    setEditingId(prodotto.id);
    setTitolo(prodotto.titolo || '');
    setPrezzo(prodotto.prezzo ? prodotto.prezzo.toString() : '');
    setImmagineUrl(prodotto.immagine_url || '');
    setLinkAffiliazione(prodotto.link_affiliazione || '');
    setReparto(prodotto.reparto || '');
    setCategoria(prodotto.categoria || '');
    setSottocategoria(prodotto.sottocategoria || ''); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scorre in cima alla pagina
  };

  const annullaModifica = () => {
    setEditingId(null);
    setTitolo('');
    setPrezzo('');
    setLinkAffiliazione('');
    setImmagineUrl('');
    // Non resetto i menu a tendina, così se devi inserire prodotti simili fai prima!
  };

  const salvaProdotto = async (e) => {
    e.preventDefault();
    setLoadingDb(true);
    
    const prezzoFormattato = prezzo.replace(',', '.');
    const datiProdotto = {
      titolo, 
      prezzo: parseFloat(prezzoFormattato), 
      link_affiliazione: linkAffiliazione, 
      immagine_url: immagineUrl,
      reparto,
      categoria,
      sottocategoria
    };

    if (editingId) {
      // ✏️ MODIFICA PRODOTTO ESISTENTE
      const { error } = await supabase
        .from('products')
        .update(datiProdotto)
        .eq('id', editingId);

      if (error) {
        alert("Errore durante l'aggiornamento: " + error.message);
      } else {
        alert("✅ Prodotto aggiornato con successo!");
        annullaModifica(); 
        fetchProdotti();
      }
    } else {
      // ➕ INSERIMENTO NUOVO PRODOTTO
      const { error } = await supabase
        .from('products')
        .insert([datiProdotto]);

      if (error) {
        alert("Errore durante l'inserimento: " + error.message);
      } else {
        alert("✅ Prodotto aggiunto con successo!");
        annullaModifica(); 
        fetchProdotti();
      }
    }
    setLoadingDb(false);
  };

  const eliminaProdotto = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert("Errore durante l'eliminazione: " + error.message);
      else fetchProdotti();
    }
  };

  // --- GESTIONE MENU A TENDINA ---
  const handleRepartoChange = (nuovoReparto) => {
    setReparto(nuovoReparto);
    setCategoria('');
    setSottocategoria('');
  };

  const handleCategoriaChange = (nuovaCategoria) => {
    setCategoria(nuovaCategoria);
    setSottocategoria('');
  };

  // --- FILTRAGGIO NELLA DASHBOARD ---
  const prodottiFiltratiAdmin = prodotti.filter(p => {
    const passaReparto = filtroRepartoAdmin === 'Tutti' || p.reparto === filtroRepartoAdmin;
    const passaCategoria = filtroCategoriaAdmin === 'Tutte' || p.categoria === filtroCategoriaAdmin;
    return passaReparto && passaCategoria;
  });

  // ==========================================
  // RENDER LOGIN (Se non loggato)
  // ==========================================
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', border: '1px solid #E5E7EB' }}>
          <h2 style={{ textAlign: 'center', color: '#111827', marginBottom: '25px', fontSize: '24px', fontWeight: '900' }}>🔒 Accesso Admin</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box', outline: 'none' }} placeholder="admin@tuaemail.com" />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box', outline: 'none' }} placeholder="••••••••" />
          </div>
          
          <button type="submit" disabled={loadingAuth} style={{ width: '100%', background: '#FF6600', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', transition: 'background 0.2s' }}>
            {loadingAuth ? 'Verifica in corso...' : 'Entra nel Pannello'}
          </button>
        </form>
      </div>
    );
  }

  // ==========================================
  // RENDER DASHBOARD (Se loggato)
  // ==========================================
  return (
    <div style={{ padding: '40px 4%', fontFamily: 'Inter, sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      
      {/* HEADER DASHBOARD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#111827', fontWeight: '900' }}>Pannello di Controllo</h1>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#111827', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Esci dal Pannello
        </button>
      </div>

      {/* MODULO AGGIUNTA / MODIFICA PRODOTTO */}
      <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '40px', border: '1px solid #E5E7EB' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: editingId ? '#3B82F6' : '#FF6600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {editingId ? '✏️ Stai Modificando un Prodotto' : '➕ Aggiungi Nuovo Prodotto'}
        </h2>
        
        <form onSubmit={salvaProdotto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Titolo Prodotto *</label>
              <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="Es. Canna da pesca..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Prezzo (€) *</label>
              <input type="text" value={prezzo} onChange={(e) => setPrezzo(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="Es. 45,99" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Link Affiliato Temu *</label>
              <input type="url" value={linkAffiliazione} onChange={(e) => setLinkAffiliazione(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="https://temu.to/m/..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>URL Immagine</label>
              <input type="url" value={immagineUrl} onChange={(e) => setImmagineUrl(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="https://..." />
            </div>
          </div>

          {/* MENU A TENDINA CATEGORIE */}
          <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Reparto Principale *</label>
              <select required value={reparto} onChange={(e) => handleRepartoChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', cursor: 'pointer' }}>
                <option value="" disabled>-- Seleziona Reparto --</option>
                {Object.keys(repartiMap).map(rep => <option key={rep} value={rep}>{rep}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Categoria *</label>
              <select required disabled={!reparto} value={categoria} onChange={(e) => handleCategoriaChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', cursor: 'pointer' }}>
                <option value="" disabled>-- Seleziona Categoria --</option>
                {reparto && Object.keys(repartiMap[reparto]).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Sottocategoria *</label>
              <select required disabled={!categoria} value={sottocategoria} onChange={(e) => setSottocategoria(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', cursor: 'pointer' }}>
                <option value="" disabled>-- Seleziona Sottocategoria --</option>
                {categoria && repartiMap[reparto][categoria].map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" disabled={loadingDb} style={{ flex: 1, background: editingId ? '#3B82F6' : '#FF6600', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              {loadingDb ? 'Salvataggio...' : (editingId ? 'Aggiorna Prodotto' : 'Salva Nuovo Prodotto')}
            </button>
            
            {editingId && (
              <button type="button" onClick={annullaModifica} style={{ background: '#E5E7EB', color: '#4B5563', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                Annulla
              </button>
            )}
          </div>
        </form>
      </div>

      {/* LISTA PRODOTTI E FILTRI */}
      <h2 style={{ color: '#111827', fontSize: '20px', marginBottom: '15px' }}>Lista Prodotti ({prodottiFiltratiAdmin.length})</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {prodottiFiltratiAdmin.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB', flexWrap: 'wrap', gap: '10px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={p.immagine_url || 'https://placehold.co/50x50'} alt="img" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#111827' }}>{p.titolo}</h4>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
                  {p.prezzo}€ • {p.sottocategoria || p.categoria || 'Nessuna Categoria'}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              {/* TASTO MAGICO DELLA MODIFICA RAPIDA */}
              <button onClick={() => handleModifica(p)} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                ✏️ Modifica
              </button>
              
              <button onClick={() => eliminaProdotto(p.id)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                🗑️ Elimina
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}