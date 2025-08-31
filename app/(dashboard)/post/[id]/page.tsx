import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabaseServer'
import PostCard from '@/components/PostCard'
type Post = { id: string; created_at: string; country_code: string; title: string | null; body: string | null; rating: number; user_id: string; profiles: { id: string; username: string; avatar_url: string | null }; post_images: { url: string }[] }
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createServerClient(cookies())
  const { data: post } = await supabase.from('posts').select('id, title, body, post_images(url)').eq('id', params.id).single()
  const title = post?.title || 'Innlegg – Travelgram'
  const descr = (post?.body || '').slice(0, 140)
  const ogImage = post?.post_images?.[0]?.url
  return { title, description: descr, openGraph: { title, description: descr, images: ogImage ? [ogImage] : [] }, twitter: { card: 'summary_large_image', title, description: descr, images: ogImage ? [ogImage] : [] } }
}
export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient(cookies())
  const { data: post } = await supabase.from('posts').select('id, created_at, country_code, title, body, rating, user_id, profiles!inner(id, username, avatar_url), post_images(url)').eq('id', params.id).single()
  if (!post) return <div className="card p-6">Innlegg finnes ikke.</div>
  return (<div className="space-y-4"><PostCard post={post as Post} /></div>)
}
