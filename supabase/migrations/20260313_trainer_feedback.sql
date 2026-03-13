-- Trainer feedback links for V1.5 workflow
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/rrobibppiennptsslzkm/sql

create table if not exists public.feedback_links (
  id          uuid primary key default gen_random_uuid(),
  ride_id     text not null,           -- references mock ride ID (e.g. 'ride-001')
  rider_name  text not null,           -- denormalized for the public trainer page
  ride_date   text not null,           -- formatted date string
  ride_focus  text not null,           -- milestone name
  ride_duration integer,               -- minutes
  rider_reflection text,               -- rider's own reflection

  trainer_name     text,               -- submitted by trainer
  trainer_feedback text,               -- submitted by trainer
  submitted_at     timestamptz,

  created_at  timestamptz default now() not null,
  expires_at  timestamptz default (now() + interval '30 days') not null
);

-- Allow anyone to read a feedback link by ID (for the public trainer page)
alter table public.feedback_links enable row level security;

create policy "Anyone can read a feedback link by id"
  on public.feedback_links for select
  using (true);

create policy "Anyone can create a feedback link"
  on public.feedback_links for insert
  with check (true);

create policy "Anyone can submit trainer feedback"
  on public.feedback_links for update
  using (trainer_feedback is null)   -- can only submit once
  with check (true);
