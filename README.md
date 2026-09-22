# Ceydigital Auth Training

A small React + TypeScript + Vite app that walks through a sign up, log in, and
protected dashboard flow. It ships with an in-memory mock API so the whole flow
works without a backend.

## Requirements

- Node.js 20 or newer
- npm

## Getting started

```bash
npm install
npm run dev
```

Open the printed URL (http://localhost:5173 by default). The app starts on the
home page and uses the mock API out of the box.

Demo account: `test@example.com` / `Password123`

## Configuration

Copy `.env.example` to `.env` and adjust as needed.

- `VITE_API_URL` - base URL of the auth API, without a trailing slash. Empty
  means "use the mock API".
- `VITE_USE_MOCKS` - `"true"` or `"false"`. When unset, mocks are used only if
  `VITE_API_URL` is empty.

To talk to a real backend, set `VITE_API_URL` (for example
`http://localhost:3000/api`) and `VITE_USE_MOCKS=false`. The client expects JSON
responses and sends cookies (`credentials: "include"`).

## Scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - type check the project and build to `dist/`
- `npm run lint` - run ESLint
- `npm run preview` - serve the production build locally

## Routes

- `/` - landing page with links to log in or sign up
- `/login` - email and password sign in
- `/signup` - create an account, then redirects to `/login`
- `/dashboard` - protected screen showing the signed in user

`/dashboard` checks the auth context on mount and sends visitors without a
session back to `/login`.

## Project structure

```
src/
  components/
    common/PasswordInput.tsx      shared password field
    layout/AuthLayout.tsx         split brand panel + form wrapper
  features/auth/
    validation.ts                 validators and matching antd form rules
    components/
      AuthProvider.tsx            auth context + useAuth hook
  pages/                          HomePage, LoginPage, SignupPage, DashboardPage
  services/api/                   apiClient, auth endpoints, mock backend
  types/api.ts                    shared API and domain types
  main.tsx                        app entry point
```

## Notes and limitations

- The mock API keeps users in memory, so accounts and the session are lost on a
  page refresh.
- Sign up requires a password of at least 8 characters; the mock backend
  accepts any password that long.
- There is no test runner configured yet.
