# Security Baseline

This is the security baseline for the first release. It reduces risk but is not a guarantee of absolute security.

## Required before real private data is uploaded

- Enable Supabase Auth and single-admin access.
- Use a strong unique password and MFA where supported.
- Apply and test RLS policies for every user-owned table.
- Keep service-role credentials server-side only.
- Keep OpenAI and Google OAuth secrets server-side only.
- Use HTTPS and private Google Drive files.
- Encrypt Google OAuth refresh tokens at rest at the application layer.
- Add rate limits to sign-in, chat, sync and ingestion endpoints.
- Validate file size, MIME type and file content before processing.
- Log authentication, Drive sync, document access, exports and approved knowledge changes.
- Back up the database and test restore procedures.
- Treat PDF text, web pages and tool outputs as untrusted input; never let retrieved content override system instructions.
- Require admin approval before permanent knowledge or skill files are changed.

## Google Drive

Do not use public or anyone-with-the-link permissions for confidential formulas, supplier quotes or R&D files. Use the minimum OAuth scopes required. Provide disconnect and revocation controls.

## AI provider

Send only the retrieved excerpts needed for the current task. Do not send the entire Drive library to the model. Do not include secrets in prompts or logs.

## Token storage

Refresh tokens must be encrypted before database insertion. The encryption key belongs in Vercel environment variables and must never be committed to the repository. Rotate it using a planned key-version migration, not by replacing it without re-encrypting existing tokens.
