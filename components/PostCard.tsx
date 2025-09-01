import ImageCarousel from './ImageCarousel'
import RatingStars from './RatingStars'
import Comments from './comments/Comments'
import OwnerMenu from './OwnerMenu'
import { nameFor } from '@/lib/countries.full'

type Profile = { id: string; username: string; avatar_url: string | null }
type Post = {
  id: string; created_at: string; country_code: string;
  title: string | null; body: string | null; rating: number; user_id: string;
  profiles: Profile | Profile[];
  post_images: { url: string }[];
}

export default function PostCard({ post }: { post: Post }) {
  const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
  const imgs = (post.post_images || []).map(pi => pi.url).slice(0, 5) // vis maks 5
  const countryName = nameFor(post.country_code, 'nb')

  return (
    <article className="post-card relative">
      <div className="timeline" aria-hidden />
      {imgs.length > 0 && (
        <div className="relative">
          <ImageCarousel images={imgs} alt={post.title || countryName} />
          <div className="post-bar pointer-events-none">
            <span className="country-pill pointer-events-auto">{countryName}</span>
            <span className="rating-pill pointer-events-auto">★ {post.rating.toFixed(1)}</span>
          </div>
        </div>
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <a href={`/profile/${profile.username}`} className="font-semibold hover:underline">@{profile.username}</a>
          <span className="small">{new Date(post.created_at).toLocaleDateString('no-NO')}</span>
        </div>
        <h3 className="mt-1 text-xl font-bold tracking-tight">{post.title || countryName}</h3>
        {post.body && <p className="mt-3 text-sm leading-6 text-slate-700">{post.body}</p>}

        <div className="mt-4 flex items-center justify-between border-t pt-3">
          <OwnerMenu ownerId={post.user_id} postId={post.id} />
          <div className="text-sm text-slate-500"><a href={`/post/${post.id}`} className="underline">Open</a></div>
        </div>

        <div className="mt-3">
          <Comments postId={post.id} />
        </div>
      </div>
    </article>
  )
}
