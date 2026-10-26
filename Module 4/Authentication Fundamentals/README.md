# Authentication Fundamentals Starter

## Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm start
```

The SQLite datasource keeps local setup self-contained. Registration stores an asynchronous bcrypt hash, and login returns the same generic error for an unknown email or incorrect password. Successful responses contain only `id`, `name`, and `email`. Do not commit `.env` or `prisma/dev.db`.

## Endpoints

- `POST /auth/register`
- `POST /auth/login`

Registration accepts `{ "name": "Sam", "email": "sam@example.com", "password": "correct horse battery staple" }`.
Login accepts `{ "email": "sam@example.com", "password": "correct horse battery staple" }`.

Both endpoints require a JSON object with non-empty string values for their required fields. Email addresses are trimmed and lowercased before lookup or storage. Registration returns `201`, or `409` when the normalized email is already registered. Login returns `200` for valid credentials and `401` with `INVALID_CREDENTIALS` for either credential failure. Invalid input returns `400`; unexpected errors return a generic `500`.
