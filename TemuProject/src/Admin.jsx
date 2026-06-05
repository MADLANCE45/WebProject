import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [prodotti, setProdotti] = useState([])
  const [editingId, setEditingId] = useState(null)

  // 1. LA NUOVA STRUTTURA A REPARTI
  const repartiMap = {
    '🎣 Pesca Sportiva': {
      'Attrezzatura da Pesca': ['Canne da pesca', 'Mulinelli', 'Esche e Ami', 'Fili e Accessori'],
      'Abbigliamento Tecnico': ['Occhiali polarizzati', 'Cappelli e Visiere', 'Guanti', 'Calzature'],
      'Accessori e Logistica': ['Borse termiche', 'Zaini impermeabili', 'Scatole porta-attrezzi'],
      'Elettronica e Utilità': ['Torce frontali', 'Bilance digitali portatili', 'Powerbank solari']
    },
    '🐠 Acquariofilia': {
      'Vasche e Mobili': ['Acquari in vetro', 'Vaschette in plastica', 'Mobili di supporto', 'Reti da allevamento'], // <-- AGGIUNTO QUI
      'Tecnica e Manutenzione': ['Filtri e Pompe', 'Illuminazione LED', 'Riscaldatori', 'Sistemi CO2'],
      'Allestimento (Hardscape)': ['Rocce e Legni', 'Sabbia e Ghiaia', 'Decorazioni in resina'],
      'Accessori Vari': ['Retini', 'Calamite puliscivetro', 'Mangiatoie automatiche']
    }
  };
 

  // 2. STATI DEL FORM
  const [reparto, setReparto] = useState('🎣 Pesca Sportiva')
  const [categoria, setCategoria] = useState('Attrezzatura da Pesca')
  const [sottocategoria, setSottocategoria] = useState('Canne da pesca')
  const [titolo, setTitolo] = useState('')
  const [prezzo, setPrezzo] = useState('')
  const [linkAffiliazione, setLinkAffiliazione] = useState('')
  const [immagineUrl, setImmagineUrl] = useState('')
  
  // Stati per il Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 3. EFFETTI PER I MENU A TENDINA A CASCATA
  useEffect(() => {
    // Se cambio reparto, aggiorno in automatico la prima categoria disponibile
    const primeCategorie = Object.keys(repartiMap[reparto])
    if (!primeCategorie.includes(categoria)) {
      const primaCat = primeCategorie[0]
      setCategoria(primaCat)
      setSottocategoria(repartiMap[reparto][primaCat][0])
    }
  }, [reparto])

  useEffect(() => {
    // Se cambio categoria, aggiorno in automatico la prima sottocategoria disponibile
    if (repartiMap[reparto][categoria] && !repartiMap[reparto][categoria].includes(sottocategoria)) {
      setSottocategoria(repartiMap[reparto][categoria][0])
    }
  }, [categoria, reparto])

  // 4. AUTENTICAZIONE E CARICAMENTO
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) caricaProdotti()
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) caricaProdotti()
    })
  }, [])

  const caricaProdotti = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProdotti(data)
  }

  // 5. FUNZIONI CRUD (Salva, Elimina, Modifica)
  const salvaProdotto = async (e) => {
    e.preventDefault()
    const payload = { reparto, titolo, prezzo: parseFloat(prezzo), categoria, sottocategoria, link_affiliazione: linkAffiliazione, immagine_url: immagineUrl }

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId)
      if (error) alert("Errore modifica: " + error.message)
      else alert("Prodotto aggiornato con successo!")
    } else {
      const { error } = await supabase.from('products').insert([payload])
      if (error) alert("Errore inserimento: " + error.message)
      else alert("Prodotto aggiunto con successo!")
    }
    resetForm()
    caricaProdotti()
  }

  const eliminaProdotto = async (id, titoloProdotto) => {
    if (window.confirm(`Sei sicuro di voler eliminare "${titoloProdotto}"?`)) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) alert("Errore eliminazione: " + error.message)
      else caricaProdotti()
    }
  }

  const avviaModifica = (prod) => {
    setEditingId(prod.id)
    setReparto(prod.reparto || '🎣 Pesca Sportiva')
    setCategoria(prod.categoria)
    setSottocategoria(prod.sottocategoria)
    setTitolo(prod.titolo)
    setPrezzo(prod.prezzo)
    setLinkAffiliazione(prod.link_affiliazione)
    setImmagineUrl(prod.immagine_url)
    window.scrollTo(0, 0)
  }

  const resetForm = () => {
    setEditingId(null)
    setTitolo('')
    setPrezzo('')
    setLinkAffiliazione('')
    setImmagineUrl('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert("Errore login: " + error.message)
  }

  // --- SCHERMATA LOGIN ---
  if (!session) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h2>Login Admin 🔒</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '10px', background: '#333', color: 'white', cursor: 'pointer' }}>Entra nel Pannello</button>
        </form>
      </div>
    )
  }

  // --- SCHERMATA ADMIN PRINCIPALE ---
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h2>Dashboard di Amministrazione ⚙️</h2>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#dc3545', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Esci</button>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* LATO SINISTRO: FORM */}
        <div style={{ flex: '1', minWidth: '300px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
          <h3>{editingId ? '✏️ Modifica Prodotto' : '➕ Aggiungi Prodotto'}</h3>
          
          <form onSubmit={salvaProdotto} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Titolo Prodotto</label>
              <input type="text" value={titolo} onChange={(e) => setTitolo(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Prezzo Indicativo (€)</label>
              <input type="number" step="0.01" value={prezzo} onChange={(e) => setPrezzo(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            
            {/* I TRE MENU A TENDINA COLLEGATI */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Reparto</label>
              <select value={reparto} onChange={(e) => setReparto(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                {Object.keys(repartiMap).map(rep => <option key={rep} value={rep}>{rep}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Categoria</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                {Object.keys(repartiMap[reparto]).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Sottocategoria</label>
              <select value={sottocategoria} onChange={(e) => setSottocategoria(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
                {repartiMap[reparto][categoria]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
            
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Link Affiliazione</label>
              <input type="url" value={linkAffiliazione} onChange={(e) => setLinkAffiliazione(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            
            <div>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>URL Immagine</label>
              <input type="url" value={immagineUrl} onChange={(e) => setImmagineUrl(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={{ flex: 1, padding: '10px', background: editingId ? '#007bff' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {editingId ? 'Aggiorna Prodotto' : 'Aggiungi al Catalogo'}
              </button>
              
              {editingId && (
                <button type="button" onClick={resetForm} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Annulla
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LATO DESTRO: LISTA PRODOTTI */}
        <div style={{ flex: '2', minWidth: '400px' }}>
          <h3>Prodotti nel Catalogo ({prodotti.length})</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {prodotti.map(prod => (
              <div key={prod.id} style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #ddd', padding: '10px', borderRadius: '8px', gap: '15px' }}>
                
                {prod.immagine_url ? 
                  <img src={prod.immagine_url} alt="anteprima" style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '4px' }}/> : 
                  <div style={{ width: '60px', height: '60px', background: '#eee', borderRadius: '4px' }}></div>
                }

                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0' }}>{prod.titolo}</h4>
                  {/* Sostituito > con &gt; per evitare errori JSX */}
                  <span style={{ fontSize: '12px', color: '#666', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                    {prod.reparto} &gt; {prod.categoria} &gt; {prod.sottocategoria}
                  </span>
                  <p style={{ margin: '5px 0 0 0', fontWeight: 'bold', color: '#0056b3' }}>~ €{prod.prezzo}</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <button onClick={() => avviaModifica(prod)} style={{ padding: '5px 10px', background: '#ffc107', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>✏️ Modifica</button>
                  <button onClick={() => eliminaProdotto(prod.id, prod.titolo)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑️ Elimina</button>
                </div>

              </div>
            ))}
            
            {prodotti.length === 0 && <p style={{ color: '#666' }}>Nessun prodotto presente.</p>}
          </div>
        </div>

      </div>
    </div>
  )
}