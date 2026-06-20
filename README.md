# Notebank

A minimal, public note-sharing site. Anyone who opens the link can see every
note that's been uploaded, search through them, and add their own — no sign-up
required.

- **Browse** — every visitor sees all notes on the shelf immediately.
- **Search** — filter by title, subject, or keyword as you type.
- **Upload** — drop in a file with a title, subject, and short description.
- **Download** — one click, no account needed.

Built with React + Vite, Tailwind CSS, and Supabase (Postgres + Storage).

---

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account if you don't have one.
2. Click **New project**, give it a name, set a database password, and pick a region close to your users.
3. Wait a minute or two for the project to finish provisioning.

## 2. Create the `notes` table

In your Supabase project, open the **SQL Editor** and run:

```sql
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text,
  description text,
  uploader_name text,
  file_path text not null,
  file_name text not null,
  file_size bigint,
  file_type text,
  created_at timestamptz not null default now()
);

-- Turn on Row Level Security
alter table public.notes enable row level security;

-- Anyone (no login) can read the list of notes
create policy "Anyone can view notes"
on public.notes for select
to anon
using (true);

-- Anyone (no login) can add a note
create policy "Anyone can add notes"
on public.notes for insert
to anon
with check (true);
```

This app intentionally has no login system — every visitor shares the same
public read/write access, matching the "anyone can browse and upload" brief.
If you ever want to restrict who can upload, that's the policy to tighten
first (see the note at the bottom of this file).

## 3. Create the storage bucket

1. In the Supabase dashboard, go to **Storage** → **New bucket**.
2. Name it exactly `notes`.
3. Toggle **Public bucket** on. This lets the app build a direct download link for each file.
4. Create the bucket.

Now open the **SQL Editor** again and add policies so visitors can upload and
read files in that bucket:

```sql
-- Anyone can upload files into the notes bucket
create policy "Public can upload to notes bucket"
on storage.objects for insert
to anon
with check (bucket_id = 'notes');

-- Anyone can read files in the notes bucket
create policy "Public can view notes bucket"
on storage.objects for select
to anon
using (bucket_id = 'notes');
```

Optional but recommended: in **Storage → notes → Configuration**, set a file
size limit (e.g. 20 MB, to match the limit already enforced in the app) and
restrict allowed MIME types if you want to be stricter about what can be
uploaded.

## 4. Get your API keys

In the Supabase dashboard, go to **Settings → API**. You'll need two values:

- **Project URL**
- **anon public** key

## 5. Configure the app

```bash
cp .env.example .env
```

Open `.env` and fill in the two values from the previous step:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

## 6. Install and run

```bash
npm install
npm run dev
```

The app will be running at `http://localhost:5173`. Open it, upload a note,
and confirm it shows up in **Table Editor → notes** and **Storage → notes**
in your Supabase dashboard.

## 7. Deploy

This is a static Vite app, so it deploys cleanly to Vercel, Netlify, or
Cloudflare Pages:

1. Push this project to a GitHub repo.
2. Import it into Vercel/Netlify.
3. Build command: `npm run build`. Output directory: `dist`.
4. Add the same two environment variables (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) in your hosting provider's project settings.
5. Deploy. The link you get is what you share — anyone who opens it sees the
   same shared shelf of notes.

---

## Project structure

```
src/
  lib/
    supabase.js     Supabase client setup
    format.js        Small formatting helpers (file size, dates)
  components/
    Header.jsx        Wordmark + "Add a note" trigger
    SearchBar.jsx      Search input + subject filter chips
    NoteGrid.jsx        Grid layout, loading/empty states
    NoteCard.jsx        A single note entry
    UploadDrawer.jsx    Upload form (modal)
  App.jsx              Data fetching, search/filter logic, download handling
```

## A note on the open access model

Because there's no login, anyone with the link can upload anything to your
bucket and table. That's the point of this build, but if it ever gets a wide
audience, consider adding later:

- A simple captcha or rate limit on uploads (e.g. via a Supabase Edge Function).
- File type/size enforcement at the bucket level (step 3 above).
- A "report" button that flags a row for you to review and delete.

None of that is required to run the app as-is — it works exactly as described
the moment the steps above are done.
