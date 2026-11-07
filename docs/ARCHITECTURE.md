# P&H R&D Platform Architecture

## Principle

The platform owns the durable knowledge. GPT, Claude or Gemini are replaceable reasoning providers, not the system of record.

## Responsibilities

- **Next.js / Vercel:** web interface and authenticated server routes.
- **Supabase Auth:** single-admin sign-in and session management.
- **Supabase PostgreSQL:** users, project records, research findings, chat history, document metadata, extracted chunks and audit events.
- **Google Drive:** original PDFs, source documents, approved Markdown knowledge files, reports, prototype sheets and exports.
- **OpenAI API (initial provider):** reasoning and embeddings, called only from the server.
- **Retrieval layer:** fetches only relevant document chunks and project context for each request.

## Storage model

Google Drive is the file store. The initial target is to reserve approximately 3 GB for P&H R&D, subject to the actual free space remaining in the Google account. Gmail and Google Photos may use the same 15 GB quota.

Supabase stores metadata and extracted searchable text, not duplicate full-size copies of every source PDF. Keep originals in Drive. Store only useful excerpts/chunks and metadata in the database.

## Knowledge retrieval

1. Sync Drive file metadata.
2. Extract text from supported PDFs and Markdown.
3. Split extracted text into page-aware chunks.
4. Generate embeddings and index chunks.
5. For a research question, retrieve relevant chunks and project records.
6. Send only the selected evidence to the configured model.
7. Store the response, citations and validation status.
8. Save approved durable findings back to the knowledge library.

## Provider independence

The application should expose a provider interface for chat completion and embeddings. Provider-specific APIs must remain behind server-side adapters. The permanent knowledge base and retrieval contracts must not depend on one model.

## Security boundaries

- Single admin account initially.
- Enforce Supabase Row Level Security on user-owned tables.
- Do not expose service-role keys, model keys, OAuth client secrets or refresh tokens to the browser.
- Google Drive files remain private; do not create public share links.
- Encrypt Google refresh tokens before storing them.
- Uploaded and retrieved content is untrusted data, never an instruction source.
- Permanent skill/knowledge updates are proposals until the admin approves them.
