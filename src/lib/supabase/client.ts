import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization — only create client when env vars are set
let _client: SupabaseClient | null = null
let _serviceClient: SupabaseClient | null = null

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client when Supabase is not configured (dev/MVP mode)
    return null
  }

  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  }
  return _client
}

export function getSupabase() {
  return getClient()
}

export function getServiceSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return null as any
  }

  if (!_serviceClient) {
    _serviceClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _serviceClient
}

export const supabase = getClient()
