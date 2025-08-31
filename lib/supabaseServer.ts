import { cookies as nextCookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { createServerClient as createClient } from '@supabase/ssr'
export function createServerClient(cookieStore: ReturnType<typeof nextCookies>) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return cookieStore.get(name)?.value } } })
}
export function createServerClientFromRequest(req: NextRequest) {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { get(name: string) { return req.cookies.get(name)?.value } } })
}
