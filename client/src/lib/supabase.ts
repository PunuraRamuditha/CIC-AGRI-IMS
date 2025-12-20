import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
  console.error('Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY')
}

// Create a mock client if environment variables are missing (for development)
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your-supabase-url') {
    // Return a mock client for development
    return {
      auth: {
        resetPasswordForEmail: async () => ({ error: { message: 'Supabase not configured. Please set up your environment variables.' } }),
        updateUser: async () => ({ error: { message: 'Supabase not configured. Please set up your environment variables.' } }),
        signInWithPassword: async () => ({ error: { message: 'Supabase not configured. Please set up your environment variables.' } }),
        signUp: async () => ({ error: { message: 'Supabase not configured. Please set up your environment variables.' } }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
            single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
          }),
          order: () => ({ data: [], error: { message: 'Supabase not configured' } })
        }),
        insert: async () => ({ error: { message: 'Supabase not configured' } }),
        update: async () => ({ error: { message: 'Supabase not configured' } }),
        delete: async () => ({ error: { message: 'Supabase not configured' } })
      })
    } as any
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()