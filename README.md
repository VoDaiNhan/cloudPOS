# CloudPOS Frontend

This application is the frontend SPA for CloudPOS.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Axios
- React Router

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Local API Integration

- development API traffic is proxied from `/api` to `http://localhost:5109`
- shared request configuration lives in `src/services/api.ts`
- auth token is read from `localStorage.access_token`
- current store context is read from `localStorage.store_id`

## Project Structure

- `src/pages/` — page-level screens
- `src/components/` — reusable UI components
- `src/layouts/` — public, auth, and dashboard shells
- `src/router/` — route definitions and modal routing
- `src/services/` — frontend access to backend endpoints
- `src/types/` — shared TypeScript contracts
- `src/utils/` — mappers and domain helpers
- `src/store/` — shared state providers
- `src/mock/` — remaining mock/demo data
- `src/styles/` — global CSS and landing styles

## Working Notes

- This frontend is not purely mock-backed anymore. Check each service before assuming a page still uses mock data.
- Preserve the existing CloudPOS admin UI style unless a task explicitly asks for redesign work.
- When changing API contracts, update the related service, mapper, types, and page/component usage together.

## Validation

Run:

```bash
npm run build
npm run lint
```

Then manually verify the routes or flows affected by the change.
