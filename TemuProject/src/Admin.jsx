import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(false);

  const [prodotti, setProdotti] = useState([]);
  const [titolo, setTitolo] = useState('');
  const [prezzo, setPrezzo] = useState('');
  const [linkAffiliazione, setLinkAffiliazione] = useState('');
  const [immagineUrl, setImmagineUrl] = useState('');
  
  const [reparto, setReparto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [sottocategoria, setSottocategoria] = useState('');
  
  // NUOVO STATO: PIATTAFORMA
  const [piattaforma, setPiattaforma] = useState('Temu');
  
  const [loadingDb, setLoadingDb] = useState(false);
  const [filtroRepartoAdmin, setFiltroRepartoAdmin] = useState('Tutti');
  const [filtroCategoriaAdmin, setFiltroCategoriaAdmin] = useState('Tutte');

  const [editingId, setEditingId] = useState(null); 

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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    if (session) fetchProdotti();
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoadingAuth(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Errore di accesso: " + error.message);
    setLoadingAuth(false);
  };

  const fetchProdotti = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (error) console.error("Errore nel caricamento:", error);
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
    setPiattaforma(prodotto.piattaforma || 'Temu'); // Prende la piattaforma o mette Temu di default
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const annullaModifica = () => {
    setEditingId(null);
    setTitolo('');
    setPrezzo('');
    setLinkAffiliazione('');
    setImmagineUrl('');
    setPiattaforma('Temu');
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
      sottocategoria,
      piattaforma // AGGIUNTO AL SALVATAGGIO
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(datiProdotto).eq('id', editingId);
      if (error) alert("Errore: " + error.message);
      else { alert("✅ Aggiornato!"); annullaModifica(); fetchProdotti(); }
    } else {
      const { error } = await supabase.from('products').insert([datiProdotto]);
      if (error) alert("Errore: " + error.message);
      else { alert("✅ Aggiunto!"); annullaModifica(); fetchProdotti(); }
    }
    setLoadingDb(false);
  };

  const eliminaProdotto = async (id) => {
    if (window.confirm("Sicuro di voler eliminare?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) alert("Errore: " + error.message);
      else fetchProdotti();
    }
  };

  const handleRepartoChange = (nuovoReparto) => {
    setReparto(nuovoReparto); setCategoria(''); setSottocategoria('');
  };

  const handleCategoriaChange = (nuovaCategoria) => {
    setCategoria(nuovaCategoria); setSottocategoria('');
  };

  const prodottiFiltratiAdmin = prodotti.filter(p => {
    const passaReparto = filtroRepartoAdmin === 'Tutti' || p.reparto === filtroRepartoAdmin;
    const passaCategoria = filtroCategoriaAdmin === 'Tutte' || p.categoria === filtroCategoriaAdmin;
    return passaReparto && passaCategoria;
  });

  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '25px', fontWeight: '900' }}>🔒 Admin</h2>
          <div style={{ marginBottom: '20px' }}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }} />
          </div>
          <div style={{ marginBottom: '30px' }}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }} />
          </div>
          <button type="submit" disabled={loadingAuth} style={{ width: '100%', background: '#FF6600', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>
            Entra
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 4%', fontFamily: 'Inter, sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>Pannello Admin</h1>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#111827', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Esci</button>
      </div>

      <div style={{ background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '20px', color: editingId ? '#3B82F6' : '#FF6600' }}>
          {editingId ? '✏️ Modifica Prodotto' : '➕ Nuovo Prodotto'}
        </h2>
        
        <form onSubmit={salvaProdotto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Titolo *</label>
              <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Prezzo *</label>
              <input type="text" value={prezzo} onChange={(e) => setPrezzo(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#E62E04' }}>Piattaforma *</label>
              <select value={piattaforma} onChange={(e) => setPiattaforma(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', cursor: 'pointer', fontWeight: 'bold' }}>
                <option value="Temu">🟠 Temu</option>
                <option value="AliExpress">🔴 AliExpress</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Link Affiliato *</label>
              <input type="url" value={linkAffiliazione} onChange={(e) => setLinkAffiliazione(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>URL Immagine</label>
              <input type="url" value={immagineUrl} onChange={(e) => setImmagineUrl(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }} />
            </div>
          </div>

          <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', marginTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Reparto *</label>
              <select required value={reparto} onChange={(e) => handleRepartoChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                <option value="" disabled>-- Seleziona --</option>
                {Object.keys(repartiMap).map(rep => <option key={rep} value={rep}>{rep}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Categoria *</label>
              <select required disabled={!reparto} value={categoria} onChange={(e) => handleCategoriaChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                <option value="" disabled>-- Seleziona --</option>
                {reparto && Object.keys(repartiMap[reparto]).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Sottocategoria *</label>
              <select required disabled={!categoria} value={sottocategoria} onChange={(e) => setSottocategoria(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}>
                <option value="" disabled>-- Seleziona --</option>
                {categoria && repartiMap[reparto][categoria].map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" disabled={loadingDb} style={{ flex: 1, background: editingId ? '#3B82F6' : '#FF6600', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              {loadingDb ? 'Salvataggio...' : (editingId ? 'Aggiorna Prodotto' : 'Salva Prodotto')}
            </button>
            {editingId && (
              <button type="button" onClick={annullaModifica} style={{ background: '#E5E7EB', color: '#4B5563', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Annulla</button>
            )}
          </div>
        </form>
      </div>

      <h2 style={{ color: '#111827', fontSize: '20px', marginBottom: '15px' }}>Lista Prodotti ({prodottiFiltratiAdmin.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {prodottiFiltratiAdmin.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={p.immagine_url || 'https://placehold.co/50x50'} alt="img" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '15px' }}>{p.titolo}</h4>
                <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6B7280' }}>
                  {p.prezzo}€ • <strong style={{ color: p.piattaforma === 'AliExpress' ? '#E62E04' : '#FF6600' }}>{p.piattaforma || 'Temu'}</strong> • {p.sottocategoria || p.categoria}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleModifica(p)} style={{ background: '#3B82F6', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>✏️ Modifica</button>
              <button onClick={() => eliminaProdotto(p.id)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🗑️ Elimina</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}