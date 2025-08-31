import { NextRequest, NextResponse } from 'next/server'
import { createServerClientFromRequest } from '@/lib/supabaseServer'
export async function POST(req: NextRequest, { params }: { params: { id: string } }){
  const supabase = createServerClientFromRequest(req)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const { error } = await supabase.from('posts').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
