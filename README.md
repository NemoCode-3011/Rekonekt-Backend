# REKÒ Backend

The API powering **REKÒ**, a digital museum for exploring Nigerian history, culture, and the stories shaping the present. It supports connected historical content and visitor learning tools, alongside administrative content management.

## Stack

- **Runtime and API:** Node.js, TypeScript, Express
- **Data:** PostgreSQL and Redis
- **Validation and API docs:** Zod and Swagger / OpenAPI
- **Media:** S3-compatible storage through Cloudflare R2
- **Optional integrations:** Google sign-in and SMTP email delivery

## Features

- Visitor authentication, email OTP verification, and session handling
- Role-protected administrative routes and content management
- Exhibitions, sections, stories, people, places, events, artifacts, and experiences
- Sources, relationships, search, bookmarks, notes, and learning progress
- Media upload support
- PostgreSQL-backed application data and Redis-backed session/OTP support
- Health endpoint and interactive API documentation

The authentication, persistence, media-upload, and admin workflows have been tested by the project author.

## Architecture

Requests flow through **routes → controllers → services → models/SQL → PostgreSQL**. Middleware handles concerns such as authentication, authorization, and uploads. Redis supports short-lived verification data and session-related operations.

```text
src/
├── config/       # PostgreSQL, Redis, and external service configuration
├── controller/   # HTTP request handlers
├── database/     # Database connection, schema, and seed
├── docs/         # Swagger / OpenAPI definitions
├── middleware/   # Authentication, authorization, and uploads
├── model/        # SQL queries
├── routes/       # API route definitions
├── service/      # Application and integration logic
├── utils/        # Shared helpers
└── validation/   # Request schemas
```

## Requirements

- Node.js and npm
- Docker Desktop or Docker Engine with the Compose plugin

## Local setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy the example environment file and replace placeholder values:

   ```sh
   cp .env.example .env
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env`.

   **Never commit your real `.env` file or credentials.** Set a strong, unique `SUPER_ADMIN_PASSWORD`.

3. Start the local services:

   ```sh
   docker compose up -d
   ```

   The Compose configuration exposes PostgreSQL on port `5433` and Redis on port `6379` for local development.

4. Create the database schema and seed the initial super-admin account:

   ```sh
   npm run migrate
   npm run seed
   ```

5. Start the API:

   ```sh
   npm run dev
   ```

   The server uses `PORT` from your environment and defaults to `3000`. With the example value `PORT=3003`, use:

   - Health check: `http://localhost:3003/health`
   - API documentation: `http://localhost:3003/api-docs`

## Environment variables

The checked-in [`.env.example`](./.env.example) lists the configuration keys used by the application.

| Variable | Purpose |
|---|---|
| `PORT` | HTTP port (defaults to `3000`) |
| `CLIENT_URL` | Allowed frontend origin for CORS and state-changing browser requests |
| `CROSS_SITE_COOKIES` | Set to `true` only when the frontend and API are cross-site; requires HTTPS |
| `DB_USER`, `DB_HOST`, `DB_PASSWORD`, `DB_PORT`, `DB_NAME` | PostgreSQL connection |
| `DB_SSL` | Set to `true` for TLS connections to hosted PostgreSQL (for example, Neon); defaults to `false` for local Docker PostgreSQL |
| `REDIS_URL` | Redis connection string |
| `SUPER_ADMIN_NAME`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` | Initial admin seed configuration |
| `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | S3-compatible media storage |
| `GOOGLE_CLIENT_ID` | Google sign-in configuration |
| `SMTP_USER`, `SMTP_PASSWORD` | SMTP email delivery |
| `SIGNUP_LIMIT`, `SIGNIN_LIMIT`, `GOOGLE_AUTH_LIMIT`, `OTP_VERIFY_LIMIT`, `OTP_RESEND_LIMIT`, `PASSWORD_RESET_REQUEST_LIMIT`, `PASSWORD_RESET_LIMIT`, `PASSWORD_CHANGE_LIMIT`, `ADMIN_SETUP_LIMIT` | Optional per-IP limits for each authentication action (requests per 15 minutes) |
| `AUTH_LIMIT` | Optional fallback limit for authentication actions when no action-specific limit is set |
| `PUBLIC_READ_LIMIT` | Optional public GET request limit per IP per minute |

