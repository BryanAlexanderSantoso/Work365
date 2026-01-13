-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles Table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  height numeric,
  weight numeric,
  age integer,
  gender text,
  activity_level text,
  bmr numeric,
  tdee numeric,
  subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'yearly')),
  subscription_start_date timestamp with time zone,
  subscription_end_date timestamp with time zone,
  is_admin boolean default false,
  journey_start_date timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Workouts Table
create table workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  workout_type text not null,
  duration integer not null, -- in seconds
  calories_burned numeric,
  notes text,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Runs Table
create table runs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  distance numeric not null,
  duration integer not null, -- in seconds
  pace numeric not null, -- minutes per km
  unit text default 'km',
  notes text,
  completed_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Nutrition Logs Table
create table nutrition_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  meal_type text not null,
  food_name text not null,
  calories numeric not null,
  protein numeric default 0,
  carbs numeric default 0,
  fats numeric default 0,
  logged_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Todos Table (Jadwal Harian)
create table todos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  is_completed boolean default false,
  category text, -- e.g., 'Workout', 'Nutrition', 'General'
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Badges Table
create table badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  badge_type text not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policies
alter table profiles enable row level security;
alter table workouts enable row level security;
alter table runs enable row level security;
alter table nutrition_logs enable row level security;
alter table badges enable row level security;
alter table todos enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Workouts Policies
create policy "Users can view own workouts" on workouts for select using (auth.uid() = user_id);
create policy "Users can insert own workouts" on workouts for insert with check (auth.uid() = user_id);
create policy "Users can delete own workouts" on workouts for delete using (auth.uid() = user_id);

-- Runs Policies
create policy "Users can view own runs" on runs for select using (auth.uid() = user_id);
create policy "Users can insert own runs" on runs for insert with check (auth.uid() = user_id);
create policy "Users can delete own runs" on runs for delete using (auth.uid() = user_id);

-- Nutrition Logs Policies
create policy "Users can view own nutrition logs" on nutrition_logs for select using (auth.uid() = user_id);
create policy "Users can insert own nutrition logs" on nutrition_logs for insert with check (auth.uid() = user_id);
create policy "Users can delete own nutrition logs" on nutrition_logs for delete using (auth.uid() = user_id);

-- Todos Policies
create policy "Users can view own todos" on todos for select using (auth.uid() = user_id);
create policy "Users can insert own todos" on todos for insert with check (auth.uid() = user_id);
create policy "Users can update own todos" on todos for update using (auth.uid() = user_id);
create policy "Users can delete own todos" on todos for delete using (auth.uid() = user_id);

-- Badges Policies
create policy "Users can view own badges" on badges for select using (auth.uid() = user_id);
create policy "Users can insert own badges" on badges for insert with check (auth.uid() = user_id);

-- Function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, journey_start_date)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    now()
  );
  return new;
end;
$$;

-- Trigger for new user profiles
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();