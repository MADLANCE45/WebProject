import { createClient } from '@supabase/supabase-js'

// Inserisci qui le tue chiavi prese da Supabase (racchiuse tra virgolette)
const supabaseUrl = 'https://cazaipiogbeuetikwvly.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhemFpcGlvZ2JldWV0aWt3dmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NzcyMzMsImV4cCI6MjA5NjE1MzIzM30.Q5MLUjpQ4zWBUcDuYQtb8Dl8c_INF8BHiCRnDHAzWWg'

// Creiamo l'istanza di connessione esportandola per poterla usare in tutta l'app
export const supabase = createClient(supabaseUrl, supabaseKey)