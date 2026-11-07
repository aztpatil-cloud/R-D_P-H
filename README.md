# Pure & Honest R&D Platform

Private cloud workspace for P&H research, innovation scouting, product development and technical documentation.

## Current stage

The first commit establishes the Next.js application foundation and the initial database/security design. Google Drive, Supabase authentication and the GPT API are intentionally not enabled until their credentials and project configuration are connected.

## Stack

- Next.js + TypeScript
- Supabase Auth and PostgreSQL (planned)
- Google Drive API for private source files and generated documents (planned)
- OpenAI API for the initial research model (planned)
- Vercel for hosting

## Local development

1. Install Node.js LTS.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and fill in credentials when backend setup is completed.
4. Run `npm run dev`.

Never commit `.env.local`, API keys, OAuth secrets, service-role keys or Google refresh tokens.
