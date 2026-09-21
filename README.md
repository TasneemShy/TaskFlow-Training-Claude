# TaskFlow

A lightweight project and task tracker built for a Claude Code training course. Next.js 14
(App Router, TypeScript) with an in-memory SQLite database (`better-sqlite3`, no ORM) that
seeds itself on server start — there is no database setup step.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The database is created fresh, in memory,
the first time the server handles a request, and seeded with a couple of users, projects, and
tasks. Restarting the dev server always comes back to that same clean state — nothing is written
to disk.

Use the "Signed in as" switcher in the header to swap between the two seeded users and exercise
ownership checks.

## Test it

```bash
npm test
```

Runs the full Vitest + React Testing Library suite. Each test file that touches the database
builds its own fresh in-memory instance, so test files never share state.

## Lint

```bash
npm run lint
```
