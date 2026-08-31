# FootballHub
A responsive football news + video landing page with optional Supabase email authentication.

## Run
Open `index.html` in a browser, or serve the folder with any static server.

## Supabase
1. Open `js/config.js`.
2. Put your Supabase **Project URL** in `SUPABASE_URL`.
3. Put your public **anon/publishable key** in `SUPABASE_ANON_KEY`.
4. Email/password authentication must be enabled in Supabase Auth.

Do NOT put a Supabase `service_role` key in this project.

## Customize
- News/video content: `js/app.js`
- Design: `css/style.css`
- Main page: `index.html`
