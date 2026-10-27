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
| `CLIENT_URL` | Allowed frontend origin for CORS |
| `DB_USER`, `DB_HOST`, `DB_PASSWORD`, `DB_PORT`, `DB_NAME` | PostgreSQL connection |
| `REDIS_URL` | Redis connection string |
| `SUPER_ADMIN_NAME`, `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` | Initial admin seed configuration |
| `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | S3-compatible media storage |
| `GOOGLE_CLIENT_ID` | Google sign-in configuration |
| `SMTP_USER`, `SMTP_PASSWORD` | SMTP email delivery |

External-service credentials are only needed for the integrations you configure. Use the exact environment names in `.env.example` and never put secrets in source control.

## Useful scripts

```sh
npm run dev       # Run the development server
npm run build     # Compile TypeScript
npm start         # Run the compiled server
npm run migrate   # Initialize/update the database schema
npm run seed      # Create the initial super-admin account
```

## Related project

- [REKÒ Frontend](https://github.com/NemoCode-3011/Rekonekt-Frontend) — React and TypeScript application.

REKÒ is being developed around **The Aburi Accord** as its first exhibition. The platform's content model is designed to support further exhibitions and connected Nigerian historical and cultural material.
