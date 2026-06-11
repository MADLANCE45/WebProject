import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

// Mappa identica a quella di App.jsx per mantenere i menu a tendina sincronizzati
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
    
    // AGGIUNGI QUESTO NUOVO BLOCCO QUI SOTTO:
    '🏕️ Campeggio e Bivacco': {
      'Tende e Riposo': ['Tende da campeggio', 'Sacchi a pelo', 'Sedie e Lettini'],
      'Cucina da Campo': ['Fornelli a gas', 'Thermos e Borracce', 'Pentolame compatto'],
      'Utensili e Accessori': ['Torce e Lampade', 'Coltelli multiuso', 'Zaini', 'Repellenti zanzare']
    
  }
};

export default function Admin() {
  // --- STATI PER IL LOGIN ---
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loadingAuth, setLoadingAuth] = useState(false)

  // --- STATI PER I PRODOTTI ---
  const [prodotti, setProdotti] = useState([])
  const [titolo, setTitolo] = useState('')
  const [prezzo, setPrezzo] = useState('')
  const [linkAffiliazione, setLinkAffiliazione] = useState('')
  const [immagineUrl, setImmagineUrl] = useState('')
  
  // Stati di default per i menu a tendina
  const [reparto, setReparto] = useState('🎣 Pesca Sportiva')
  const [categoria, setCategoria] = useState('Attrezzatura da Pesca')
  const [sottocategoria, setSottocategoria] = useState('Canne da pesca')
  const [loadingDb, setLoadingDb] = useState(false)
  const [filtroRepartoAdmin, setFiltroRepartoAdmin] = useState('Tutti')
  const [filtroCategoriaAdmin, setFiltroCategoriaAdmin] = useState('Tutte')

  // Controllo Autenticazione all'avvio

  // Controllo Autenticazione all'avvio
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  // Carica i prodotti solo se l'utente è loggato
  useEffect(() => {
    if (session) {
      fetchProdotti()
    }
  }, [session])
