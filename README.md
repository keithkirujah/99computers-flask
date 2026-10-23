# 99 COMPUTERS — Flask project

This version preserves the existing HTML/CSS/JS and product imagery while moving the server endpoints to Flask/Python. The account system supports adding, disabling, deleting, changing roles and resetting staff passwords from `/staff.html` (administrator only).

## Important deployment notes
- Use the separate testing GitHub repository and separate Vercel project. Do not connect this copy to the live `.co.ke` repository.
- Vercel Python functions are serverless. **Do not use the local SQLite database on Vercel**; its filesystem is ephemeral. Set `DATABASE_URL` to a PostgreSQL database (Neon or another PostgreSQL provider).
- Set `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`, `GITHUB_TOKEN`, `SESSION_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` in the testing Vercel project's environment variables. The GitHub token must be restricted to the testing repository. Never commit `.env` or real secrets.
- `SESSION_SECRET` must be a random secret of at least 32 characters. Admin passwords must be at least 12 characters.
- The initial administrator is created from `ADMIN_USERNAME` and `ADMIN_PASSWORD` only when the database has no administrator. Once created, manage users in the admin UI; changing those variables does not automatically overwrite existing accounts.
- The publishing API writes to the GitHub repository configured by `GITHUB_OWNER/GITHUB_REPO/GITHUB_BRANCH`. It permits catalogue and product-image paths only. Current implementation allows catalogue publishing only for the admin role; tune permissions after testing.
- The public `catalog.json` remains public website data. Do not store secrets or private customer data in it.

## Local development (Windows PowerShell)
1. Install Python 3.11 or newer.
2. In this folder run:
   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   Copy-Item .env.example .env
   ```
3. Set the variables in your terminal session (or use a local dotenv loader if you install one). Do not commit real values.
4. Run `python app.py`, then open `http://127.0.0.1:5000`.

For local testing, SQLite is created as `local-dev.sqlite3`. On Vercel, configure `DATABASE_URL` and use PostgreSQL.

## Vercel deployment
Import this repository into the separate testing Vercel project. Configure all environment variables there and deploy a Preview first. Test login, staff creation, role changes, disabling, password reset, product edits, image uploads and publishing. Do not attach the production domain or promote to production until the tests pass.
