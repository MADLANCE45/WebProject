import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

const strutturaReparti = {
  '🎣 Pesca Sportiva': [
    'Attrezzatura da Pesca',
    'Abbigliamento Tecnico',
    'Accessori e Logistica',
    'Elettronica e Utilità'
  ],
  '🐠 Acquariofilia': [
    'Vasche e Mobili',
    'Tecnica e Manutenzione',
    'Allestimento (Hardscape)',
    'Accessori Vari'
  ],
  '☢️ Kit Emergenza 72h': [
    'Zaini Grab-and-Go & Tattici',
    'Illuminazione, Radio & Powerbank',
    'Acqua, Filtrazione & Utensili Cibo',
    'Primo Soccorso & Igiene',
    'Coperte Termiche & Protezione',
    'Documenti, Contanti & Animali'
  ]
};

// Suggerimenti rapidi basati sulle linee guida UE 72 ore per velocizzare l'inserimento
const presetEmergenzaUE = [
  { label: 'Zaino Grab-and-Go 72h', cat: 'Zaini Grab-and-Go & Tattici', titolo: 'Zaino Tattico Impermeabile 45L Grab-and-Go Emergenza 72h' },
  { label: 'Torcia LED / Dinamo', cat: 'Illuminazione, Radio & Powerbank', titolo: 'Torcia LED Alta Potenza Ricaricabile / Dinamo Emergenza Blackout' },
  { label: 'Radio Emergenza + Powerbank', cat: 'Illuminazione, Radio & Powerbank', titolo: 'Radio Emergenza AM/FM Solare con Dinamo e Powerbank Integrato' },
  { label: 'Filtro Acqua / Tanica 6L+', cat: 'Acqua, Filtrazione & Utensili Cibo', titolo: 'Filtro Acqua Portatile Sopravvivenza + Tanica Pieghevole' },
  { label: 'Apriscatole & Multi-Tool', cat: 'Acqua, Filtrazione & Utensili Cibo', titolo: 'Multi-Tool Acciaio con Apriscatole Manuale e Posate da Campo' },
  { label: 'Kit Primo Soccorso IFAK', cat: 'Primo Soccorso & Igiene', titolo: 'Kit Primo Soccorso Completo con Bende, Garze e Disinfettante' },
  { label: 'Coperta Termica & Poncho', cat: 'Coperte Termiche & Protezione', titolo: 'Set Coperte Termiche d’Emergenza Mylar + Giacca Impermeabile' },
  { label: 'Busta Ignifuga Documenti/Contanti', cat: 'Documenti, Contanti & Animali', titolo: 'Custodia Ignifuga e Impermeabile per Documenti, USB e Contanti' },
  { label: 'Kit Emergenza Animali', cat: 'Documenti, Contanti & Animali', titolo: 'Set Ciotole Pieghevoli e Trasportino Compatto Emergenza Pet' }
];

