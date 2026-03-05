# Project Overview

This is a **POS (Point of Sale) management system** frontend built with **React** and **Tailwind CSS**. The project follows a modular, scalable architecture designed to support 30+ screens. Development uses a frontend-first approach with mock data, and backend integration will be added later.

---

# Tech Stack

| Technology       | Purpose                              |
| ---------------- | ------------------------------------ |
| **React**        | UI library (functional components)   |
| **TypeScript**   | Type safety and developer experience |
| **Tailwind CSS** | Utility-first CSS framework          |
| **Vite**         | Build tool and dev server            |
| **React Router** | Client-side routing                  |
| **Axios**        | HTTP client for API communication    |

---

# Project Structure

```
src/
├── assets/        # Static files: images, icons, fonts
├── components/    # Shared, reusable UI components
├── layouts/       # App-level layout wrappers (sidebar, header, etc.)
├── pages/         # Top-level screen/page components
├── features/      # Feature-specific logic and components
├── services/      # API layer and external service integrations
├── mock/          # Mock data files used during development
├── hooks/         # Custom React hooks
├── utils/         # Helper/utility functions
├── types/         # Shared TypeScript types and interfaces
├── router/        # Route definitions and configuration
├── store/         # Global state management
├── styles/        # Global CSS and theme configuration
```

### Folder Details

- **`assets/`** — Store all static resources here. Organize by type (e.g., `images/`, `icons/`, `fonts/`).
- **`components/`** — Reusable UI building blocks shared across multiple pages (buttons, modals, tables, etc.).
- **`layouts/`** — Page layout templates. For example, `MainLayout` with sidebar + header, or `AuthLayout` for login screens.
- **`pages/`** — One file per screen. Each page composes components and consumes data from mock or services.
- **`features/`** — Feature-specific business logic, grouped by domain (e.g., `features/products/`, `features/orders/`). Use when logic grows beyond a single page.
- **`services/`** — The API communication layer. All external calls go through `api.ts`.
- **`mock/`** — Development mock data. Each file exports arrays or objects matching the expected API response shape.
- **`hooks/`** — Custom React hooks for shared stateful logic (e.g., `useAuth`, `useDebounce`).
- **`utils/`** — Pure utility functions (formatting, validation, calculations).
- **`types/`** — Shared TypeScript interfaces and type definitions.
- **`router/`** — Centralized route configuration using `react-router-dom`.
- **`store/`** — Global state management (e.g., Zustand, Context API).
- **`styles/`** — Global styles, Tailwind theme customization, and CSS variables.

---

# Development Rules

## ✅ Do

- Use React **functional components** with hooks
- Use **Tailwind CSS** utility classes for all styling
- Keep components **small, focused, and reusable**
- Use mock data from the `/mock` folder during development
- Follow **feature-based architecture** for complex domains
- Write **clean, modular code** with clear separation of concerns

## ❌ Don't

- Do **not** hardcode data inside components
- Do **not** create large monolithic components — break them down
- Do **not** introduce new dependencies without a clear reason
- Do **not** mix business logic inside UI components — extract to hooks or features

---

# Data Strategy

All numeric, list, or API-driven data must come from `/mock` files until backend APIs are implemented.

**Current flow:**

```
Page → services/api.ts → mock/*.ts (returns mock data)
```

**Future flow:**

```
Page → services/api.ts → Backend API (real HTTP calls)
```

`services/api.ts` acts as the single point of contact for all data. This design ensures that switching from mock data to real APIs requires changes **only** in the service layer — no page or component changes needed.

---

# Screen Development Workflow

When creating a new screen, follow these steps:

1. **Create a page** inside `/pages` (e.g., `ProductsPage.tsx`)
2. **Compose UI** using components from `/components`
3. **Consume data** from `/mock` through the service layer
4. **If logic grows**, extract domain-specific logic into `/features`
5. **Register the route** in `/router/router.tsx`

---

# Code Style

- Use **TypeScript** for all files
- Prefer **arrow functions** for components and handlers
- Use **Tailwind utility classes** — avoid inline CSS or `style` props
- Avoid `any` type — define proper interfaces in `/types`
- Prefer **composition over inheritance**
- Use **named exports** for components, **default export** for pages

---

# Naming Conventions

| Type       | Convention                  | Example                    |
| ---------- | --------------------------- | -------------------------- |
| Components | PascalCase                  | `ProductCard.tsx`          |
| Pages      | PascalCase + `Page` suffix  | `DashboardPage.tsx`        |
| Hooks      | camelCase with `use` prefix | `useProducts.ts`           |
| Utils      | camelCase                   | `formatCurrency.ts`        |
| Types      | PascalCase                  | `Product.ts`, `Order.ts`   |
| Mock data  | camelCase                   | `products.ts`, `orders.ts` |
| Styles     | kebab-case                  | `global.css`               |

---

# Future Backend Integration

All API calls **must** go through:

```
services/api.ts
```

This centralized API layer provides:

- **Bearer token injection** via request interceptors
- **Error handling** via response interceptors (e.g., auto-redirect on 401)
- **Base URL config** via `VITE_API_URL` environment variable

When the backend is ready, replace mock imports in service functions with real Axios calls. Pages and components should require **zero changes**.

---

# Agent Behavior

When generating code for this project:

- **Follow the project structure** — place files in the correct directories
- **Reuse existing components** — check `/components` before creating new ones
- **Prefer simple and maintainable solutions** over clever abstractions
- **Do not generate unnecessary files** — only create what is needed
- **Keep code readable and modular** — future developers must understand it easily
- **If creating a new screen, always follow the existing architecture and do not invent a new structure**
