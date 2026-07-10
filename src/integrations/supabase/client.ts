import * as Supabase from '@supabase/supabase-js'

const supabaseUrl = 'https://gjenxbnbgjqkcjmnvqyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZW54Ym5iZ2pxa2NqbW52cXl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDAwNTcsImV4cCI6MjA5OTE3NjA1N30.XuFXNXdNze0m2dILb7P0i41KEFQJ3EFnKAeq5vV7ZmU';

export const supabase = Supabase.createClient(supabaseUrl, supabaseAnonKey)
