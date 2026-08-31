# FootballHub

A responsive football news starter using plain HTML/CSS/JavaScript + Supabase.

## Setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Create an email/password user in Supabase Authentication.
4. Copy your Project URL and Publishable (or legacy anon) key into `js/config.js`.
5. Host the folder on Netlify, Vercel, GitHub Pages, or any static host.
6. Open `index.html`. Admin dashboard is `admin.html`.

## Security
Never put a Supabase service_role/secret key in frontend files. The included schema enables RLS and only exposes published content publicly.
