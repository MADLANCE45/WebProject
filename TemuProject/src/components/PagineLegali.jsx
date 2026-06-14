import React, { useEffect } from 'react';

const layoutStyle = (isDarkMode) => ({
  minHeight: '100vh',
  padding: '60px 4%',
  backgroundColor: isDarkMode ? '#111827' : '#F9FAFB',
  color: isDarkMode ? '#F9FAFB' : '#111827',
  fontFamily: 'Inter, sans-serif'
});

const contentStyle = (isDarkMode) => ({
  maxWidth: '800px',
  margin: '0 auto',
  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
  padding: '40px',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  lineHeight: '1.8'
});

export function PrivacyPolicy({ isDarkMode }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={layoutStyle(isDarkMode)}>
      <div style={contentStyle(isDarkMode)}>
        <h1 style={{ color: '#FF6600', marginBottom: '20px' }}>Privacy Policy</h1>
        <p><strong>Ultimo aggiornamento: Giugno 2026</strong></p>
        <p>
          Benvenuto su Recensioni ITA. La tutela della tua privacy è per noi fondamentale. 
          Questa pagina spiega come raccogliamo, utilizziamo e proteggiamo i tuoi dati quando visiti il nostro sito.
        </p>
        
        <h3>1. Chi è il Titolare del Trattamento?</h3>
        <p>Il Titolare del trattamento dei dati è Marco Cretu. Per qualsiasi domanda legata alla privacy, puoi contattarmi all'indirizzo email: <strong>marcocretu0@gmail.com</strong> (oppure <strong>gardeniainfo67@gmail.com</strong>).</p>
        
        <h3>2. Quali dati raccogliamo e perché?</h3>
        <ul>
          <li><strong>Dati di navigazione:</strong> Il nostro sito è ospitato su Vercel. I sistemi informatici preposti al funzionamento di questo sito acquisiscono alcuni dati personali la cui trasmissione è implicita nell'uso dei protocolli di comunicazione di Internet (es. indirizzi IP). Questi dati vengono usati solo per ricavare informazioni statistiche anonime e per controllare il corretto funzionamento del sito.</li>
          <li><strong>Dati forniti volontariamente:</strong> Se ci scrivi un'email, acquisiremo il tuo indirizzo email e gli eventuali altri dati inseriti nel messaggio, necessari per risponderti. Non iscriviamo la tua mail a nessuna newsletter senza il tuo consenso.</li>
        </ul>

        <h3>3. Servizi di Terze Parti e Affiliazioni</h3>
        <p>
          Il nostro sito partecipa a programmi di affiliazione (Temu e AliExpress). Quando clicchi su un link per acquistare un prodotto, verrai reindirizzato sui loro siti esterni. 
          Queste piattaforme potrebbero raccogliere i tuoi dati (es. indirizzo IP, cookie di tracciamento) per attribuire la commissione di vendita al nostro sito. Noi non abbiamo accesso ai tuoi dati bancari, né ai dati del tuo account su Temu o AliExpress. Ti invitiamo a leggere le rispettive Privacy Policy sui loro siti.
        </p>

        <h3>4. I tuoi diritti</h3>
        <p>
          Ai sensi del GDPR, hai il diritto di chiederci in qualsiasi momento l'accesso ai tuoi dati personali, la rettifica, la cancellazione degli stessi o la limitazione del trattamento. Puoi esercitare questi diritti scrivendoci un'email.
        </p>
      </div>
    </div>
  );
}