External-service credentials are only needed for the integrations you configure. Use the exact environment names in `.env.example` and never put secrets in source control.

State-changing browser requests must send an `Origin` matching `CLIENT_URL`. Requests without an `Origin` header remain supported for server-to-server clients.

### Render and Vercel deployment checks

- Set `CLIENT_URL` to the deployed frontend URL (for example, `https://reko-tan.vercel.app`). The API normalizes paths and trailing slashes to the origin used by browser CORS and write-origin checks.
- Set `CROSS_SITE_COOKIES=true` when the frontend and API use different sites, such as `vercel.app` and `onrender.com`. In production, the session cookie is then `SameSite=None; Secure; HttpOnly`.
- The frontend must send credentialed requests (for `fetch`, use `credentials: "include"`; for Axios, use `withCredentials: true`) for login cookies to be saved and sent.
- Configure hosted `DB_*` values and a reachable hosted `REDIS_URL`. Redis is required for sessions, OTPs, and rate limits; a local Docker Redis URL will not work from Render.
- Cross-site cookie settings cannot override browser third-party-cookie restrictions. For reliable Safari/iPhone sessions, use frontend and API custom domains under the same site where possible (for example, `app.example.com` and `api.example.com`).
- A sleeping Render instance can delay the first request while it starts. The API cannot remove that platform cold start; use an always-on service plan or have the client tolerate/retry startup delays.

Authentication and public-read rate limits use Redis with a separate key prefix per action. Every API instance must use the same reachable `REDIS_URL` for limits to be shared. If Redis is unavailable, rate-limited requests fail closed with `503 RATE_LIMIT_STORE_UNAVAILABLE`. Limits are keyed by client IP; OTP codes and cooldowns are additionally isolated by email and purpose.

## Authentication response codes

The signup, sign-in, OTP, password-recovery, and password-change flows return `{ code, message, data }` so clients can use stable codes rather than parsing messages.

| Flow | Status and code | Client action |
|---|---|---|
| New signup; verification code sent | `201 OTP_SENT` | Continue to OTP; data includes expiry and resend timing. |
| Existing verified account | `409 EMAIL_ALREADY_EXISTS` | Sign in. |
| Existing unverified account | `409 EMAIL_REQUIRES_VERIFICATION` | Explicitly request a code using `/auth/resend-otp`; signup does not issue another OTP. |
| Verification resend accepted | `200 OTP_REQUEST_ACCEPTED` | Check email; account/OTP details are intentionally undisclosed. |
| Verification resend cooldown | `429 OTP_COOLDOWN` | Check email or retry after `data.retryAfterSeconds`. |
| OTP invalid, expired, or attempts exceeded | `400 INVALID_OTP`, `400 OTP_EXPIRED`, or `429 OTP_ATTEMPTS_EXCEEDED` | Correct the code or request a new one as indicated by `data.nextStep`. |
| Password recovery requested | `200 PASSWORD_RESET_REQUEST_ACCEPTED` | Check email. The response is identical for unknown accounts and cooldowns to prevent enumeration. |
| Password reset/change completed | `200 PASSWORD_RESET` or `200 PASSWORD_CHANGED` | Continue to sign in. |
| Request rate limited | `429 RATE_LIMITED` | Retry after the response's rate-limit headers permit. |

`otpSent: null` in resend and password-recovery responses means the API intentionally does not disclose whether an account exists or an email was sent. The resend cooldown remains shared in Redis.

## Maintenance functionality

The backend currently has no maintenance endpoint or maintenance action. No maintenance route or authorization contract is implemented; the frontend must not expect one from this API.

## Useful scripts

```sh
npm run dev          # Run the development server
npm run build        # Compile TypeScript
npm test             # Run the API regression tests
npm start            # Run the compiled server
npm run migrate      # Initialize/update the database schema
npm run seed         # Create the initial super-admin account
npm run seed:benin   # Load the Benin historical dataset
npm run seed:reading # Load the reading content dataset
```

## Related project

- [REKÒ Frontend](https://github.com/NemoCode-3011/Rekonekt-Frontend) — React and TypeScript application.

REKÒ is currently developed around the **Benin Empire** as its first exhibition focus. This inaugural subject helps define the platform's content model and establishes a foundation for future exhibitions, stories, and connected Nigerian historical and cultural material.
