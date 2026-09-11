# Retro Clothing — Supabase + traffic-ready setup

## 1. Environment
Create `.env.local` from `.env.example`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

Never put a `service_role`/secret key in a `VITE_` variable.

## 2. Database
Open Supabase Dashboard → SQL Editor and run `supabase/schema.sql` once.

## 3. Optional demo data
If you want the bundled 15 demo products, 1 announcement, 4 reviews and company settings in Supabase, run `supabase/seed.sql` after `schema.sql`. You can skip it if you are starting with your own catalog.

## 4. Admin account
Create an account under Authentication → Users. Copy its User UID, then run:

```sql
insert into public.app_admins (user_id)
values ('PASTE_AUTH_USER_UUID_HERE');
```

The admin login page uses Supabase Auth.

## 5. Storage
The SQL creates a public `products` bucket. Product/announcement/settings images selected in the admin panel are uploaded to Storage instead of being stored as base64 data URLs.

## 6. Performance choices
- Public data is fetched once on app startup and cached in the browser.
- No public Realtime subscriptions are used, which avoids creating one live channel per visitor.
- Product filters use indexed columns.
- Product images are stored in Supabase Storage and served as public URLs.
- Product/announcement data is kept small; images never live inside PostgreSQL rows.
- The app keeps a local cache as a resilience fallback if Supabase is temporarily unavailable.
- For larger traffic, put the site behind a CDN/Vercel and keep database queries paginated if the catalog grows substantially.
