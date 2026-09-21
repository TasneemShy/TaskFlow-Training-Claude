# Session 1 exercise: fix the 4 seeded bugs

Four small, real bugs have been introduced into the task API and task UI. Each one lives in a
single file, and each one already has a failing test that catches it. Nothing else in the app
is broken — if a test outside this list fails on your machine, that's a different session's
bug, not yours to fix today.

## Setup

```bash
npm install
npm test
```

You'll see more than 4 failing tests — this repo has bugs seeded for later sessions too. For
today, only these four are in scope:

- `app/api/tasks/route.test.ts` — "respects limit and offset"
- `components/AddTaskForm.test.tsx` — "rejects an empty or whitespace-only title"
- `lib/task-authz.test.ts` — both cases
- `components/TaskItem.test.tsx` — "sends the correct state after repeated toggles"

Run one file at a time to keep the output readable:

```bash
npx vitest run lib/task-authz.test.ts
```

