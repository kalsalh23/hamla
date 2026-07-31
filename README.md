# همة طيبة

لوحة عرض حيّة لحملة تبرعات **"همة طيبة"** — هوية الجمهورية العربية السورية 2026.

- **شاشة العرض:** شعار الحملة + إجمالي التبرعات لحظياً + أعلى 10 متبرعين + آخر المتبرعين بشكل لحظي.
- **لوحة التحكم:** إدخال اسم المتبرّع والمبلغ والملاحظة، وتظهر فوراً على الشاشة (وإن كان المبلغ ضمن الأعلى يُدرج في قائمة أعلى المتبرعين تلقائياً).

## التقنيات

- React (Vite)
- Supabase (قاعدة بيانات + Realtime + مصادقة مدير النظام)
- نشر عبر GitHub + Vercel

## التشغيل محلياً

```bash
npm install
npm run dev
```

## خطوة 1: إعداد Supabase (مرة واحدة)

1. أنشئ مشروعاً جديداً في [supabase.com](https://supabase.com).
2. افتح **SQL Editor** > **New query**، والصق محتوى ملف `supabase/schema.sql` ثم شغّله.
3. من **Authentication > Users** أنشئ مستخدم مدير النظام (بريد + كلمة مرور) — هذا الحساب هو الذي سيدخل به إلى لوحة التحكم.
4. تأكد أن الجدول `donations` مفعّل لديه **Realtime** (سيفعّله السكربت تلقائياً).
5. انسخ `.env.example` إلى `.env` وضع فيه `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY` (من Project Settings > API).

## خطوة 2: الرفع إلى GitHub

```bash
git init
git add .
git commit -m "همة طيبة - لوحة تبرعات"
git branch -M main
git remote add origin https://github.com/<اسمك>/<المشروع>.git
git push -u origin main
```

## خطوة 3: النشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com) واربط حساب GitHub.
2. **Add New Project** → اختر المستودع.
3. في **Environment Variables** أضف:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Framework Preset: **Vite** (سيُختار تلقائياً). اضغط **Deploy**.

بعد النشر:
- الشاشة الرئيسية: `https://hematayba.vercel.app`
- لوحة التحكم: `https://hematayba.vercel.app/admin`

> ملاحظة: مشروع Vercel يقرأ إعدادات إعادة التوجيه من ملف `vercel.json` (إعادة كل المسارات إلى `index.html` ليعمل توجيه React بشكل صحيح).

> ملاحظة أمنية: `VITE_SUPABASE_ANON_KEY` هو مفتاح عام وليس سرياً؛ حماية الكتابة تتم عبر سياسات RLS (المشرف فقط يستطيع الإضافة بعد تسجيل الدخول).
