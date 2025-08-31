create index if not exists idx_posts_user_created on public.posts(user_id, created_at desc);
create index if not exists idx_posts_country on public.posts(country_code);
create index if not exists idx_posts_title on public.posts using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(body,'')));
create index if not exists idx_comments_post_created on public.comments(post_id, created_at);
create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);
create index if not exists idx_post_images_post on public.post_images(post_id, order_index);
