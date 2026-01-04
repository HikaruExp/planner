import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client - falls back to demo mode if no credentials
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Check if we're in demo mode (no Supabase configured)
export const isDemoMode = !supabase

// Demo user for local testing
export const DEMO_USER = {
    id: 'demo-user',
    email: 'demo@planner.local'
}
