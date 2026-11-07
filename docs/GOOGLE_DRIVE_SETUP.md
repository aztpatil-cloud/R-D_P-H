# Google Drive Integration Plan

## Target folder structure

Create a private root folder named `Pure & Honest R&D`:

- `00_Master_Knowledge`
  - `R&D_Researcher_Skill.md`
  - `P&H_Brand_and_Product_Principles.md`
  - `Approved_R&D_Methods.md`
- `01_Regulations`
  - `FSSAI`
  - `Standards_and_Notifications`
- `02_Research_Library`
  - `Food_Science`
  - `Cross_Industry_Technology`
  - `Patents`
  - `Packaging_and_Preservation`
- `03_Product_Projects`
  - one folder per product
- `04_Prototypes_and_Experiments`
- `05_Technical_Reports`
- `06_Manufacturer_RFQs`
- `99_Archive`

## OAuth requirements

Create a Google Cloud project and configure OAuth consent plus a Web application OAuth client. The redirect URI must match the deployed application's callback route exactly.

Request the narrowest Google Drive scope compatible with the selected workflow. Prefer app-created or explicitly selected files/folders rather than broad access to all Drive content. Do not use public links.

Store the client ID and secret in Vercel environment variables. Encrypt refresh tokens using an application-managed encryption key before persisting them in Supabase. Never place OAuth secrets in browser code or Git.

## Sync behaviour

- Drive remains the original file store.
- Sync file ID, name, MIME type, modified time and checksum to Supabase.
- Extract supported PDF/Markdown text and retain page references where possible.
- Detect modified files and re-index only changed content.
- Keep unsupported or failed files visible with a clear status.
- Do not delete a Drive file when removing its index entry.
- Provide a disconnect/revoke action and a sync status log.
