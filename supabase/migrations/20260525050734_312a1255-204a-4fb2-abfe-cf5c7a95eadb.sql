
-- Roles
create type public.app_role as enum ('student','faculty','admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Auto-create profile + default student role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  insert into public.user_roles (user_id, role)
  values (new.id, coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'student'));
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Courses
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  instructor text not null,
  category text not null,
  price integer not null default 0,
  level text not null default 'Beginner',
  blurb text not null default '',
  cover text not null default 'from-fuchsia-500 to-violet-600',
  hours integer not null default 0,
  lessons integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.courses enable row level security;

-- Announcements
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.announcements enable row level security;

-- Policies
create policy "profiles viewable by authenticated" on public.profiles
  for select to authenticated using (true);
create policy "users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

create policy "roles viewable by authenticated" on public.user_roles
  for select to authenticated using (true);

create policy "courses viewable by all" on public.courses
  for select using (true);
create policy "faculty manage courses insert" on public.courses
  for insert to authenticated with check (public.has_role(auth.uid(),'faculty') or public.has_role(auth.uid(),'admin'));
create policy "faculty manage courses update" on public.courses
  for update to authenticated using (public.has_role(auth.uid(),'faculty') or public.has_role(auth.uid(),'admin'));
create policy "faculty manage courses delete" on public.courses
  for delete to authenticated using (public.has_role(auth.uid(),'faculty') or public.has_role(auth.uid(),'admin'));

create policy "announcements viewable by all" on public.announcements
  for select using (true);
create policy "faculty manage announcements insert" on public.announcements
  for insert to authenticated with check (public.has_role(auth.uid(),'faculty') or public.has_role(auth.uid(),'admin'));
create policy "faculty manage announcements update" on public.announcements
  for update to authenticated using (public.has_role(auth.uid(),'faculty') or public.has_role(auth.uid(),'admin'));
create policy "faculty manage announcements delete" on public.announcements
  for delete to authenticated using (public.has_role(auth.uid(),'faculty') or public.has_role(auth.uid(),'admin'));

-- Realtime
alter table public.courses replica identity full;
alter table public.announcements replica identity full;
alter publication supabase_realtime add table public.courses;
alter publication supabase_realtime add table public.announcements;
