import { createClient } from '@supabase/supabase-js'

// Inserisci qui le tue chiavi prese da Supabase (racchiuse tra virgolette)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Creiamo l'istanza di connessione esportandola per poterla usare in tutta l'app
export const supabase = createClient(supabaseUrl, supabaseKey)