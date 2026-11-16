import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

const CODICE_AMICO_DEFAULT = 'app39037';

const strutturaReparti = {
  '❄️ Auto & Inverno 15 Nov': [
    'Calze da Neve & Catene',
    'Jump Starter & Batterie',
    'Mini Compressori & Gonfiaggio',
    'Raschiaghiaccio & Telo Termico',
    'Supporti Smartphone Stabili',
    'Trasmettitori FM & Bluetooth',
    'Schermi Wireless CarPlay/Android'
  ],
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

const presetAutoInverno = [
  {
    label: '1. Calze da Neve Omologate',
    cat: 'Calze da Neve & Catene',
    titolo: '#01 - Calze da Neve Auto Omologate EN 16662-1 Antiscivolo (Obbligo 15 Novembre)'
  },
  {
    label: '2. Avviatore Emergenza (Jump Starter)',
    cat: 'Jump Starter & Batterie',
    titolo: '#02 - Avviatore Emergenza Auto Portatile (Jump Starter) con Pinze e Powerbank LED'
  },
  {
    label: '3. Mini Compressore Portatile',
    cat: 'Mini Compressori & Gonfiaggio',
    titolo: '#03 - Mini Compressore Portatile Digitale Ricaricabile per Pneumatici Auto e Moto'
  },
  {
    label: '4. Raschiaghiaccio / Telo Termico',
    cat: 'Raschiaghiaccio & Telo Termico',
    titolo: '#04 - Telo Termico Copriauto Antighiaccio Magnetico + Raschiaghiaccio Parabrezza'
  }
];

const presetSicurezzaAuto = [
  {
    label: '1. Supporto Smartphone',
    cat: 'Supporti Smartphone Stabili',
    titolo: 'Supporto Magnetico / Gravitazionale per Smartphone Bocchette Cruscotto Auto'
  },
  {
    label: '2. Trasmettitore FM Bluetooth',
    cat: 'Trasmettitori FM & Bluetooth',
    titolo: 'Trasmettitore FM Bluetooth per Auto con Vivavoce e Doppia Porta USB'
  },
  {
    label: '3. Schermo Wireless CarPlay',
    cat: 'Schermi Wireless CarPlay/Android',
    titolo: 'Schermo Portatile Wireless con Apple CarPlay e Android Auto per Auto'
  }
];

const BOOKMARKLET_CODE = `javascript:(function(){const results=[];const seen=new Set();const cards=Array.from(document.querySelectorAll('a[href]'));for(const a of cards){const href=a.href;if(!href||seen.has(href)||href.includes('login')||href.includes('javascript:'))continue;const img=Array.from(a.querySelectorAll('img')).find(i=>i.width>=80&&!i.src.includes('avatar')&&!i.src.includes('/usual/')&&!i.src.includes('154x64'))||(a.parentElement&&a.parentElement.querySelector('img'));if(!img||!img.src||img.width<80)continue;const box=a.closest('[data-tooltip-title],[class*="card"],[class*="item"],li,div')||a;const txt=(box.innerText||a.innerText||'').replace(/\\s+/g,' ');const pm=txt.match(/(\\d+[.,]\\d{1,2})\\s*€|€\\s*(\\d+[.,]\\d{1,2})/);if(!pm)continue;const price=(pm[1]||pm[2]).replace(',','.');let title=(img.alt||a.getAttribute('aria-label')||txt.split(pm[0])[0]||'Prodotto').trim().replace(/\\|/g,'-').replace(/\\s+/g,' ').substring(0,95);if(title.length<4||title.toLowerCase()==='login')continue;seen.add(href);results.push(title+' | '+price+' | '+img.src+' | '+href);if(results.length>=16)break;}if(results.length>0){navigator.clipboard.writeText(results.join('\\n')).then(()=>alert('✅ Catturati '+results.length+' prodotti! Ora vai nel Pannello Admin e incollali nel box Importazione Massiva.'));}else{alert('⚠️ Nessun prodotto rilevato. Scorri leggermente la pagina per far caricare le foto e riprova!');}})();`;

export default function Admin() {
  const [prodotti, setProdotti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messaggio, setMessaggio] = useState('');
  const [filtroRepartoAdmin, setFiltroRepartoAdmin] = useState('Tutti');
  const [editingId, setEditingId] = useState(null);

  const [smartInput, setSmartInput] = useState('');
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  const bookmarkletRef = useRef(null);

  const [formData, setFormData] = useState({
    titolo: '',
    prezzo: '',
    immagine_url: '',
    link_affiliazione: '',
    reparto: '❄️ Auto & Inverno 15 Nov',
    categoria: 'Calze da Neve & Catene'
  });

  useEffect(() => {
    if (bookmarkletRef.current) {
      bookmarkletRef.current.setAttribute('href', BOOKMARKLET_CODE);
    }
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

  const applicaPreset = (repartoTarget, preset) => {
    setFormData({
      ...formData,
      reparto: repartoTarget,
      categoria: preset.cat,
      titolo: preset.titolo
    });
  };

  const estraiTitoloDaUrl = (urlStr) => {
    try {
      const url = new URL(urlStr);
      const searchKey = url.searchParams.get('search_key') || url.searchParams.get('SearchText');
      if (searchKey) {
        return searchKey
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
      const pathParts = url.pathname.split('/').filter(Boolean);
      const slug = pathParts[pathParts.length - 1] || '';
      if (slug && !slug.includes('search_result') && !slug.includes('item')) {
        const cleanSlug = slug
          .replace(/-g-\d+.*$/i, '')
          .replace(/\.html$/i, '')
          .replace(/[-_]+/g, ' ')
          .trim();
        if (cleanSlug.length > 3) {
          return cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);
        }
      }
    } catch (e) {
      return '';
    }
    return '';
  };

  const estraiDatiAutomaticamente = async () => {
    if (!smartInput.trim()) return;
    setIsFetchingMeta(true);
    setMessaggio('🔍 Analisi del link Temu / AliExpress in corso...');

    try {
      const urlMatch = smartInput.match(/https?:\/\/[^\s]+/);
      const extractedUrl = urlMatch ? urlMatch[0].replace(/[.,;!?)]+$/, '') : '';

      const priceMatch = smartInput.match(/(?:€\s*(\d+[.,]\d{1,2}))|(?:(\d+[.,]\d{1,2})\s*€)/i);
      const extractedPrice = priceMatch ? (priceMatch[1] || priceMatch[2]).replace(',', '.') : '';

      let testoPulito = smartInput
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/(?:€\s*\d+[.,]\d{1,2})|(?:\d+[.,]\d{1,2}\s*€)/gi, '')
        .replace(/[\n\r]+/g, ' ')
        .trim();

      let autoTitle = testoPulito || estraiTitoloDaUrl(extractedUrl);
      let autoImage = '';

      if (extractedUrl) {
        const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(extractedUrl)}`);
        const json = await res.json();

        if (json.status === 'success' && json.data) {
          const rawTitle = (json.data.title || '').trim();
          const isBlockedTitle =
            !rawTitle ||
            rawTitle.toLowerCase() === 'login' ||
            rawTitle.toLowerCase().includes('sign in') ||
            rawTitle.toLowerCase().includes('temu | explore');

          if (!isBlockedTitle) {
            autoTitle = rawTitle.replace(/\s*\|\s*(Temu|AliExpress).*$/i, '').trim();
          }

          if (json.data.image && json.data.image.url && !json.data.image.url.includes('/usual/')) {
            autoImage = json.data.image.url;
          }
        }
      }

      setFormData((prev) => ({
        ...prev,
        titolo: autoTitle || prev.titolo,
        prezzo: extractedPrice || prev.prezzo,
        immagine_url: autoImage || prev.immagine_url,
        link_affiliazione: extractedUrl || prev.link_affiliazione
      }));

      if (!autoImage) {
        setMessaggio('⚠️ Copia indirizzo immagine dall\'app e incollala nel campo Immagine.');
      } else {
        setMessaggio('✅ Dati estratti con successo! Verifica e clicca Pubblica.');
      }
    } catch (err) {
      setMessaggio('⚠️ Impossibile leggere la foto in automatico.');
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const eseguiImportazioneMassiva = async () => {
    if (!bulkText.trim()) return;
    setIsBulkImporting(true);
    setMessaggio('📦 Importazione massiva su Supabase in corso...');

    const righe = bulkText.split('\n').map((r) => r.trim()).filter(Boolean);
    const nuoviProdotti = [];

    for (const riga of righe) {
      const parti = riga.split('|').map((s) => s.trim()).filter(Boolean);
      if (parti.length >= 4) {
        const link = parti[parti.length - 1];
        const immagine = parti[parti.length - 2];
        const prezzoRaw = parti[parti.length - 3];
        const titoloUnito = parti.slice(0, parti.length - 3).join(' - ');

        const prezzoPulito = parseFloat(prezzoRaw.replace(/[^0-9.,]/g, '').replace(',', '.'));

        if (!isNaN(prezzoPulito) && link.startsWith('http')) {
          nuoviProdotti.push({
            titolo: titoloUnito,
            prezzo: prezzoPulito,
            immagine_url: immagine,
            link_affiliazione: link,
            reparto: formData.reparto,
            categoria: formData.categoria
          });
        }
      }
    }

    if (nuoviProdotti.length === 0) {
      setMessaggio('❌ Formato non valido. Assicurati che ogni riga termini con: | Prezzo | URL_Immagine | Link');
      setIsBulkImporting(false);
      return;
    }

    const { error } = await supabase.from('products').insert(nuoviProdotti);
    if (error) {
      setMessaggio(`Errore durante l'importazione massiva: ${error.message}`);
    } else {
      setMessaggio(`🎉 Importati con successo ${nuoviProdotti.length} prodotti in "${formData.categoria}"!`);
      setBulkText('');
      setShowBulkModal(false);
      caricaProdotti();
    }
    setIsBulkImporting(false);
  };

  const incollaDagliAppunti = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setBulkText(text);
      setShowBulkModal(true);
    } catch (e) {
      setShowBulkModal(true);
    }
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
      if (!error) {
        setMessaggio('✅ Prodotto aggiornato con successo!');
        setEditingId(null);
        resetForm();
        caricaProdotti();
      } else {
        setMessaggio(`Errore: ${error.message}`);
      }
    } else {
      const { error } = await supabase.from('products').insert([payload]);
      if (!error) {
        setMessaggio('✅ Nuovo prodotto pubblicato nel catalogo!');
        resetForm();
        setSmartInput('');
        caricaProdotti();
      } else {
        setMessaggio(`Errore: ${error.message}`);
      }
    }

    setTimeout(() => setMessaggio(''), 5000);
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
    const rep = strutturaReparti[prodotto.reparto] ? prodotto.reparto : '❄️ Auto & Inverno 15 Nov';
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
    const nomePulito = filtroRepartoAdmin.replace(/^[^\s]+\s/, '');
    return (p.reparto || '').includes(nomePulito);
  });

  return (
    <div style={{ maxWidth: '1220px', margin: '0 auto', padding: '28px 4%', fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER ADMIN */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', textTransform: 'uppercase' }}>
            Pannello Admin — Automazione Temu &amp; AliExpress
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Codice Amico globale copiato al click dei clienti: <strong style={{ color: '#ff5500' }}>{CODICE_AMICO_DEFAULT}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={incollaDagliAppunti}
            style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
          >
            📦 Incolla &amp; Importa Multi-Prodotto
          </button>
          <Link
            to="/"
            style={{ background: '#0f172a', color: '#fff', textDecoration: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '800' }}
          >
            ← Torna al Sito
          </Link>
        </div>
      </div>

      {/* BOX SEGNALIBRO CATTURA PAGINA */}
      <div style={{ background: 'linear-gradient(135deg, #0b1320, #1e293b)', color: '#fff', padding: '20px', borderRadius: '14px', marginBottom: '24px', border: '1px solid #38bdf8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 480px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              🚀 Soluzione Anti-Blocco Login (Temu e AliExpress)
            </span>
            <h3 style={{ margin: '4px 0 6px 0', fontSize: '17px', fontWeight: '800' }}>
              Cattura fino a 16 Prodotti alla volta
            </h3>
            <p style={{ margin: 0, fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.5' }}>
              Trascina <strong>⚡ Cattura Temu / AliExpress</strong> sulla barra dei preferiti, cliccalo sulla pagina di ricerca e torna qui per incollare.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a
              ref={bookmarkletRef}
              onClick={(e) => {
                e.preventDefault();
                alert('Trascina questo pulsante sulla Barra dei Segnalibri!');
              }}
              style={{
                background: 'linear-gradient(135deg, #ff5500, #dc2626)',
                color: '#fff',
                textDecoration: 'none',
                padding: '13px 18px',
                borderRadius: '10px',
                fontWeight: '900',
                fontSize: '12.5px',
                textTransform: 'uppercase',
                boxShadow: '0 8px 20px rgba(255,85,0,0.4)',
                cursor: 'grab',
                whiteSpace: 'nowrap'
              }}
            >
              ⚡ Cattura Temu / AliExpress
            </a>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(BOOKMARKLET_CODE);
                alert('✅ Codice Segnalibro copiato negli appunti!');
              }}
              style={{
                background: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #38bdf8',
                padding: '13px 16px',
                borderRadius: '10px',
                fontWeight: '800',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              📋 Copia Codice Segnalibro
            </button>
          </div>
        </div>
      </div>

      {/* FORM PRINCIPALE INSERIMENTO / MODIFICA */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
          {editingId ? `Modifica Prodotto #${editingId}` : 'Pubblica Singolo Prodotto'}
        </h2>

        {/* PRESET INVERNO 15 NOV */}
        {formData.reparto.includes('Auto & Inverno 15 Nov') && (
          <div style={{ background: '#0b1320', color: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '16px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '8px' }}>
              Preset Video Inverno (15 Novembre):
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {presetAutoInverno.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applicaPreset('❄️ Auto & Inverno 15 Nov', preset)}
                  style={{ background: '#162235', color: '#e0f2fe', border: '1px solid #0284c7', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  + {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRESET ANTIDISTRAZIONE / CELLULARE ALLA GUIDA */}
        {formData.reparto.includes('Auto & Inverno 15 Nov') && (
          <div style={{ background: '#1a0f0f', color: '#f8fafc', padding: '14px', borderRadius: '10px', marginBottom: '18px', borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#fca5a5', textTransform: 'uppercase', marginBottom: '8px' }}>
              Preset Video Anti-Multa (Cellulare alla Guida):
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {presetSicurezzaAuto.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applicaPreset('❄️ Auto & Inverno 15 Nov', preset)}
                  style={{ background: '#2c1515', color: '#fecaca', border: '1px solid #dc2626', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
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
              Titolo Prodotto
            </label>
            <input
              type="text"
              required
              placeholder="Es. Supporto Magnetico per Smartphone..."
              value={formData.titolo}
              onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', color: '#475569' }}>
              Prezzo in Euro (es. 9.99)
            </label>
            <input
              type="text"
              required
              placeholder="Es. 9.99"
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
              placeholder="https://img.kwcdn.com/..."
              value={formData.immagine_url}
              onChange={(e) => setFormData({ ...formData, immagine_url: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', marginBottom: '6px', textTransform: 'uppercase', color: '#475569' }}>
              Link Affiliazione (Temu o AliExpress)
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

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
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
            {messaggio && (
              <span style={{ fontWeight: '700', fontSize: '13px', color: '#0f172a', background: '#f1f5f9', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #ff5500' }}>
                {messaggio}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* BOX MODALE PER IMPORTAZIONE MASSIVA */}
      {showBulkModal && (
        <div style={{ background: '#f0f9ff', border: '2px solid #0284c7', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#0f172a' }}>
            📦 Importazione Massiva in: {formData.reparto} → {formData.categoria}
          </h3>
          <p style={{ margin: '0 0 10px 0', fontSize: '12.5px', color: '#334155' }}>
            I prodotti copiati dal segnalibro sono pronti qui sotto. Clicca su "Pubblica Tutti" per salvarli:
          </p>
          <textarea
            rows={7}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #94a3b8', fontFamily: 'monospace', fontSize: '12px', marginBottom: '12px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={eseguiImportazioneMassiva}
              disabled={isBulkImporting}
              style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
            >
              {isBulkImporting ? 'Caricamento in corso...' : 'Pubblica Tutti i Prodotti Ora'}
            </button>
            <button
              type="button"
              onClick={() => setShowBulkModal(false)}
              style={{ background: '#e2e8f0', color: '#0f172a', border: 'none', padding: '12px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

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