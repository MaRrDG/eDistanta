# eDistanța - Client Agent Guide

Welcome, Agent. This file provides critical context for maintaining and extending the **eDistanța** client application. The project has been strictly refactored into a **Hexagonal Architecture (Ports & Adapters)**.

## 🏗️ Architecture: Hexagonal (Clean)

The codebase is split into three main layers to ensure separation of concerns and testability.

### 1. Core Layer (`src/core/`)
**The "Inside" of the Hexagon.**
- **Entities**: Pure data structures and business logic.
- **Rules**:
  - **NO imports** from `services` or `ui`.
  - Holds truth about domain logic (e.g., CO2 calculations, Romania boundary checks).
  - Uses TypeScript interfaces to define "Ports" (though often implicit in TS).

### 2. Services Layer (`src/services/api/`)
**The "Adapters" (Outbound).**
- Implements communication with external worlds (REST APIs, LocalStorage).
- Handles data transformations from API format to Core Entities.
- **Rules**:
  - Can import from `core`.
  - **NO imports** from `ui`.

### 3. UI Layer (`src/ui/`)
**The "Infrastructure" (Inbound).**
- **Components**: Standardized base components (`base/`) and feature-specific ones (`features/`).
- **Hooks**: Logic for fetching data (using services) and managing local UI state.
- **Contexts**: Global state orchestration (Route, App State).
- **Rules**:
  - Consumes `core` entities and `services`.
  - **NO business logic** (move it to `core` or `use-cases`).

---

## 🎨 Design System & Aesthetics

We follow a **Premium Minimal** aesthetic with vibrant accents and smooth animations.

- **Tokens**: Defined in `src/ui/theme.css` using CSS variables.
- **Tailwind v4**: Uses `@theme` block. 
  - **WARNING**: Avoid naming custom tokens like standard Tailwind scales (e.g., use `--spacing-val-lg` instead of `--spacing-lg` to prevent clashing with `max-w-lg`).
- **Animations**: Standardized Framer Motion variants in `src/ui/animations/`.
- **Base Components**: Always use `BaseButton`, `BaseInput`, `BaseCard` for consistency.

---

## 🛠️ Developer Experience

### Path Aliases
Always use aliases for cleaner imports:
- `@core/*` -> `src/core/*`
- `@services/*` -> `src/services/*`
- `@ui/*` -> `src/ui/*`
- `@contexts/*` -> `src/ui/contexts/*`
- `@utils/*` -> `src/utils/*`
- `@data/*` -> `src/data/*`

### Routing
- `HomePage`: Main search and map interface.
- `RoutePage`: Dedicated page for popular/SEO routes (`/ruta/:slug`).
- `NotFoundPage`: Premium 404 experience with motion layouts.

---

## 🚦 Verification
Before submitting changes:
1. Run `npx tsc --noEmit` to verify type integrity.
2. Check responsiveness for **Mobile** (iPhone, Samsung Browser).
3. Ensure no business logic leaked into the `ui` components.
