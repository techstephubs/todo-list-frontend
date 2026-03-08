# Project Memory — Todo List Frontend

## Product Identity

Todo List Frontend is the client application for a Todo List product.

- **Scope:** Frontend only (Angular SPA). Backend/auth APIs are consumed via HTTP; no backend code in this repo.
- **Repository:** `github.com/techstephubs/todo-list-frontend`.

## Core Architecture

- **Stack:** Angular 19, standalone components, Reactive Forms, Angular Router.
- **Styling:** CSS (no SCSS).
- **Prefix:** `tl` (e.g. `tl-task-list`).
- **Build:** `ng build`; dev server `ng serve` (default port 4200).
- **Tests:** Jasmine + Karma (default Angular setup).

## Branches and Workflow

- **main:** Production-ready code.
- **develop:** Integration branch for development.
- **Flow:** Feature work on develop; merge to main for release. PRs required; no force-push on shared branches.

## Specified Features (Current)

### Authentication (Jira spec — PO validation pending)

- **Login screen:** Dedicated route (e.g. `/login`).
  - "Log in with LinkedIn" (OAuth 2.0; redirect or popup; callback TBD with backend).
  - "Log in with email" (email + password form; client-side validation; submit to future `POST /auth/login`).
  - "Sign up" link → navigates to Signup screen.
  - Loading state on submit; validation errors shown inline or near form.
- **Signup screen:** Dedicated route (e.g. `/signup`).
  - Form: First name, Last name, Email, Password (all required; client-side validation).
  - "Sign up" button → submit to future `POST /auth/register`; loading state; success/error feedback.
  - Link back to Login ("Already have an account? Log in").
- **General:** Responsive UI; accessible labels/inputs; no sensitive data logged or exposed.
- **Backend:** Not in this repo; endpoints and LinkedIn OAuth flow TBD with backend team.

### Todo List (Planned)

- Core todo CRUD and list UI will be specified in separate Jira cards after auth is validated.

## Code and Conventions

- **Language:** Code, comments, commit messages, and file/variable names in **English**.
- **Components:** Standalone; PascalCase names; files in kebab-case (e.g. `task-list.component.ts`).
- **Services:** `providedIn: 'root'` unless a narrower scope is required.
- **Routing:** Central routes in `app.routes.ts`; feature routes as needed.
- **Forms:** Prefer Reactive Forms; validators for required, email format, min length as per spec.
- **Templates:** Prefer `async` pipe for observables; avoid heavy logic in templates.
- **Commits:** Imperative, in English (e.g. "add login form", "fix signup validation").

## UX and Quality Standards

- Toast or inline messages for success/error where specified.
- Loading states on async actions (disable button or spinner) to avoid double submit.
- Responsive layout (mobile and desktop).
- Accessible: labels associated with inputs, focus visible, semantic HTML.

## Operational Preferences

1. All code/docs/commits in English.
2. Assistant responses can be in Portuguese for this user.
3. Follow specs in Jira; no scope creep without PO alignment.
4. Keep `.cursor/rules/` and `.cursor/context/PROJECT_MEMORY.md` as single source of project context; no custom agents or skills in this repo.
5. Prefer small, focused components and services.

## Fast Validation Routine

After substantive edits:

- **Lint/Build:** `npm run build` (must pass).
- **Run locally:** `npm start` → open http://localhost:4200.
- **Manual:** Smoke-test changed routes (e.g. `/login`, `/signup` when implemented); check form validation and navigation.

## Fast Resume (Machine Switch)

1. `git pull`
2. `npm install`
3. `npm start`
4. Open http://localhost:4200 and confirm app loads.

## Near-Term Priorities

1. PO validation of Login/Signup Jira spec; then implement auth UI (login + signup screens, forms, validation, routing).
2. Align with backend on auth API contracts (`/auth/login`, `/auth/register`, LinkedIn OAuth callback).
3. Implement todo list feature once auth spec is closed and backend is ready (or stubbed).
