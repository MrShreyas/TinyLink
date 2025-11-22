# TinyLink

TinyLink is a small URL-shortening application with a Next.js frontend and an Express backend. This README covers setup, development, auth flows (signup/login), creating and visiting short links, recommended Git workflow for documentation, and an architecture diagram (Mermaid).

---

**Contents**

- [Prerequisites](#prerequisites)
- [Local setup](#local-setup)
- [Environment variables](#environment-variables)
- [Run backend and frontend](#run-backend-and-frontend)
- [Auth flow (signup/login)](#auth-flow-signuplogin)
- [Create & visit short links](#create--visit-short-links)
- [Development tips (CORS, cookies)](#development-tips-cors-cookies)
- [Architecture diagram (Mermaid)](#architecture-diagram-mermaid)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js (>=22 recommended)
- pnpm (or npm/yarn)
- PostgreSQL (or the DB configured in `backend/config/DbConfig.js`)
- Git

On Windows, use PowerShell (examples below show PowerShell commands).

## Local setup

1. Clone the repo and install dependencies:

```powershell
git clone https://github.com/MrShreyas/TinyLink.git
cd TinyLink
pnpm install --filter backend
pnpm install --filter frontend
```

2. Configure environment variables (see next section).

3. Run database seed (if needed):

```powershell
cd backend
node seed.js
```

## Environment variables

Create `.env` files in `backend/` and `frontend/` if required. Example `backend/.env`:

```
PORT=8080
DATABASE_URL=postgres://user:pass@localhost:5432/tinylink
JWT_SECRET=your_jwt_secret_here
```

And `frontend/.env` (if used):

```
NEXT_PUBLIC_API_URL=https://localhost:8080
```

Note: `.env` files are ignored by default in this repo.

## Run backend and frontend

Open two terminals (PowerShell) and run:

Backend (from repo root):

```powershell
cd backend
pnpm install
pnpm start # or `node bin/www` depending on scripts
```

Frontend (from repo root):

```powershell
cd frontend
pnpm install
pnpm run dev
```

After both are running:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080` (or the `PORT` you configured)

## Auth flow (signup/login)

This app uses an httpOnly cookie named `auth_token` to keep sessions safe.

Signup flow
- POST `/auth/signup` (backend) with `firstName`, `lastName`, `email`, `password`.
- Backend creates the user and returns `201` on success.

Login flow
- POST `/auth/login` (backend) with `email` and `password`.
- Backend verifies credentials and sets a cookie `auth_token` with options: `httpOnly`, `sameSite='none'`, `secure=true` (production), `path='/'`.
- Important: when calling the backend from the browser ensure the request includes credentials so cookies are received and stored:

Fetch example:

```js
await fetch('https://tinylink-backend.example.com/auth/login', {
	method: 'POST',
	credentials: 'include',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ email, password })
});
```

Axios example:

```js
axios.post('https://tinylink-backend.example.com/auth/login', { email, password }, { withCredentials: true })
```

When the frontend and backend are on different origins (domains), ensure the backend CORS allows the frontend origin and `Access-Control-Allow-Credentials: true`.

## Create & visit short links

Creating a short link (protected route)
- POST `/short/create` with JSON `{ target_url: 'https://example.com', ... }` while authenticated.
- The server requires the `auth_token` cookie; the middleware `verifyAuth` checks it and rejects unauthenticated requests.

Visiting a short link
- Access `https://your-frontend.com/{shortcode}` or `http://localhost:3000/{shortcode}`.
- The backend route `GET /:shortcode` will redirect (302) to the `target_url` and record analytics click data.

## Development tips (CORS, cookies)

- If your backend sets cookies for cross-site usage, use `sameSite:'none'` and `secure:true` (production). Browsers will refuse cookies with `sameSite:none` unless `secure` is true.
- Enable credentials on client requests: `credentials: 'include'` or `axios { withCredentials: true }`.
- Ensure backend CORS configuration includes the frontend origin and `credentials: true`.
- For local development without HTTPS, set `secure:false` for cookies in dev only, or run the frontend with HTTPS locally.
- Consider proxying API calls through the frontend (Next.js rewrites) to avoid cross-site cookie complexity:

next.config.js example (frontend):

```js
/** @type {import('next').NextConfig} */
module.exports = {
	async rewrites() {
		return [
			{ source: '/api/:path*', destination: 'https://tinylink-backend.onrender.com/:path*' }
		]
	}
}
```

With that rewrite, client requests to `/api/*` will appear same-origin and cookies for the frontend domain will be used.

## Architecture diagram (Mermaid)

Below is a simple Mermaid diagram representing the architecture.

```mermaid
flowchart LR
	subgraph Frontend
		F[Next.js App]
		FMiddleware[Next.js Middleware]
	end

	subgraph Backend
		B[Express API]
		Auth[Auth Router]
		Short[Short Link Router]
		DB[(Postgres)]
	end

	User -->|browser requests| F
	F -->|SSR/API calls| B
	FMiddleware -->|reads cookie| F
	B -->|reads/writes| DB
	Auth -->|sets cookie| User
	Short -->|redirects| User

	style DB fill:#f9f,stroke:#333,stroke-width:1px
```

## Troubleshooting

- 405 on `POST /api/...`: ensure App Router exports named handlers (`export async function POST(...)`) in `app/api/*/route.ts`.
- No cookie in frontend: check network response for `Set-Cookie` header and ensure `credentials: 'include'` and CORS allow credentials.
- Cookie blocked/ignored: verify `SameSite` and `Secure` options and the environment (HTTP vs HTTPS).



