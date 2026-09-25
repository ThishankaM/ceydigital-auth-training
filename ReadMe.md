# Authentication System: Implementation & Bug Fixes

This document describes the implementation and stabilization of the user authentication flow—sign-up, login, logout, and session verification—using **Passport.js**, **Express Session** with a PostgreSQL store, and **bcrypt**.

## Contents

- [Overview](#overview)
- [Summary of Changes](#summary-of-changes)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Build and Run](#build-and-run)

## Overview

Authentication is session-based. Passport's local strategy validates credentials, while Express Session persists the authenticated user between requests. Passwords are stored as bcrypt hashes and are never returned in API responses or session data.

---

## Summary of Changes

### 1. Architecture Alignment: JWT vs. Passport Sessions

- **Initial state:** A custom JWT login handler was attempted in `user-controller.ts`, although the base template was already designed for sessions with `passport`, `connect-pg-simple`, and `express-session`.
- **Resolution:** Switched to Passport's `LocalStrategy` session flow, enabling `req.isAuthenticated()`, `/auth/me`, `/auth/verify`, and protected-route middleware such as `isLoggedIn`.

---

## 📁 File-by-File Changelog

### 1. `src/config/passport-strategies/passport-local.ts`

- **Fixed database column mismatches:**
  - Changed `password` to `password_hash`.
  - Changed `first_name, last_name` to `full_name`.
- **Fixed the bcrypt runtime error** (`data and hash arguments required`):
  - Validated that `user.password_hash` exists before calling `bcrypt.compare()`.
  - Removed `user.password_hash` before returning the user to avoid exposing hashes in memory or sessions.

### 2. `src/config/passport.ts`

- **Resolved the strategy registration error** (`Unknown authentication strategy "local"`):
  - Removed the duplicate `export default` syntax error.
  - Registered the strategy with `passport.use("local", LocalLogin)`.
  - Linked `serializeUser` and `deserializeUser` handlers.

### 3. `src/routes/auth-router.ts`

- **Added missing routes:**
  - Added `POST /auth/login`, wired to `passport.authenticate("local")` with error handling.
  - Added `POST /auth/logout`, which destroys the session with `req.session.destroy()`.
- Added `express-validator` rules for sign-up and login requests.

### 4. `src/controllers/user-controller.ts`

- Removed the experimental JWT implementation.
- Retained `create` and `get`, using parameterized PostgreSQL queries (`$1`, `$2`, `$3`) and bcrypt hashing with 10 salt rounds.

---

## Database Schema

| Attribute | Controller (`create`) | Passport Local (`verify`) | Session User |
| :--- | :--- | :--- | :--- |
| **ID** | `id` | `id` | `id` |
| **Name** | `full_name` | `full_name` | `full_name` |
| **Email** | `email` | `email` | `email` |
| **Password** | `password_hash` | `password_hash` | *(Omitted)* |

---

## API Reference

### 1. Register / Sign Up

**Route:** `POST /auth/signup`

**Request body:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```

**Response (201 Created):**

```json
{
  "message": "Account created successfully",
  "success": true,
  "user": {
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
2. Login
Route: POST /auth/login
Request Body:
JSON

```

{

**Route:** `POST /auth/login`

**Request body:**
**Response (200 OK):** Sets the `connect.sid` cookie in the response headers.

```

{

**Route:** `GET /auth/verify`

**Header:** `Cookie: connect.sid=...`

**Response (200 OK):**
    "id": "1",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
3. Verify Session Status
Route: GET /auth/verify
Headers: Cookie: connect.sid=...
Response (200 OK):
JSON

```

{

**Route:** `GET /auth/me`

**Header:** `Cookie: connect.sid=...`

**Response (200 OK):**
    "user": {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  ```

  "message": "Authenticated"

  **Route:** `POST /auth/logout`

  **Response (200 OK):** Clears the session from the database and deletes the session cookie.
Headers: Cookie: connect.sid=...
Response (200 OK):
JSON
```

## Build and Run

TypeScript compiles to the `build/` directory. Recompile whenever `.ts` files change:
  "success": true,
```bash
# Install dependencies, if needed
npm install
    "id": "1",
# Compile TypeScript
    "email": "john@example.com"
  }
# Start the server
5. Logout
Route: POST /auth/logout

## Security Notes

- Keep session and database credentials in environment variables.
- Use HTTPS in production so session cookies are protected in transit.
- Never log passwords, password hashes, or session secrets.
Response (200 OK): Clears session from DB and deletes session cookie.
JSON

{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
🚀 How to Build and Run
Since TypeScript compiles to the build/ directory, recompile whenever changes are made to .ts files:

Bash

# 1. Compile TypeScript
npm run build

# 2. Start Node Server
npm start