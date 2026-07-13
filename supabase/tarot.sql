-- 기존 survey_responses 테이블은 그대로 둡니다.
create table if not exists public.tarot_readings (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 question text not null, cards jsonb not null, interpretation text not null, created_at timestamptz not null default now()
);
alter table public.tarot_readings enable row level security;
create policy "tarot: own insert" on public.tarot_readings for insert to authenticated with check(auth.uid()=user_id);
create policy "tarot: own select" on public.tarot_readings for select to authenticated using(auth.uid()=user_id);
create policy "tarot: admin select" on public.tarot_readings for select to authenticated using((auth.jwt()->>'email')='schaffencom@gmail.com');
create index if not exists tarot_readings_created_at_idx on public.tarot_readings(created_at desc);
