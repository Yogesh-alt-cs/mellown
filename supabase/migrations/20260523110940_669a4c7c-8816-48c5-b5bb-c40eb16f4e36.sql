
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_emoji text default '🎯',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated using (auth.uid() = id);

-- Trigger to auto-create profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_emoji)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    '🎯'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Quiz results
create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  category text,
  score int not null default 0,
  correct int not null default 0,
  total int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.quiz_results enable row level security;

create policy "Authenticated users can view quiz results"
  on public.quiz_results for select
  to authenticated using (true);

create policy "Users can insert their own results"
  on public.quiz_results for insert
  to authenticated with check (auth.uid() = user_id);

create policy "Users can delete their own results"
  on public.quiz_results for delete
  to authenticated using (auth.uid() = user_id);

create index quiz_results_user_idx on public.quiz_results(user_id);
create index quiz_results_score_idx on public.quiz_results(score desc);
