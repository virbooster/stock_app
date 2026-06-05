# StockApp - Project Documentation (GEMINI.md)

## Project Overview
StockApp is a professional web application for inventory and stock management. It features a robust dashboard for tracking products, recording movements, archiving items, and performing permanent deletions with full history cleaning.

### Core Technologies
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Database:** SQLite (via `better-sqlite3`)
- **Styling:** Tailwind CSS 4.0
- **Icons:** Lucide React
- **Reporting:** XLSX (Excel) and jsPDF/jsPDF-AutoTable (PDF)
- **Auth:** Custom cookie-based session management with BcryptJS for password hashing.

### Architecture
The project follows a modern Next.js architecture:
- **`app/`**: Contains the App Router pages and Server Actions.
- **`components/`**: Reusable UI components (Layouts, Forms, Buttons, etc.).
- **`lib/`**: Database configuration and shared utility logic.
- **`public/`**: Static assets.

## Building and Running

### Prerequisites
- Node.js installed.
- PowerShell (optional, for the automated script).

### Key Commands
- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev` (Runs on `http://localhost:3000`)
- **Build for Production:** `npm run build`
- **Start Production Server:** `npm run start`
- **Linting:** `npm run lint`
- **Automated Startup (Windows):** `.\start_app.ps1`

## Development Conventions

### Styling & Themes
- The application uses **Tailwind CSS 4.0** with CSS variables for dynamic theming.
- **Dynamic Themes:** Supports three professional presets: `Modern SaaS` (Default), `Minimalist`, and `Corporate Steel`.
- **Theme Selection:** Managed via `ThemeProvider` and `ThemeSelector` components. Styles are persisted in `localStorage`.
- **Compaction:** Tables and headers are optimized for density to ensure 10 records and pagination fit on a single screen without scrolling. Use `py-2` for table cells and `mb-3` for section spacing to maintain this density.

### Database Patterns
- **Transactional Logic:** Critical operations (like permanent deletion) MUST use `db.transaction()` to ensure atomicity across `Product` and `Movement` tables.
- **Timestamps:** Use `DATETIME('now', 'localtime')` for SQLite timestamps to ensure local consistency.
- **Revalidation:** Use `revalidatePath("/path")` after mutations in Server Actions to keep the UI in sync.

### UI/UX Standards
- **Confirmation Modals:** Destructive actions (like permanent delete) must include a confirmation modal with a subtle backdrop blur (`bg-gray-500/20 backdrop-blur-sm`).
- **Tooltips:** Use the `title` attribute for descriptive hints on action buttons.
- **Buttons:** Maintain consistency using the `.btn-primary` class or specific Tailwind utility combinations defined in `globals.css`.

### Authentication
- Middleware handles session redirection for `/dashboard` and `/login`.
- Default credentials (development): `Virginia / Virginia`.

## Key Files
- `lib/db.ts`: SQLite database initialization and schema.
- `app/actions/products.ts`: Server actions for product mutations (Add, Edit, Archive, Delete).
- `app/dashboard/DashboardClient.tsx`: Main dashboard logic and compact table implementation.
- `components/ThemeProvider.tsx`: State management for dynamic styles.
- `CHANGELOG.md`: Detailed history of versions and stable releases.
