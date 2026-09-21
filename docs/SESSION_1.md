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

## The 4 bugs

**1. Task list pagination returns the wrong number of results.**
`GET /api/tasks?limit=N&offset=0` should return exactly `N` tasks. It doesn't. The bug is in
`app/api/tasks/route.ts`.

**2. The "Add Task" form accepts a blank title.**
Typing only spaces into the title field and submitting should show an error and *not* hit the
API. Right now it submits anyway. The bug is in `components/AddTaskForm.tsx`.

**3. Users can delete other people's tasks.**
Only the owner of a task should be able to delete it. Use the "Signed in as" switcher in the
header to confirm: as one user, try deleting a task owned by the other user via
`DELETE /api/tasks/[id]`. The bug is in `lib/task-authz.ts`.

**4. The completion checkbox doesn't reliably reach the server.**
Toggling a task's checkbox in the UI should PATCH the server with the new `completed` value
every time. It looks like it works, but check what's actually being sent — and how often. The
bug is in `components/TaskItem.tsx`, and it's a React hooks issue, not an API issue.

## How to work each one

1. Read the failing test first. The assertion tells you the expected behavior; the diff tells
   you what's actually happening.
2. Read only the one source file the test imports. Every bug here is fully contained in a
   single file — you will never need to touch a second file to fix one of these.
3. Form a hypothesis before you edit. These are small, plausible-looking diffs on purpose —
   nothing is commented as broken, and the code compiles and lints cleanly as-is.
4. Fix it, then re-run that one test file to confirm it's green.
5. Once all 4 are green, run the full suite (`npm test`) and confirm you didn't newly break
   anything that was previously passing.

## A note on #3 and #4

Bugs 1 and 2 are quick, mechanical fixes — good for getting comfortable with the workflow.
Bugs 3 and 4 are the real exercise: #3 is a one-line boolean that's easy to misread if you
don't slow down, and #4 requires actually understanding what a React `useEffect` dependency
array does, not just pattern-matching against a diff. Don't rush those two.
