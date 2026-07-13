-- 니 성격 뭔데? - Supabase 데이터베이스 설정
-- Supabase Dashboard → SQL Editor → New query에 전체를 붙여 넣고 실행하세요.

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null,
  mbti_result text not null check (mbti_result in ('ISTJ','ISFJ','INFJ','INTJ','ISTP','ISFP','INFP','INTP','ESTP','ESFP','ENFP','ENTP','ESTJ','ESFJ','ENFJ','ENTJ')),
  created_at timestamptz not null default now()
);

alter table public.survey_responses enable row level security;

create policy "사용자는 자신의 응답을 저장할 수 있다"
on public.survey_responses for insert to authenticated
with check (auth.uid() = user_id);

create policy "사용자는 자신의 응답만 읽을 수 있다"
on public.survey_responses for select to authenticated
using (auth.uid() = user_id);

create policy "관리자는 모든 응답을 읽을 수 있다"
on public.survey_responses for select to authenticated
using ((auth.jwt() ->> 'email') = 'schaffencom@gmail.com');

create policy "사용자는 자신의 응답을 삭제할 수 있다"
on public.survey_responses for delete to authenticated
using (auth.uid() = user_id);

create index if not exists survey_responses_created_at_idx on public.survey_responses (created_at desc);
create index if not exists survey_responses_mbti_result_idx on public.survey_responses (mbti_result);
