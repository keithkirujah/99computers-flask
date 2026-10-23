# Security and quality changes

## Fixed in this package

- Removed client-side hardcoded administrator/owner/staff credentials.
- Added `/api/auth` with environment-configured accounts, signed HMAC sessions, an HttpOnly/Secure/SameSite cookie, eight-hour expiry, same-origin checks, and best-effort login throttling.
- Added a sign-out control to the existing console without changing its visual system.
- Protected `/api/save` with session verification and same-origin checks.
- Added a strict allowlist for catalogue and product-image writes; arbitrary repository paths are rejected.
- Added catalogue JSON validation, duplicate-ID rejection, image signature/size checks, and non-admin bulk-change restrictions.
- Moved activity-log writes to the server-side publishing function rather than trusting client-supplied log records.
- Added security headers and a Content Security Policy in `vercel.json`.
- Fixed direct product URLs so `/shop/p/:id` loads the frontend router instead of an empty API handler.
- Optimized JPEG assets conservatively at quality 88, retaining their dimensions and filenames; this reduced image storage by approximately 3.8 MB in this source package.
- Added deployment documentation, `.env.example`, and `.gitignore`.

## Still important before production

1. Set all required Vercel environment variables and redeploy. Until then, sign-in/publishing is intentionally unavailable.
2. Use a fine-grained GitHub token limited to the intended repository and Contents read/write permissions.
3. The site currently uses a public `catalog.json`. That means fields included in it—such as `cost`, exact `qty`, and low-stock thresholds—are publicly readable. Authentication now protects writes, not reads from a public static file. They have been preserved in this package to avoid deleting inventory data or breaking the current stock display. To make those fields private, migrate full inventory data to a private database or private repository and publish a separate sanitized customer-facing catalogue.
4. The CSP retains `unsafe-inline` for scripts/styles because the existing design uses inline code and styles. It improves isolation but is not as strong as a nonce/hash-based CSP.
5. Serverless in-memory login throttling is best-effort. Enable platform-level rate limiting/WAF rules for stronger protection.
6. Verify the deployed site and headers in a browser after deployment. This package has passed source syntax/configuration checks, but was not deployed to your account and no live production penetration test was performed.
