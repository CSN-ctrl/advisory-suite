-- No-code custom pages: JSON block layout + tree (parent_id) for admin Site Studio.

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'en',
  title text not null default '',
  parent_id uuid references public.site_pages (id) on delete set null,
  sort_order int not null default 0,
  published boolean not null default true,
  blocks jsonb not null default '[]'::jsonb,
  updated_by text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint site_pages_slug_locale_unique unique (slug, locale),
  constraint site_pages_slug_format_chk check (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 1 and 120
  )
);

create index if not exists site_pages_locale_idx on public.site_pages (locale);
create index if not exists site_pages_parent_idx on public.site_pages (parent_id);
create index if not exists site_pages_sort_idx on public.site_pages (locale, parent_id, sort_order);

alter table public.site_pages enable row level security;

drop policy if exists "site_pages select published or admin" on public.site_pages;
create policy "site_pages select published or admin"
  on public.site_pages for select
  using (published = true or public.is_admin());

drop policy if exists "site_pages insert admin" on public.site_pages;
create policy "site_pages insert admin"
  on public.site_pages for insert
  with check (public.is_admin());

drop policy if exists "site_pages update admin" on public.site_pages;
create policy "site_pages update admin"
  on public.site_pages for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "site_pages delete admin" on public.site_pages;
create policy "site_pages delete admin"
  on public.site_pages for delete
  using (public.is_admin());

grant select on public.site_pages to anon, authenticated;
grant insert, update, delete on public.site_pages to authenticated;
