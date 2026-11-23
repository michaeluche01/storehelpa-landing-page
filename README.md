# Storehelpa — Marketing Landing Page (`storehelpa.com`)

Static marketing site with zero build dependencies, packaged for Railway with unprivileged NGINX (`Dockerfile` + `nginx/`).

## Domain Architecture

| Domain | Service | Purpose |
|---|---|---|
| `https://storehelpa.com` | `landing` (this repo) | Public landing page, interactive live app tour, and onboarding requests |
| `https://app.storehelpa.com` | `frontend` (`storehelpa`) | Live offline-first Storehelpa PWA |
| `https://api.storehelpa.com` | `backend` (`storehelpa-backend`) | FastAPI + PostgreSQL + Redis API |

## Deploy on Railway (`storehelpa.com`)

1. Push this directory to a Git repository (or deploy directly via Railway CLI: `railway up`).
2. Create a new Railway service (e.g., `landing`) connected to the repo.
   - **Builder:** `Dockerfile` (auto-detected via `railway.json`).
   - **Healthcheck path:** `/healthz` (returns HTTP `200`, body `ok`, `Cache-Control: no-store`).
   - **Variables:** Set `PORT=8080` (default in `Dockerfile`). No secrets are required.
3. In Railway **Service → Settings → Networking → Custom Domain**, attach `storehelpa.com` (and optionally `www.storehelpa.com` redirected to `storehelpa.com`).
4. In Cloudflare DNS:
   - Point apex `storehelpa.com` (`CNAME` flattening) to the Railway target hostname provided in step 3.
   - Keep `app.storehelpa.com` pointed to the Railway `frontend` service and `api.storehelpa.com` pointed to the Railway `backend` service.
   - Verify SSL/TLS mode is **Full (strict)**.

## Local Preview

Static preview (no Docker required):

```powershell
python -m http.server 8080
```

Docker verification (exact Railway container):

```powershell
docker build -t storehelpa-landing:prod .
docker run --rm -d --name sh-landing -e PORT=8080 -p 8080:8080 storehelpa-landing:prod
curl -I http://127.0.0.1:8080/healthz
curl -I http://127.0.0.1:8080/
docker stop sh-landing
```

## File Structure

- `index.html`, `styles.css`, `script.js` — Semantic HTML, GPU-composited motion graphics CSS, and zero-dependency interactivity.
- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `pwa-192.png`, `pwa-512.png`, `pwa-maskable-512.png`, `og-image.png`, `robots.txt`, `site.webmanifest` — Official Storehelpa brand and social metadata files.
- `assets/brand/` — Official Storehelpa SVG icon, PNG logo, and wordmark.
- `assets/screens/` — Live screenshots from `app.storehelpa.com` (`overview.png`, `pos-sell.jpg`, `inventory.png`, `attendance.png`).
- `Dockerfile`, `railway.json`, `nginx/` — Production Railway container and security headers.
