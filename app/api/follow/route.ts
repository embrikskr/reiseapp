import { NextRequest, NextResponse } from 'next/server'
import { createServerClientFromRequest } from '@/lib/supabaseServer'
export async function POST(req: NextRequest) {
  const supabase = createServerClientFromRequest(req)
  const { targetId, action } = await req.json()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  if (action === 'follow') {
    const { error } = await supabase.from('follows').insert({ follower_id: user.id, following_id: targetId })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  } else if (action === 'unfollow') {
    const { error } = await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetId)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
