import Image from 'next/image'
import RatingStars from './RatingStars'
import Comments from './comments/Comments'
import OwnerMenu from './OwnerMenu'
import { nameFor } from '@/lib/countries.full'

type Profile = { id: string; username: string; avatar_url: string | null }
type Post = {
  id: string; created_at: string; country_code: string;
  title: string | null; body: string | null; rating: number; user_id: string;
  profiles: Profile | Profile[];            // <- tåler både objekt og liste
  post_images: { url: string }[];
}

export default function PostCard({ post }: { post: Post }) {
  const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
  const cover = post.post_images?.[0]?.url || null
  const countryName = nameFor(post.country_code, 'nb')

  return (
    <article className="card overflow-hidden">
      {cover && (
        <div className="relative w-full aspect-[16/10] bg-slate-100">
          <Image src={cover} alt={post.title || countryName} fill sizes="(max-width: 768px) 100vw, 800px" style={{objectFit:'cover'}} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <a href={`/profile/${profile.username}`} className="font-semibold hover:underline">@{profile.username}</a>
          <span className="text-xs text-slate-500">{new Date(post.created_at).toLocaleDateString('no-NO')}</span>
        </div>
        <h3 className="mt-1 text-xl font-bold tracking-tight">{post.title || countryName}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="badge">{countryName}</span>
          <RatingStars value={post.rating} readOnly />
        </div>
        {post.body && <p className="mt-3 text-sm leading-6 text-slate-700">{post.body}</p>}
        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <OwnerMenu ownerId={post.user_id} postId={post.id} />
          <div className="text-sm text-slate-500"><a href={`/post/${post.id}`} className="underline">Åpne</a></div>
        </div>
        <div className="mt-3"><Comments postId={post.id} /></div>
      </div>
    </article>
  )
}