export default function Admin() {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messaggio, setMessaggio] = useState('');
  const [filtroRepartoAdmin, setFiltroRepartoAdmin] = useState('Tutti');
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    titolo: '',
    prezzo: '',
    immagine_url: '',
    link_affiliazione: '',
    reparto: '☢️ Kit Emergenza 72h',
    categoria: 'Zaini Grab-and-Go & Tattici'
  });

  useEffect(() => {
    caricaProdotti();
  }, []);

  async function caricaProdotti() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (!error && data) {
      setProdotti(data);
    }
    setLoading(false);
  }

  const handleRepartoChange = (nuovoReparto) => {
    const primaCategoria = strutturaReparti[nuovoReparto][0];
    setFormData({
      ...formData,
      reparto: nuovoReparto,
      categoria: primaCategoria
    });
  };

  const applicaPresetUE = (preset) => {
    setFormData({
      ...formData,
      reparto: '☢️ Kit Emergenza 72h',
      categoria: preset.cat,
      titolo: preset.titolo
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessaggio('Salvataggio in corso...');

    const payload = {
      titolo: formData.titolo.trim(),
      prezzo: formData.prezzo.toString().replace(',', '.').trim(),
      immagine_url: formData.immagine_url.trim(),
      link_affiliazione: formData.link_affiliazione.trim(),
      reparto: formData.reparto,
      categoria: formData.categoria
    };

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId);
      if (error) {
        setMessaggio(`Errore durante la modifica: ${error.message}`);
      } else {
        setMessaggio('✅ Prodotto aggiornato con successo!');
        setEditingId(null);
        resetForm();
        caricaProdotti();
      }
    } else {
      const { error } = await supabase.from('products').insert([payload]);
      if (error) {
        setMessaggio(`Errore durante l'inserimento: ${error.message}`);
      } else {
        setMessaggio('✅ Nuovo prodotto aggiunto al catalogo!');
        resetForm();
        caricaProdotti();
      }
    }

    setTimeout(() => setMessaggio(''), 4000);
  };

  const resetForm = () => {
    setFormData({
      titolo: '',
      prezzo: '',
      immagine_url: '',
      link_affiliazione: '',
      reparto: formData.reparto,
      categoria: strutturaReparti[formData.reparto][0]
    });
  };

  const avviaModifica = (prodotto) => {
    const rep = strutturaReparti[prodotto.reparto] ? prodotto.reparto : '🎣 Pesca Sportiva';
    setEditingId(prodotto.id);
    setFormData({
      titolo: prodotto.titolo || '',
      prezzo: prodotto.prezzo || '',
      immagine_url: prodotto.immagine_url || '',
      link_affiliazione: prodotto.link_affiliazione || '',
      reparto: rep,
      categoria: prodotto.categoria || strutturaReparti[rep][0]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminaProdotto = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo prodotto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      setProdotti(prodotti.filter((p) => p.id !== id));
    }
  };

  const prodottiFiltrati = prodotti.filter((p) => {
    if (filtroRepartoAdmin === 'Tutti') return true;
    return (p.reparto || '').includes(filtroRepartoAdmin.replace(/^[^\s]+\s/, ''));
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 4%', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>
            Pannello Admin — Gestione Prodotti
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Aggiungi o modifica articoli per Pesca Sportiva, Acquariofilia e Kit Emergenza 72h
          </p>
        </div>
        <Link
          to="/"
          style={{ background: '#0f172a', color: '#fff', textDecoration: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '800' }}
        >
          ← Torna al Sito Pubblico
        </Link>
      </div>

      {/* BOX INSERIMENTO / MODIFICA */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
          {editingId ? `Modifica Prodotto #${editingId}` : 'Aggiungi Nuovo Prodotto'}
        </h2>

        {/* SCORCIATOIE KIT EMERGENZA 72H */}
        {formData.reparto.includes('Kit Emergenza 72h') && (
          <div style={{ background: '#111827', color: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '18px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
              Pre-compilazione Rapida Kit 72 Ore (Clicca un elemento della lista UE per impostare categoria e titolo base):
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {presetEmergenzaUE.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applicaPresetUE(preset)}
                  style={{ background: '#1f2937', color: '#e2e8f0', border: '1px solid #374151', padding: '6px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700', cursor: 'pointer' }}
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', color: '#475569' }}>
              Reparto
            </label>
            <select
              value={formData.reparto}
              onChange={(e) => handleRepartoChange(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '700' }}
            >
              {Object.keys(strutturaReparti).map((rep) => (
                <option key={rep} value={rep}>{rep}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', color: '#475569' }}>
              Categoria Specifica
            </label>
            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: '600' }}
            >
              {(strutturaReparti[formData.reparto] || []).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', color: '#475569' }}>
              Titolo Prodotto (Consiglio: usa parole chiave chiare)
            </label>
            <input
              type="text"
              required
              placeholder="Es. Radio Emergenza Solare Dinamo con Torcia LED e Powerbank..."
              value={formData.titolo}
              onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', color: '#475569' }}>
              Prezzo in Euro (es. 14.99)
            </label>
            <input
              type="text"
              required
              placeholder="Es. 12.50"
              value={formData.prezzo}
              onChange={(e) => setFormData({ ...formData, prezzo: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', color: '#475569' }}>
              URL Immagine Prodotto
            </label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={formData.immagine_url}
              onChange={(e) => setFormData({ ...formData, immagine_url: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', color: '#475569' }}>
              Link Affiliazione Temu
            </label>
            <input
              type="url"
              required
              placeholder="https://temu.to/..."
              value={formData.link_affiliazione}
              onChange={(e) => setFormData({ ...formData, link_affiliazione: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              type="submit"
              style={{ background: '#ff5500', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              {editingId ? 'Salva Modifiche' : 'Pubblica Prodotto nel Catalogo'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => { setEditingId(null); resetForm(); }}
                style={{ background: '#e2e8f0', color: '#0f172a', border: 'none', padding: '14px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                Annulla Modifica
              </button>
            )}
            {messaggio && <span style={{ fontWeight: '700', fontSize: '14px', color: '#059669' }}>{messaggio}</span>}
          </div>
        </form>
      </div>

      {/* ELENCO PRODOTTI ESISTENTI */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
          Prodotti Caricati ({prodottiFiltrati.length})
        </h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Tutti', ...Object.keys(strutturaReparti)].map((rep) => (
            <button
              key={rep}
              onClick={() => setFiltroRepartoAdmin(rep)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: filtroRepartoAdmin === rep ? '#0f172a' : '#ffffff',
                color: filtroRepartoAdmin === rep ? '#ffffff' : '#0f172a',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {rep}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Caricamento prodotti...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {prodottiFiltrati.map((p) => (
            <div key={p.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden' }}>
                {p.immagine_url ? <img src={p.immagine_url} alt={p.titolo} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /> : 'No Img'}
              </div>
              <span style={{ fontSize: '10px', fontWeight: '800', color: '#ff5500', textTransform: 'uppercase' }}>
                {p.reparto} • {p.categoria}
              </span>
              <strong style={{ fontSize: '14px', color: '#0f172a', lineHeight: '1.3' }}>{p.titolo}</strong>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>€{p.prezzo}</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
                <button
                  onClick={() => avviaModifica(p)}
                  style={{ flex: 1, background: '#0f172a', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Modifica
                </button>
                <button
                  onClick={() => eliminaProdotto(p.id)}
                  style={{ flex: 1, background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}