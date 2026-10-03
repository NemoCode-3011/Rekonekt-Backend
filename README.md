# REKONEKT Backend

Backend API for **REKONEKT**, a digital museum of Nigerian history.

REKONEKT is being built to make Nigerian history more accessible through exhibitions, stories, events, people, places, artifacts, documents, and sources.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Redis
- Docker
- Zod
- Cloudflare R2
- Nodemailer
- Swagger / OpenAPI

## Features

- User registration and email verification
- OTP authentication
- Password reset
- Redis-based sessions
- HTTP-only session cookies
- Google authentication
- Role-based authorization
- Exhibition management
- Sections and stories
- Historical events
- People and places
- Artifacts
- Media uploads
- Source and citation management
- Bookmarks
- Personal notes
- Exhibition progress tracking
- API documentation

## Architecture

The backend follows a simple layered structure:

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
SQL Queries
  ↓
PostgreSQL


Authentication sessions are stored in Redis and identified through an HTTP-only cookie.

Museum media is stored in Cloudflare R2, while PostgreSQL stores the media metadata and relationships.

Project Structure
src/
├── config/
├── controller/
├── database/
├── docs/
├── middleware/
├── model/
├── routes/
├── service/
├── types/
├── utils/
├── validation/
└── server.ts


GETTING STARTED:


Prerequisites

You will need:

1.Node.js
2.Docker
3.npm
4.Installation
5.git clone <repository-url>
6.cd rekonekt-backend
7.npm install

Create your environment file:

1.cp .env.example .env

2.Add your own configuration values to .env.

3.Database

4.Start PostgreSQL and Redis with Docker:

5.docker compose up -d

6.Run the database migration:

npx tsx migrate.ts
Development
npm run dev
Build
npm run build
API Documentation

When the server is running, Swagger documentation is available at:

http://localhost:3003/api-docs

Authentication

REKONEKT uses server-side sessions rather than JWTs.

Client
  ↓
HTTP-only session cookie
  ↓
Express
  ↓
Redis
  ↓
PostgreSQL

Sessions expire after seven days.

## Roles

Visitor

Can explore the museum and manage personal features such as:

Bookmarks
Notes
Progress


## Admin

Can manage museum content.

## Super Admin

Has administrative privileges including admin management.

Media Storage

Media files are uploaded to Cloudflare R2.

PostgreSQL stores the associated metadata and relationships between media and museum content.


API

The API is organized around museum resources including:

Exhibitions
Sections
Stories
Events
People
Places
Artifacts
Media
Sources
Bookmarks
Notes
Progress
Current Exhibition

The first exhibition being developed is:

The Aburi Accord

The backend is designed to support additional exhibitions and historical collections in the future.


### One change before you paste it

Don't use:

```text
http://localhost:3003

if your .env uses a different PORT.

Use whatever your actual local port is.

Also, we'll replace:

<repository-url>

with your actual GitHub URL once the repo is set up.