// --- FILTRAGGIO PRODOTTI NELLA LISTA ---
  const prodottiFiltratiAdmin = prodotti.filter(p => {
    const passaReparto = filtroRepartoAdmin === 'Tutti' || p.reparto === filtroRepartoAdmin;
    const passaCategoria = filtroCategoriaAdmin === 'Tutte' || p.categoria === filtroCategoriaAdmin;
    return passaReparto && passaCategoria;
  });
  // --- FUNZIONI AUTENTICAZIONE ---
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoadingAuth(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert("Errore di accesso: " + error.message)
    setLoadingAuth(false)
  }

  // --- FUNZIONI DATABASE ---
  const fetchProdotti = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (error) console.error("Errore nel caricamento prodotti:", error)
    else setProdotti(data)
  }

  const aggiungiProdotto = async (e) => {
    e.preventDefault()
    setLoadingDb(true)
    
    // Sostituisce l'eventuale virgola nel prezzo con il punto (standard per i database)
    const prezzoFormattato = prezzo.replace(',', '.')

    const { error } = await supabase.from('products').insert([
      { 
        titolo, 
        prezzo: parseFloat(prezzoFormattato), 
        link_affiliazione: linkAffiliazione, 
        immagine_url: immagineUrl,
        reparto,
        categoria,
        sottocategoria
      }
    ])

    if (error) {
      alert("Errore durante l'inserimento: " + error.message)
    } else {
      alert("Prodotto aggiunto con successo!")
      // Svuota i campi testo, ma mantieni i menu a tendina
      setTitolo('')
      setPrezzo('')
      setLinkAffiliazione('')
      setImmagineUrl('')
      fetchProdotti() // Aggiorna la lista
    }
    setLoadingDb(false)
  }

  const eliminaProdotto = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) alert("Errore durante l'eliminazione: " + error.message)
      else fetchProdotti()
    }
  }

  // --- GESTIONE DEI MENU A TENDINA DINAMICI ---
 const handleRepartoChange = (nuovoReparto) => {
    setReparto(nuovoReparto);
    setCategoria(''); // Svuota la categoria quando cambi reparto
    setSottocategoria(''); // Svuota la sottocategoria
  }

  const handleCategoriaChange = (nuovaCategoria) => {
    setCategoria(nuovaCategoria);
    setSottocategoria(''); // Svuota la sottocategoria quando cambi categoria
  }

  // ==========================================
  // RENDER SE L'UTENTE NON E' LOGGATO (LOGIN)
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
    )
  }

  // ==========================================
  // RENDER SE L'UTENTE E' LOGGATO (DASHBOARD)
  // ==========================================
  return (
    <div style={{ padding: '40px 4%', fontFamily: 'Inter, sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh', color: '#111827' }}>
      
      {/* HEADER ADMIN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '900' }}>Gestione Prodotti 📦</h1>
          <p style={{ margin: 0, color: '#6B7280' }}>Aggiungi, modifica o elimina i prodotti affiliati di Temu.</p>
        </div>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#111827', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Esci dal Pannello
        </button>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* FORM AGGIUNTA PRODOTTI */}
        <div style={{ flex: '1 1 400px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#FF6600' }}>Aggiungi Nuovo Prodotto</h2>
          
          <form onSubmit={aggiungiProdotto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Input Testuali */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Titolo Prodotto *</label>
              <input type="text" required value={titolo} onChange={(e) => setTitolo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Prezzo (€) *</label>
                <input type="number" step="0.01" required value={prezzo} onChange={(e) => setPrezzo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="Es: 19.99" />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Link Affiliato Temu *</label>
              <input type="url" required value={linkAffiliazione} onChange={(e) => setLinkAffiliazione(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="https://temu.to/m/..." />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Link Immagine (Opzionale)</label>
              <input type="url" value={immagineUrl} onChange={(e) => setImmagineUrl(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', boxSizing: 'border-box' }} placeholder="https://..." />
            </div>

            {/* Menu a Tendina Categorie */}
            <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', marginTop: '10px' }}>
              
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Reparto Principale *</label>
              <select required value={reparto} onChange={(e) => handleRepartoChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', marginBottom: '15px', cursor: 'pointer' }}>
                <option value="" disabled>-- Seleziona Reparto --</option>
                {Object.keys(repartiMap).map(rep => <option key={rep} value={rep}>{rep}</option>)}
              </select>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Categoria *</label>
              <select required disabled={!reparto} value={categoria} onChange={(e) => handleCategoriaChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', marginBottom: '15px', cursor: 'pointer' }}>
                <option value="" disabled>-- Seleziona Categoria --</option>
                {reparto && Object.keys(repartiMap[reparto]).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>

              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Sottocategoria *</label>
              <select required disabled={!categoria} value={sottocategoria} onChange={(e) => setSottocategoria(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', cursor: 'pointer' }}>
                <option value="" disabled>-- Seleziona Sottocategoria --</option>
                {categoria && repartiMap[reparto][categoria].map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>

            <button type="submit" disabled={loadingDb} style={{ background: '#FF6600', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px' }}>
              {loadingDb ? 'Salvataggio...' : '➕ Salva Prodotto'}
            </button>
          </form>
        </div>

        {/* LISTA PRODOTTI INVENTARIO */}
        <div style={{ flex: '2 1 500px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' }}>
          
          {/* Header con Titolo e Filtri */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#111827' }}>
              Prodotti Online ({prodottiFiltratiAdmin.length})
            </h2>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select 
                value={filtroRepartoAdmin} 
                onChange={(e) => { setFiltroRepartoAdmin(e.target.value); setFiltroCategoriaAdmin('Tutte'); }} 
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
              >
                <option value="Tutti">🌍 Tutti i Reparti</option>
                {Object.keys(repartiMap).map(rep => <option key={rep} value={rep}>{rep}</option>)}
              </select>

              {filtroRepartoAdmin !== 'Tutti' && (
                <select 
                  value={filtroCategoriaAdmin} 
                  onChange={(e) => setFiltroCategoriaAdmin(e.target.value)} 
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="Tutte">📂 Tutte le Categorie</option>
                  {Object.keys(repartiMap[filtroRepartoAdmin]).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              )}
            </div>
          </div>
          
          {/* Lista Scrollabile dei Prodotti */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '700px', overflowY: 'auto', paddingRight: '10px' }}>
            {prodottiFiltratiAdmin.length === 0 ? (
              <p style={{ color: '#6B7280', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>Nessun prodotto trovato per questa categoria.</p>
            ) : (
              prodottiFiltratiAdmin.map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', border: '1px solid #E5E7EB', borderRadius: '10px', background: '#F9FAFB', transition: 'box-shadow 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.boxShadow='0 4px 10px rgba(0,0,0,0.05)'} onMouseLeave={(e)=>e.currentTarget.style.boxShadow='none'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '8px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #E5E7EB', flexShrink: 0 }}>
                      {p.immagine_url ? <img src={p.immagine_url} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="img" /> : <span style={{ fontSize: '10px', color: '#9CA3AF' }}>Img</span>}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#111827', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.titolo}</h4>
                      
                      {/* Qui ora mostriamo l'albero completo della categoria per farti capire subito dov'è */}
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {p.reparto} &gt; {p.categoria}
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#059669', fontWeight: 'bold' }}>
                        € {p.prezzo} <span style={{ color: '#9CA3AF', fontWeight: 'normal', fontSize: '12px' }}>• {p.sottocategoria}</span>
                      </p>
                    </div>
                  </div>
                  <button onClick={() => eliminaProdotto(p.id)} style={{ background: '#FEE2E2', color: '#EF4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: 'background 0.2s', flexShrink: 0 }} onMouseEnter={(e) => e.target.style.background = '#FECACA'} onMouseLeave={(e) => e.target.style.background = '#FEE2E2'}>
                    Elimina
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}