-- Sprint 4: images metadata
alter table public.post_images add column if not exists alt text;
alter table public.post_images add column if not exists is_cover boolean default false;
create index if not exists idx_post_images_cover on public.post_images(post_id, is_cover desc, order_index asc);
