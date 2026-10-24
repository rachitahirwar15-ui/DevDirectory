# DevDirectory

**BCA Semester III — Modern Frontend Frameworks**  
**Student:** Rachit Ahirwar · **Roll number:** R57661  
**Institution:** Jaipur National University

DevDirectory is a responsive React single-page application for discovering real public GitHub profiles, viewing the course-assignment developer records and their posts, and submitting a new post behind a simulated session. It keeps the required JSONPlaceholder workflow intact and adds a live GitHub profile directory for authentic developer accounts.

## Requirements implemented

- React 18+ and React Router v6+ SPA routing for `/`, `/users`, `/users/:id`, `/login`, `/add-post`, and a `*` 404 route.
- A single configured Axios client in `src/services/api.js`, with JSONPlaceholder as its base URL, an 8-second timeout, and JSON content-type headers. The GitHub service also uses this same Axios client for requests to GitHub public REST endpoints.
- Centralized endpoint functions in `src/services/postService.js`: `GET /users`, `GET /users/:id`, `GET /posts?userId=:id`, and `POST /posts`.
- Two clearly labelled directory sources: **Real GitHub profiles** (curated public accounts with live profile metadata and direct links) and **Assignment API** (JSONPlaceholder data required by the brief).
- GitHub directory cards use real avatar images, GitHub usernames, profile URLs, bios, locations, companies, follower counts, and public repository counts when the API provides them. If GitHub rate-limits requests, real direct profile links remain available.
- GitHub search can discover additional real accounts; the assignment dataset continues to debounce and filter specifically by the required developer name and company fields.
- Developer profile pages with JSONPlaceholder user-specific posts, preserving the exact assignment routes and API contracts.
- React Context authentication state, simulated login, and `ProtectedRoute` for `/add-post`. The original destination, including its query string and hash, is preserved for the login redirect.
- A controlled post form with an API-populated author dropdown, title limits of 5–80 characters, body limits of 20–500 characters, a disabled submit button while the form is invalid, and success/reset behavior for HTTP 201.
- Loading skeletons and dismissible, retryable error alerts for API-driven views and form submission.
- Responsive dark styling with restrained electric-blue accents and a mobile navigation menu.

## Run locally

Use Node.js 18 or newer. In this folder, run:

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Production build check

```bash
npm run build
npm run preview
```

The production build should be checked locally before submission. The project is not marked deployed until a public hosting URL is added by the student.

## Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home overview and summary statistics | Public |
| `/users` | Searchable developer directory | Public |
| `/users/:id` | Developer profile and their posts | Public |
| `/login` | Mock sign-in / sign-up interface | Public, guest-facing |
| `/add-post` | Create a developer publication | Protected |
| `*` | Not-found page | Public |

## API and demo limitations

JSONPlaceholder provides sample data for coursework. Its `POST /posts` endpoint returns a simulated created post (normally HTTP 201) but does not persist it to the remote collection. GitHub profile data is public and unauthenticated requests are rate-limited; a limited or unavailable API may delay live metadata, but cards continue to link to the actual public profiles. Authentication is a frontend demonstration only; it is not a secure production identity system. Do not use a real password.

## Required submission steps

- [ ] Rename the public repository to `bca-frontend-devdirectory-R57661`.
- [ ] Publish a public GitHub/GitLab repository link.
- [ ] Deploy the app and add the actual hosting URL.
- [ ] Run `npm run build` and verify `npm run preview`.
- [ ] Capture real, annotated screenshots for loading/empty, error/retry, desktop, and mobile states.
- [ ] Complete the project report with the architecture diagram, data flow, screenshots, testing evidence, and self-evaluation.

## Git commit examples

```bash
git commit -m "feat: implement developer directory and profile routes"
git commit -m "feat: protect post creation with mock authentication"
git commit -m "fix: handle API loading and error states"
git commit -m "style: refine responsive dark interface"
```
