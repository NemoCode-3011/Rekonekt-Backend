# REKONEKT Backend

Backend API for **REKO**, a digital museum of Nigerian history. The API serves exhibitions, stories, events, people, places, artifacts, media, and sources, with visitor accounts and admin content management.

## Tech stack

- Node.js, TypeScript, and Express
- PostgreSQL for application data
- Redis for user sessions
- Zod for request validation
- Swagger / OpenAPI for API documentation
- Optional integrations: Cloudflare R2 for media storage, Nodemailer for email, and Google sign-in

## Requirements

- Node.js and npm
- Docker Desktop (or Docker Engine with the Compose plugin)

## Local setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env` file in the project root. The checked-in `.env.example` is currently empty, so add the values below yourself:

   ```dotenv
   PORT=3003
   DB_USER=postgres
   DB_HOST=localhost
   DB_PASSWORD=postgres
   DB_PORT=5433
   DB_NAME=rekonekt
   SUPER_ADMIN_NAME=REKONEKT Admin
   SUPER_ADMIN_EMAIL=admin@example.com
   SUPER_ADMIN_PASSWORD=change-this-password
   ```

   Use your own secure admin password. `.env` is git-ignored; do not commit it.

3. Start PostgreSQL and Redis:

   ```sh
   docker compose up -d
   ```

   The Compose file exposes PostgreSQL on `localhost:5433` and Redis on `localhost:6379`. Redis currently uses this local URL in the application.

4. Create the database tables:

   ```sh
   npm run migrate
   ```

5. Create the initial super-admin account:

   ```sh
   npm run seed
   ```

6. Start the development server:

   ```sh
   npm run dev
   ```

   The API runs on the port configured in `.env` (shown above as `3003`). Check `http://localhost:3003/health` and open `http://localhost:3003/api-docs` for Swagger.

## Frontend connection

CORS currently allows `http://localhost:5173`. If your frontend runs at a different origin, update the allowed origin in `src/server.ts`.

## Optional integrations

Add the relevant settings to `.env` if you use these features:

- Email delivery: `SMTP_USER`, `SMTP_PASSWORD`
- Google sign-in: `GOOGLE_CLIENT_ID`
- Cloudflare R2 media storage: `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, and `R2_PUBLIC_URL`

## Useful commands

```sh
npm run dev       # Start the development server
npm run build     # Compile TypeScript into dist/
npm start         # Run the compiled server
npm run migrate   # Initialize the database schema
npm run seed      # Create the initial super-admin account
```

## Project structure

```text
src/
├── config/       # External service configuration
├── controller/   # HTTP request handlers
├── database/     # PostgreSQL connection, schema, and seed
├── docs/         # Swagger/OpenAPI definition
├── middleware/   # Authentication and authorization
├── model/        # SQL queries
├── routes/       # Express route definitions
├── service/      # Application and database operations
├── utils/        # Shared helpers
└── validation/   # Request schemas
```

The API uses a layered flow: routes → controllers → services → SQL queries → PostgreSQL. User sessions are stored in Redis and sent through HTTP-only cookies.

## Current exhibition

The first exhibition being developed is **The Aburi Accord**. The backend is intended to support additional exhibitions and historical collections.
