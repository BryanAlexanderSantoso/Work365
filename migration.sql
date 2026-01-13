-- Run this in your Supabase SQL Editor to update the database

-- 1. Update Profiles Table
alter table profiles 
add column if not exists subscription_tier text default 'free' check (subscription_tier in ('free', 'pro', 'yearly')),
add column if not exists subscription_start_date timestamp with time zone,
add column if not exists subscription_end_date timestamp with time zone,
add column if not exists is_admin boolean default false;

-- 2. Create Upgrade Requests Table
create table if not exists upgrade_requests (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  plan_type text not null check (plan_type in ('pro', 'yearly')),
  amount numeric not null,
  payment_proof text,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Enable RLS
alter table upgrade_requests enable row level security;

-- 4. Policies
create policy "Users can view own upgrade requests" on upgrade_requests 
for select using (auth.uid() = user_id);

create policy "Users can insert own upgrade requests" on upgrade_requests 
for insert with check (auth.uid() = user_id);

create policy "Admins can view all upgrade requests" on upgrade_requests 
for select using (
  (select is_admin from profiles where id = auth.uid()) = true
);

create policy "Admins can update upgrade requests" on upgrade_requests 
for update using (
  (select is_admin from profiles where id = auth.uid()) = true
);
