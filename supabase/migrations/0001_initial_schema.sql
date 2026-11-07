-- Pure & Honest R&D: initial private data model.
-- Apply only to a dedicated P&H R&D Supabase project.
-- Original documents remain in the user's private Google Drive; this database stores metadata and searchable excerpts.

create extension if not exists vector with schema extensions;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  product_category text,
  brief text,
  status text not null default 'active' check (status in ('active','paused','completed','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  drive_file_id text not null,
  drive_name text not null,
  mime_type text,
  drive_modified_at timestamptz,
  checksum_sha256 text,
  ingestion_status text not null default 'queued' check (ingestion_status in ('queued','processing','indexed','failed','excluded')),
  extracted_text_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, drive_file_id)
);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  page_number integer,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table if not exists public.research_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  category text not null,
  summary text not null default '',
  content_markdown text not null default '',
  validation_status text not null default 'discovery' check (validation_status in ('discovery','hypothesis','bench-tested','pilot-tested','commercially-validated','rejected')),
  confidence text not null default 'low' check (confidence in ('low','medium','high')),
  sources jsonb not null default '[]'::jsonb,
  limitations text[] not null default '{}',
  next_experiment text,
  discovered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null default 'New research',
  model_provider text not null default 'openai',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user','assistant','system','tool')),
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.skill_change_proposals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  reason text not null,
  proposed_markdown text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Refresh tokens are encrypted by the application before insertion.
-- No client-side RLS policies are created for this table. Access it only on the server
-- after validating the signed-in user's identity and filtering by owner_id.
create table if not exists public.google_drive_connections (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  google_account_email text,
  drive_root_folder_id text,
  encrypted_refresh_token text not null,
  token_key_version text not null default 'v1',
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  target_type text,
  target_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists knowledge_documents_owner_idx on public.knowledge_documents(owner_id);
create index if not exists document_chunks_document_idx on public.document_chunks(document_id);
create index if not exists research_items_owner_idx on public.research_items(owner_id);
create index if not exists research_items_project_idx on public.research_items(project_id);
create index if not exists chat_sessions_owner_idx on public.chat_sessions(owner_id);
create index if not exists chat_messages_session_idx on public.chat_messages(session_id, created_at);
create index if not exists audit_events_owner_idx on public.audit_events(owner_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.research_items enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.skill_change_proposals enable row level security;
alter table public.google_drive_connections enable row level security;
alter table public.audit_events enable row level security;

create policy "profile owner can read" on public.profiles
  for select using (auth.uid() = id);
create policy "profile owner can update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "owner manages projects" on public.projects
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner manages knowledge documents" on public.knowledge_documents
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner manages chunks" on public.document_chunks
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner manages research items" on public.research_items
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner manages chat sessions" on public.chat_sessions
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner manages chat messages" on public.chat_messages
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner manages skill proposals" on public.skill_change_proposals
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owner reads audit events" on public.audit_events
  for select using (auth.uid() = owner_id);

-- No end-user policy is intentionally defined for google_drive_connections or audit event writes.
-- Keep refresh-token access and audit writes in authenticated server-side code only.
