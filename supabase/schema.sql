-- ============================================================
-- همة طيبة | مخطط قاعدة البيانات
-- شغّل هذا الملف في: Supabase Dashboard > SQL Editor > New query
-- ثم قم بتشغيله بالكامل (Run).
-- ============================================================

-- 1) تفعيل امتداد uuid (مطلوب أحياناً)
create extension if not exists "pgcrypto";

-- 2) جدول التبرعات
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  amount numeric(14, 2) not null check (amount > 0),
  currency text not null default 'SYP' check (currency in ('SYP', 'USD', 'SAR')),
  note text default '',
  created_at timestamptz not null default now()
);

-- في حال كان الجدول موجوداً سابقاً (ترقية) أضف عمود العملة
alter table public.donations add column if not exists currency text not null default 'SYP';
alter table public.donations drop constraint if exists donations_currency_check;
alter table public.donations add constraint donations_currency_check check (currency in ('SYP', 'USD', 'SAR'));

-- 3) تفعيل الـ Realtime على الجدول (حتى تظهر التبرعات بشكل لحظي)
alter publication supabase_realtime add table public.donations;

-- 4) تفعيل RLS
alter table public.donations enable row level security;

-- 5) السياسات (Policies)
--    الجميع يستطيع القراءة (عرض شاشة التبرعات)
drop policy if exists "allow select" on public.donations;
create policy "allow select"
  on public.donations for select
  using (true);

--    فقط المستخدمون المسجّلون (مدير النظام) يستطيعون الإضافة
drop policy if exists "allow insert for authenticated" on public.donations;
create policy "allow insert for authenticated"
  on public.donations for insert
  to authenticated
  with check (true);

--    فقط المستخدمون المسجّلون (مدير النظام) يستطيعون التعديل والحذف
drop policy if exists "allow update for authenticated" on public.donations;
create policy "allow update for authenticated"
  on public.donations for update
  to authenticated
  using (true);

drop policy if exists "allow delete for authenticated" on public.donations;
create policy "allow delete for authenticated"
  on public.donations for delete
  to authenticated
  using (true);

-- 6) فهارس لتسريع الاستعلامات
create index if not exists donations_amount_idx on public.donations (amount desc);
create index if not exists donations_created_at_idx on public.donations (created_at desc);
