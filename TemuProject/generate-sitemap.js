import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carica i codici segreti dal tuo file .env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  console.log('Generazione sitemap.xml in corso...');

  // 1. Scarica tutti gli ID dei prodotti da Supabase
  const { data: products, error } = await supabase.from('products').select('id');

  if (error) {
    console.error('Errore nel recupero prodotti per la sitemap:', error);
    return;
  }

  // 2. Inizia a scrivere il file XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 3. Aggiungi la Home Page (Priorità massima 1.0)
  xml += `  <url>\n    <loc>https://recensioni-ita.vercel.app/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // 4. Aggiungi in automatico ogni singolo prodotto
  if (products) {
    products.forEach(prodotto => {
      xml += `  <url>\n    <loc>https://recensioni-ita.vercel.app/prodotto/${prodotto.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
  }

  xml += `</urlset>`;

  // 5. Salva il file fisicamente nella cartella "public"
  fs.writeFileSync('public/sitemap.xml', xml);
  console.log(`✅ Sitemap generata con successo! Inseriti ${products.length} prodotti.`);
}

generateSitemap();