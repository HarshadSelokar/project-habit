-- ===============================
-- EXTENSIONS
-- ===============================
create extension if not exists "pgcrypto";

-- ===============================
-- HABITS TABLE
-- ===============================
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  icon text,
  created_at timestamp with time zone default now()
);

-- ===============================
-- HABIT LOGS (CORE ANALYTICS TABLE)
-- ===============================
create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references habits(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  completed boolean not null default false,
  created_at timestamp with time zone default now(),

  -- prevent duplicate logs per habit per day
  unique (habit_id, date)
);

-- ===============================
-- GOALS TABLE
-- ===============================
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  type text not null check (type in ('weekly', 'monthly', 'yearly')),
  completed boolean not null default false,
  created_at timestamp with time zone default now()
);

-- ===============================
-- INDEXES (PERFORMANCE)
-- ===============================
create index if not exists idx_habits_user_id
  on habits(user_id);

create index if not exists idx_habit_logs_user_date
  on habit_logs(user_id, date);

create index if not exists idx_goals_user_type
  on goals(user_id, type);

-- ===============================
-- ROW LEVEL SECURITY (RLS)
-- ===============================
alter table habits enable row level security;
alter table habit_logs enable row level security;
alter table goals enable row level security;

-- ===============================
-- RLS POLICIES: HABITS
-- ===============================
create policy "habits_select_own"
on habits for select
using (user_id = auth.uid());

create policy "habits_insert_own"
on habits for insert
with check (user_id = auth.uid());

create policy "habits_update_own"
on habits for update
using (user_id = auth.uid());

create policy "habits_delete_own"
on habits for delete
using (user_id = auth.uid());

-- ===============================
-- RLS POLICIES: HABIT LOGS
-- ===============================
create policy "logs_select_own"
on habit_logs for select
using (user_id = auth.uid());

create policy "logs_insert_own"
on habit_logs for insert
with check (user_id = auth.uid());

create policy "logs_update_own"
on habit_logs for update
using (user_id = auth.uid());

create policy "logs_delete_own"
on habit_logs for delete
using (user_id = auth.uid());

-- ===============================
-- RLS POLICIES: GOALS
-- ===============================
create policy "goals_select_own"
on goals for select
using (user_id = auth.uid());

create policy "goals_insert_own"
on goals for insert
with check (user_id = auth.uid());

create policy "goals_update_own"
on goals for update
using (user_id = auth.uid());

create policy "goals_delete_own"
on goals for delete
using (user_id = auth.uid());
