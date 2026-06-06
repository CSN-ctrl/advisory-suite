-- Insights / blog articles with locale and publish workflow.

create table if not exists public.insight_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  locale text not null default 'en',
  title text not null default '',
  excerpt text not null default '',
  content text not null default '',
  article_date text not null default '',
  meta_description text not null default '',
  sort_order int not null default 0,
  published boolean not null default true,
  updated_by text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint insight_articles_slug_locale_unique unique (slug, locale),
  constraint insight_articles_slug_format_chk check (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 1 and 120
  ),
  constraint insight_articles_locale_chk check (locale in ('en', 'bg'))
);

create index if not exists insight_articles_locale_published_idx
  on public.insight_articles (locale, published, sort_order);

alter table public.insight_articles enable row level security;

drop policy if exists "insight_articles select published or admin" on public.insight_articles;
create policy "insight_articles select published or admin"
  on public.insight_articles for select
  using (published = true or public.is_admin());

drop policy if exists "insight_articles insert admin" on public.insight_articles;
create policy "insight_articles insert admin"
  on public.insight_articles for insert
  with check (public.is_admin());

drop policy if exists "insight_articles update admin" on public.insight_articles;
create policy "insight_articles update admin"
  on public.insight_articles for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "insight_articles delete admin" on public.insight_articles;
create policy "insight_articles delete admin"
  on public.insight_articles for delete
  using (public.is_admin());

grant select on public.insight_articles to anon, authenticated;
grant insert, update, delete on public.insight_articles to authenticated;