export function CookiePolicy({ isDarkMode }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={layoutStyle(isDarkMode)}>
      <div style={contentStyle(isDarkMode)}>
        <h1 style={{ color: '#FF6600', marginBottom: '20px' }}>Cookie Policy</h1>
        <p><strong>Ultimo aggiornamento: Giugno 2026</strong></p>
        <p>
          Questo sito utilizza i cookie per garantirti la migliore esperienza di navigazione possibile. 
          I cookie sono piccoli file di testo che i siti visitati inviano al tuo terminale (computer, tablet, smartphone).
        </p>

        <h3>1. Cookie Tecnici e Strettamente Necessari</h3>
        <p>
          Il nostro sito utilizza cookie tecnici strettamente necessari al suo funzionamento. 
          Questi cookie non vengono utilizzati per scopi ulteriori e non richiedono il tuo consenso preventivo. Includono, ad esempio, il salvataggio della tua preferenza per la "Dark Mode" (tema scuro) o il mantenimento della sessione se sei l'amministratore del sito.
        </p>

        <h3>2. Cookie di Terze Parti (Affiliazioni)</h3>
        <p>
          Recensioni ITA include link di affiliazione verso negozi esterni (es. AliExpress, Temu). 
          Quando clicchi su questi link ("Vai all'offerta"), i siti di destinazione potrebbero installare dei cookie di tracciamento sul tuo dispositivo per riconoscere che sei arrivato dal nostro sito e riconoscerci la commissione. 
          Noi non gestiamo né controlliamo questi cookie esterni.
        </p>

        <h3>3. Come disabilitare i cookie?</h3>
        <p>
          Puoi configurare il tuo browser per rifiutare tutti i cookie o per segnalarti quando un cookie viene inviato. 
          Tuttavia, disabilitando i cookie tecnici, alcune funzioni del nostro sito potrebbero non operare correttamente. Puoi trovare le istruzioni per disabilitare i cookie nelle impostazioni del tuo browser (Chrome, Firefox, Safari, Edge).
        </p>
      </div>
    </div>
  );
}

export function TerminiCondizioni({ isDarkMode }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={layoutStyle(isDarkMode)}>
      <div style={contentStyle(isDarkMode)}>
        <h1 style={{ color: '#FF6600', marginBottom: '20px' }}>Termini e Condizioni</h1>
        <p><strong>Ultimo aggiornamento: Giugno 2026</strong></p>
        
        <h3>1. Natura del Servizio</h3>
        <p>
          Recensioni ITA è un sito a scopo puramente informativo e di intrattenimento. 
          Forniamo recensioni, pareri e segnalazioni di prodotti disponibili su piattaforme di e-commerce terze (come Temu o AliExpress).
        </p>

        <h3>2. Esclusione di Responsabilità (Non siamo uno Store)</h3>
        <p>
          <strong>Noi non vendiamo direttamente alcun prodotto.</strong> Non gestiamo magazzini, non elaboriamo pagamenti, non organizziamo spedizioni e non ci occupiamo di resi o garanzie. 
          Qualsiasi transazione economica avviene esclusivamente tra l'utente e la piattaforma terza (es. Temu o AliExpress). 
          Per qualsiasi problematica relativa a spedizioni in ritardo, prodotti danneggiati o rimborsi, l'utente dovrà contattare esclusivamente il servizio clienti della piattaforma su cui ha effettuato l'acquisto.
        </p>

        <h3>3. Link di Affiliazione e Trasparenza</h3>
        <p>
          Questo sito partecipa a programmi di affiliazione. Ciò significa che se clicchi su un link prodotto e completi un acquisto, potremmo ricevere una piccola commissione percentuale dalla piattaforma terza. 
          Questo meccanismo non comporta <strong>nessun costo aggiuntivo per te</strong> e ci aiuta a mantenere vivo il progetto.
        </p>

        <h3>4. Accuratezza delle Informazioni</h3>
        <p>
          Facciamo del nostro meglio per mantenere aggiornati i prezzi, le descrizioni e la disponibilità dei prodotti mostrati. Tuttavia, i prezzi e le offerte lampo sugli store esterni possono variare in qualsiasi momento senza preavviso. Fa sempre fede il prezzo mostrato sul sito del venditore finale al momento dell'acquisto.
        </p>
      </div>
    </div>
  );
}