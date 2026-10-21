-- Local migration only. Review and apply explicitly to the intended Supabase project.
begin;
create type public.profile_role as enum ('admin', 'member');
create type public.project_status as enum ('draft', 'published', 'archived');
create type public.message_status as enum ('new', 'read', 'replied', 'archived');
create type public.publication_status as enum ('draft', 'published');

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text check (char_length(display_name) <= 120),
 role public.profile_role not null default 'member',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
-- No client writes to profiles, even by admin. Trusted SQL owns role provisioning.
create function public.is_admin() returns boolean language sql stable security definer
set search_path = '' as $$
 select exists(select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table public.pages (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug in ('home','about','team','projects','contact')),
 title text not null check (char_length(btrim(title)) between 1 and 180),
 description text not null default '' check (char_length(description) <= 500),
 status public.publication_status not null default 'draft',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.page_sections (
 id uuid primary key default gen_random_uuid(), page_id uuid not null references public.pages(id) on delete cascade,
 section_key text not null check (section_key ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 sort_order integer not null default 0, status public.publication_status not null default 'draft',
 content jsonb not null check (jsonb_typeof(content) = 'object' and content ? 'kind' and jsonb_typeof(content->'kind') = 'string' and content->>'kind' in ('hero','narrative','principles','collection','contact')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(page_id, section_key)
);
create index page_sections_order_idx on public.page_sections(page_id, sort_order);
create table public.projects (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 title text not null check (char_length(btrim(title)) between 1 and 180),
 summary text not null check (char_length(btrim(summary)) between 1 and 500),
 description text not null check (char_length(btrim(description)) between 1 and 30000),
 category text not null default '' check (char_length(category) <= 120),
 status public.project_status not null default 'draft', featured boolean not null default false,
 thumbnail_path text check (char_length(thumbnail_path) <= 1024),
 demo_url text check (demo_url ~ '^https://[^[:space:]]+$' and char_length(demo_url) <= 2048),
 repository_url text check (repository_url ~ '^https://[^[:space:]]+$' and char_length(repository_url) <= 2048),
 published_at timestamptz, sort_order integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index projects_public_order_idx on public.projects(sort_order, id) where status = 'published';
create table public.technologies (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(btrim(name)) between 1 and 100 and name = btrim(name)),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 description text not null default '' check (char_length(description) <= 500),
 sort_order integer not null default 0, is_visible boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create unique index technologies_name_normalized_idx on public.technologies(lower(regexp_replace(name, '\s+', ' ', 'g')));
create table public.project_technologies (
 project_id uuid not null references public.projects(id) on delete cascade,
 technology_id uuid not null references public.technologies(id) on delete restrict,
 primary key(project_id, technology_id)
);
create index project_technologies_technology_idx on public.project_technologies(technology_id);
create table public.team_members (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 name text not null check (char_length(btrim(name)) between 1 and 120),
 role_title text not null check (char_length(btrim(role_title)) between 1 and 120),
 bio text not null default '' check (char_length(bio) <= 2000),
 avatar_path text check (char_length(avatar_path) <= 1024),
 github_url text check (github_url ~ '^https://[^[:space:]]+$' and char_length(github_url) <= 2048),
 linkedin_url text check (linkedin_url ~ '^https://[^[:space:]]+$' and char_length(linkedin_url) <= 2048),
 is_visible boolean not null default false, sort_order integer not null default 0,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.contact_messages (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(btrim(name)) between 1 and 120),
 email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 subject text not null check (char_length(btrim(subject)) between 1 and 180),
 message text not null check (char_length(btrim(message)) between 1 and 5000),
 status public.message_status not null default 'new',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index contact_messages_status_created_idx on public.contact_messages(status, created_at desc);

create function public.set_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end;
$$;
revoke all on function public.set_updated_at() from public;

do $$ declare t text; begin
 foreach t in array array['profiles','pages','page_sections','projects','technologies','team_members','contact_messages'] loop
  execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
 end loop;
 foreach t in array array['profiles','pages','page_sections','projects','technologies','project_technologies','team_members','contact_messages'] loop
  execute format('alter table public.%I enable row level security', t);
  execute format('revoke all on public.%I from anon, authenticated', t);
 end loop;
 foreach t in array array['pages','page_sections','projects','technologies','project_technologies','team_members'] loop
  execute format('grant select on public.%I to anon, authenticated', t);
  execute format('grant insert, update, delete on public.%I to authenticated', t);
  execute format('create policy admin_all on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
 end loop;
end $$;

grant select on public.profiles to authenticated;
create policy profile_read on public.profiles for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy pages_public on public.pages for select to anon, authenticated using (status = 'published');
create policy sections_public on public.page_sections for select to anon, authenticated using (
 status = 'published' and exists(select 1 from public.pages p where p.id = page_id and p.status = 'published')
);
create policy projects_public on public.projects for select to anon, authenticated using (status = 'published');
create policy technologies_public on public.technologies for select to anon, authenticated using (is_visible);
create policy team_public on public.team_members for select to anon, authenticated using (is_visible);
create policy project_technologies_public on public.project_technologies for select to anon, authenticated using (
 exists(select 1 from public.projects p where p.id = project_id and p.status = 'published')
 and exists(select 1 from public.technologies t where t.id = technology_id and t.is_visible)
);
-- Narrow insert grant prevents callers choosing status, timestamps or IDs. No RETURNING/read access.
grant insert(name,email,subject,message) on public.contact_messages to anon, authenticated;
create policy contact_submit on public.contact_messages for insert to anon, authenticated with check (status = 'new');
grant select, update, delete on public.contact_messages to authenticated;
create policy contact_admin_read on public.contact_messages for select to authenticated using ((select public.is_admin()));
create policy contact_admin_update on public.contact_messages for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy contact_admin_delete on public.contact_messages for delete to authenticated using ((select public.is_admin()));
commit;
