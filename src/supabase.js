import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zxdxsqesxifndfxfmxxi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZHhzcWVzeGlmbmRmeGZteHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTM5MzQsImV4cCI6MjA3ODc2OTkzNH0.JfLzTIT-3InPOGajOMegycE-YA4spgC9Tfenh2fHbsM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'sb-zxdxsqesxifndfxfmxxi-auth-token',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-web',
    },
  },
})