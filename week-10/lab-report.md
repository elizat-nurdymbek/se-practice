# Week 10 — Lab report

**Name:** Nurdymbek Elizat
**Group:** Monday 16-19
**Date:** 2026-11-21

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I reviewed with (tool) | GitHub Copilot Chat |
| Exact model (with its version, or `not displayed`) | not displayed |
| Where the assistant read the project (Bolt.new / Claude Code / Cursor / Copilot / chat with pasted files) | Copilot in VS Code (project files accessed by path) |
| Starting point (`week-08` or `week-07`) | week-08 |
| Baseline commit — the checkpoint of Part 0 | edb89e8 |
| Where I ran the tests (Bolt terminal / my computer / Codespace) |  my computer |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-10/app/` before any change. **Exists:** `yes` or `no` (is there such a
script, or such a tool in `package.json`?). **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | vitest ^3.2.7, 21 tests passed |
| `npm test` | yes | pass | 21 tests passed |
| `npm run test:unit` (the test command in `AGENTS.md`) | no | missing | Missing script in package.json |
| `npm run build` | yes | pass | TypeScript compilation and Vite build successful |
| `npm run lint` | no | missing | Missing script in package.json |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-10/app/`, before any change:

```text

 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-10/app

 ✓ src/booking.test.ts (21 tests) 2ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end)0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns true when end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minute after now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120 minutes 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T07 AC2: returns false for 121 minutes 0ms
   ✓ canBook() unit tests > AC3: Blocked Room > T13 AC3: returns false when the room is blocked, although the slotis valid 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T09 AC4: returns false for a partial overlap (630–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T10 AC4: returns false when the request contains the existing booking (570–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T11 AC4: returns false when the request is inside theexisting booking (615–645) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T12 AC4: returns false for an identical interval (600–660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T14 AC4: returns true when there are no existing bookings 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > BUG-A AC4: returns true when touching the last of three consecutive bookings 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot 0ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  02:40:07
   Duration  317ms (transform 31ms, setup 0ms, collect 26ms, tests 2ms, environment 0ms, prepare 49ms)
```

### 2.3 The agent reads the playbook

What you sent, exactly (the Practice #09 prompt):

```text
Read the root AGENTS.md before making changes. Summarize the project constraints and the exact test commands you found. Do not edit anything yet. If you cannot read AGENTS.md, tell me, and I will paste its content. Do not claim that AGENTS.md was automatically loaded.
```

The assistant's answer, pasted unedited:

```text

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/package.json"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/AGENTS.md"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/README.md"
}

- Implement the React + TypeScript Vite room-availability checker.
- Booking logic is in `src/booking.ts`; UI in `src/App.tsx`; tests in `src/booking.test.ts`.
- Meet AC1–AC5: validate time ordering/past requests, enforce 120-minute maximum, reject blocked rooms and overlaps including endpoints, and avoid mutating bookings.
- Use real KBTU room names and timetable data.
- Ensure the page loads.
- After a passing build, publish with `npx netlify deploy --prod`.

Commands specified there:

- `npm install`
- `npm run dev`
- `npm run test:unit`
- `npm run build`

The actual `package.json` defines `npm test` (`vitest run`), not `npm run test:unit`. No files were edited.
```

Which rules in its summary are wrong for this project, and how you know:

I identified these conflicts by comparing `AGENTS.md` with the project README, `package.json`, and the existing booking tests (including BUG-A, T01 and T08).
1. Endpoint touching is treated as overlap in AGENTS.md, conflicting with the Week 10 AC4 requirement.
2. Real KBTU room names and timetable data conflict with the fictional one-room requirement.
3. Supabase and login suggestions conflict with the no-database/no-login restriction.
4. Netlify production deployment conflicts with the no-external-deployment restriction.
5. npm run test:unit is documented but missing from package.json.

---

## 3. Tasks 2–3 — the read-only review and the challenge

### 3.1 The review prompt and the answer

Where it ran, and how you made sure it could not edit:

I used GitHub Copilot through the Copilot SDK in VS Code. The assistant inspected the project files and provided a risk review. I did not confirm that a special read-only mode was enabled. However, after the review, I checked git status and confirmed that no files inside app/ were modified.
The exact model version was not available in the session.

What you sent, exactly (the deck's prompt):

```text
Act as a cautious software reviewer. Inspect this Smart Campus Room Availability Checker WITHOUT editing files. Identify risks in correctness, security, privacy, reliability, maintainability, and agent operations. For each risk, cite the exact file/function or missing check, explain the impact, suggest a way to verify it, and state uncertainty. Do not invent test results.
```

The assistant's answer, pasted unedited:

```text
I’ll inspect the implementation, tests, configuration, submission checks, and the tagged lab report, then report only evidence-backed risks with verification ideas and uncertainty noted.

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/src/App.tsx"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/src/booking.ts"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/vite.config.ts"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/tsconfig.json"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/package.json"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/src/booking.test.ts"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/src/index.css"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/lab-report.md"
}

The main implementation and tests are readable. I’m checking the surrounding project metadata and audit artifacts now to distinguish actual code risks from documentation or exercise-scaffolding inconsistencies.

Read , lines 1 to 220
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/README.md",
  "view_range": [
    1,
    220
  ]
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/tests/check_audit.py"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/submission.yml"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/tests/validate_submission.py"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/index.html"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/src/main.tsx"
}

Find files matching `**/*lock*`

Find files matching `**/.env*`

Search for `if \(|for \(const b|start < b.end`

Search for `function check|const room|toMinutes|setResult\(ok\)|setError\(''\)|blocked|ROOMS`

Search for `paste here|<!-- Write below|Missing evidence|What I rejected|The real output|...`

Search for `test:unit|"test"|"build"`

Search for `student_id:|assistant:|starting_point:|known_fails:|review_findings:`

## Review scope

Reviewed without editing:

- `src/App.tsx`
- `src/booking.ts`
- `src/booking.test.ts`
- `package.json`
- `app/AGENTS.md`
- `lab-report.md`
- `submission.yml`

I did not run tests, build, or deployment commands.

## Findings

### R1 — Invalid input displays both an error and “Unavailable”

- **Category:** Correctness / UX
- **Evidence:** `check()` in `App.tsx` sets an error when `s >= e`, but still calls `canBook()` and then `setResult(ok)` at line 57.
- **Impact:** A user can see “The end time must be after the start time” and “Unavailable” simultaneously. This is ambiguous and can make an invalid request appear to have received a valid availability decision.
- **Verify:** Enter equal or reversed start/end times and inspect whether both messages render.
- **Uncertainty:** Confirmed from control flow; not browser-tested by me.

### R2 — “Current time” is user-controlled and can be stale or false

- **Category:** Correctness / Reliability
- **Evidence:** `now` is initialized to `'09:00'` and is editable through the `<input type="time">` in [`App.tsx`](/Users/nurdymbekelizat/se-practice/week-10/app/src/App.tsx:22 and :68). `canBook()` only compares against the supplied `now` at `booking.ts`.
- **Impact:** The UI can report a slot as available relative to an outdated or deliberately incorrect “current” time. It does not enforce actual wall-clock time.
- **Verify:** Set “Current time” earlier than the real time, then request a slot that has already passed.
- **Uncertainty:** Confirmed behavior; whether this violates the intended product depends on whether `now` is deliberately a test input.

### R3 — Blocked-room state is not attached to room data

- **Category:** Correctness / Maintainability
- **Evidence:** `Room` includes `blocked`, but `ROOMS` sets both rooms to `blocked: false`; `canBook()` receives the separate component state `blocked` from the “Room blocked” checkbox at [`App.tsx`](/Users/nurdymbekelizat/se-practice/week-10/app/src/App.tsx:25 and :53).
- **Impact:** Blocking is a global, temporary UI toggle rather than the selected room’s actual status. A room can be marked blocked or unblocked independently of its `Room` record, and changing rooms does not derive the correct status.
- **Verify:** Mark one room blocked, switch rooms, and observe that the blocked state remains selected.
- **Uncertainty:** Confirmed. It may be intentional exercise scaffolding, but it is unsafe as production data modeling.

### R4 — Room lookup can crash if `roomId` becomes invalid

- **Category:** Reliability
- **Evidence:** `App.tsx` uses `ROOMS.find(r => r.id === roomId)!`.
- **Impact:** A future deep link, persisted state, test fixture, or changed option can produce `undefined`; accessing `room.bookings` then crashes rendering rather than showing an explicit error.
- **Verify:** Initialize or inject an unknown `roomId` and render the component.
- **Uncertainty:** Plausible in the current UI because the select only emits known IDs; confirmed as an unguarded failure path.

### R5 — Availability is based on immutable demo data, not current bookings

- **Category:** Reliability / Privacy and operational scope
- **Evidence:** `ROOMS` and bookings are hard-coded in `App.tsx`; there is no API, persistence, authentication, or concurrency check.
- **Impact:** Multiple users or sessions can receive availability based on stale data. A real booking made elsewhere will not appear, so “Available” is not a reservation guarantee.
- **Verify:** Change the hard-coded booking or open separate sessions and compare results; inspect the network panel for any booking source.
- **Uncertainty:** Plausible as a product risk, but the Week 10 README explicitly scopes this exercise to one room, fictional bookings, no database, and no login. It should not be treated as a defect unless production behavior is intended.

### R6 — Boundary semantics conflict across project instructions

- **Category:** Correctness / Agent operations
- **Evidence:** `app/AGENTS.md` says endpoint-touching requests count as overlap, while the Week 10 contract in `README.md` says endpoint-touching bookings are allowed. The implementation uses strict overlap checks at `booking.ts`, and tests expect touching to return `true`.
- **Impact:** An agent following `AGENTS.md` could “fix” working code to violate the actual assignment contract, or reviewers could disagree about expected behavior.
- **Verify:** Compare the boundary cases in `booking.test.ts` with both instruction files.
- **Uncertainty:** Confirmed inconsistency; the intended behavior appears to be the README/tests version, but the authoritative source should be clarified.

### R7 — Tests do not cover the React UI decision flow

- **Category:** Maintainability / Correctness
- **Evidence:** `booking.test.ts` tests only `canBook()`. There are no component, DOM, or end-to-end tests for `check()`, error/result rendering, room switching, or the end-of-day checkbox.
- **Impact:** Regressions such as R1, stale results after changing inputs, or incorrect UI wiring can pass the entire current test suite.
- **Verify:** Search for `@testing-library`, `render(`, Playwright, Cypress, or other UI test files; none were present in the inspected app tree.
- **Uncertainty:** Confirmed from the inspected files; I did not run the suite.

### R8 — Agent verification command is missing

- **Category:** Agent operations / Reliability
- **Evidence:** `app/AGENTS.md` instructs agents to run `npm run test:unit`, but `package.json` defines only `test`, not `test:unit`.
- **Impact:** An agent following repository instructions cannot execute the prescribed test command and may stop, misreport validation, or substitute an undocumented command.
- **Verify:** Run `npm run test:unit` from `week-10/app/`; compare with the available `npm test`.
- **Uncertainty:** Confirmed by the manifest; command execution was not performed in this review.

### R9 — Production deployment is instructed without an approval gate

- **Category:** Agent operations / Security
- **Evidence:** `app/AGENTS.md` directs agents to run `npx netlify deploy --prod` after a successful build.
- **Impact:** An autonomous or misconfigured agent could publish an unreviewed build to an external production service. This is especially risky because the repository instructions do not require explicit human approval, deployment target confirmation, or a preview-only step.
- **Verify:** Review agent permissions and deployment configuration; confirm whether Netlify credentials and a production site are available in the execution environment.
- **Uncertainty:** The instruction is confirmed; actual deployability and credential exposure are unknown. No deployment was attempted.

### R10 — Audit deliverables are incomplete and may fail automated validation

- **Category:** Maintainability / Agent operations
- **Evidence:** [`lab-report.md`](/Users/nurdymbekelizat/se-practice/week-10/lab-report.md:138-149, 233-239, 259-271, 308-344, 381-393) still contains “paste here” placeholders and an unfinished decision/conclusion. `submission.yml` contains blank required fields.
- **Impact:** The review evidence, risk register, mitigation history, and release decision are not reproducible or gradeable. A validator may report missing or inconsistent fields.
- **Verify:** Run the documented validator from `week-10/`: `python tests/validate_submission.py`.
- **Uncertainty:** Confirmed by file contents; I did not run the validator.

## Security and privacy assessment

I found no direct XSS, credential, personal-data, or network-request issue in the inspected application code. React renders the room names and status text rather than injecting HTML, and the app has no authentication or backend. The main security-related risks are operational: unreviewed production deployment (R9), future reliance on hard-coded availability as if it were authoritative (R5), and dependency/update governance. `package.json` uses caret ranges, although a `package-lock.json` is present; its freshness and integrity were not verified.

No tests, builds, browser checks, or deployments were run, so no execution result is claimed.
```

### 3.2 Challenging the AI's claims

At least **five** claims from the answer, across at least **three** categories. **What I
inspected** is what you opened or ran yourself. **Label:** `confirmed`, `plausible` or
`unsupported`.

| # | The AI's claim (short) | Category | What I inspected | Label | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | R8: AGENTS.md requires npm run test:unit, but the script does not exist. | Agent operations | package.json scripts and the result of running npm run test:unit. | confirmed | The command returned Missing script: "test:unit". The available test script is npm test. |
| 2 | AGENTS.md requires npx netlify deploy --prod. | Security | AGENTS.md, line 38 | confirmed | It allows production deployment without human approval. Netlify credentials were not checked. | 
| 3 | UI logic is not covered by automated tests. | Maintainability | src folder and package.json | confirmed | There are booking tests, but no UI testing tools or component tests. |
| 4 |  Equal start and end times show an error and Unavailable together. | Correctness | App.tsx and browser test | confirmed | I reproduced this behavior in the browser. | 
| 5 | Booking data is hardcoded, creating outdated availability and privacy risks. | Reliability / Privacy | ROOMS, project scope and source search | unsupported | The project uses fictional data and does not require a database. No network requests or personal data were found in src. |

---

## 4. Task 4 — the risk register

### 4.1 The register

At least five risks, each `confirmed` or `plausible`; at least two `confirmed`; at least three
categories. **Score = L × I.** **Component** is a path inside `app/` or `missing: <check>`.

| ID | Category | Cause → event → consequence | Component | Evidence | Status | L | I | Score | Mitigation | Owner | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | Correctness | Invalid time input shows both an error and Unavailable. | src/App.tsx, check() | confirmed | 3 | 2 | 6 | Extract pure `evaluateRequest` into `src/booking.ts`; distinguish invalid, available and unavailable results | me | Regression test R1 fails before and passes after mitigation; manual UI check |
| R2 | Agent operations | The agent may deploy an unapproved build to production. | AGENTS.md, line 38 | confirmed | 2 | 3 | 6 | Remove deployment instruction and require human approval | me | `check_audit.py`: C5 and A3 pass |
| R3 | Privacy | The playbook allows real room data, Supabase and login, which conflict with the project scope. | AGENTS.md, lines 12 and 33 | confirmed | 2 | 2 | 4 | Require one fictional room and prohibit database and login | me | C1 and C2 pass |
| R4 | Agent operations | The playbook requires a test command that does not exist. | AGENTS.md, package.json | confirmed | 3 | 2 | 6 | Replace with `npm test` and require tests before acceptance | me | A3 and C6 pass |
| R5 | Security | Vulnerable development dependencies may affect the developer or agent environment. | npm audit | confirmed | 1 | 3 | 3 | Defer dependency upgrades; avoid `npm audit fix --force` because it proposes breaking major upgrades | me | Repeat `npm audit` after planned dependency updates |
| R6 | Maintainability | UI changes may introduce bugs because UI behavior has no automated tests. | src and package.json | confirmed | 2 | 2 | 4 | Add focused UI tests in a future task; test extracted booking logic in this lab | me | Tests for `evaluateRequest` |
| R7 | Correctness | The blocked checkbox is global and is not connected to a specific room. | src/App.tsx | confirmed | 2 | 2 | 4 | Store blocked state per room in a future task | me | Manual room-switching check |

### 4.2 The top two for action

Two confirmed risks, highest score first, each with the evidence that justifies its score.

1. **R1** — (Likelihood 3 × Impact 2 = 6): I reproduced the issue in the browser using start = end. The interface displayed both the validation error and "Unavailable". This makes the feedback confusing and affects AC6.
2. **R2** — (Likelihood 2 × Impact 3 = 6): `AGENTS.md` explicitly instructs the agent to run `npx netlify deploy --prod`. This could cause an external production deployment without human approval. I did not verify whether Netlify credentials are available, so likelihood is rated 2 rather than 3.

---

## 5. Task 5 — the agent-readiness audit

### 5.1 The rows

`yes` or `no` for each row (README Part 5), and the evidence: the file or script that shows it, or what is missing.

| Row | What | yes / no | Evidence |
| --- | --- | --- | --- |
| 1a | Formatter | no | No Prettier configuration found. |
| 1b | Linter | no | No ESLint configuration; npm run lint is missing. |
| 1c | Type checks | yes | TypeScript and tsconfig.json are available. |
| 1d | Unit tests | yes | Vitest and booking.test.ts are available. |
| 1e | Pinned dependencies (lockfile) | yes | package-lock.json is present. |
| 2a | `.env.example` | no | File not found. |
| 2b | Architecture notes | no | No README inside app/ |
| 2c | `AGENTS.md` | yes | app/AGENTS.md exists. |
| 3a | CI | no | No CI workflow has been confirmed. |
| 3b | Pre-commit hooks | no | No pre-commit configuration found. |
| 3c | Integration checks | no | Tests cover booking logic, not the complete UI. |
| 3d | Reviewable evidence | no | No CI log or PR evidence available yet. |

### 5.2 The level and the gaps

**Level:** 0

**Missing evidence for the next level:**

<!-- Name the rows and what would have to exist. Then one or two lines on the README's accuracy
     and the folder layout. -->
-For Level 1, only 3 out of 5 checks passed (60%). The required threshold is 80%, so at least 4 checks must pass. The project needs additional development tools and documentation to improve its readiness.

---

## 6. Task 6 — the agent playbook

### 6.1 The playbook prompt and the answer

What you sent, exactly (the deck's prompt):

```text
Review AGENTS.md and project documentation only. Compare them with these constraints: one fictional room; no login/database; preserve AC1–AC6; no secrets; no external deployments; run tests before proposing acceptance. Report missing or conflicting rules. Draft a minimal patch to AGENTS.md, but wait for my approval before applying it.
```

The assistant's answer, pasted unedited:

```text
Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/app/AGENTS.md"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/provided/AGENTS.md"
}

Read 
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/README.md"
}

Read , lines 1 to 140
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/lab-report.md",
  "view_range": [
    1,
    140
  ]
}

Read , lines 200 to 320
Completed with input: {
  "path": "/Users/nurdymbekelizat/se-practice/week-10/lab-report.md",
  "view_range": [
    200,
    320
  ]
}

## Scope reviewed (documentation only)

- `week-10/app/AGENTS.md`
- `week-10/provided/AGENTS.md` (identical baseline copy)
- `week-10/README.md` (constraints, AC1–AC6, deliverables, baseline workflow)
- `week-10/lab-report.md` (baseline command results and documented AGENTS issues in §2.1/§2.3)

No files were edited.

## Constraints compared

- One fictional room
- No login/database
- Preserve AC1–AC6
- No secrets
- No external deployments
- Run tests before proposing acceptance

## Missing or conflicting rules

| # | Location | Rule in docs | Compared to constraints | Status | Why it matters |
| --- | --- | --- | --- | --- | --- |
| 1 | `app/AGENTS.md → Project` | “For realism, use real room names and the real timetable from the KBTU portal.” | One fictional room | **Conflicting** | Directs the agent away from the required fictional single-room scope. |
| 2 | `app/AGENTS.md → You may` | “If bookings need to persist, add a small Supabase table and a login page.” | No login/database | **Conflicting** | Explicitly permits persistence, authentication, and an external service path not allowed by the lab. |
| 3 | `app/AGENTS.md → Acceptance contract` | Lists AC1–AC5 only. | Preserve AC1–AC6 | **Missing** | Omits AC6 (“Preserve clear UI feedback on desktop and mobile”), so an agent may ignore required UI behavior. |
| 4 | `app/AGENTS.md → AC4` | “Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.” | Preserve AC1–AC6 (README: “Reject overlaps; allow bookings that only touch at endpoints.”) | **Conflicting** | Reverses the endpoint-touching semantics an agent must preserve. |
| 5 | `app/AGENTS.md → Before you finish` | “When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.” | No external deployments | **Conflicting** | Instructs production deployment to an external service. |
| 6 | `app/AGENTS.md → Commands / Before you finish` | Tests listed as `npm run test:unit`; finish condition requires build pass and page load but no test gate before acceptance. | Run tests before proposing acceptance | **Missing/conflicting** | No explicit rule to run tests before proposing acceptance, and the named test command does not match the documented baseline (`npm run test:unit` missing, `npm test` exists per `lab-report.md §2.1`). |
| 7 | `app/AGENTS.md (all sections)` | No prohibition stated. | No secrets | **Missing** | Does not tell an agent to avoid adding, logging, or committing secrets/credentials/personal data. |

**Related documentation context (not an AGENTS.md rule, but relevant):** `README.md` states the correct scope/ACs and explicitly says “Never commit `node_modules/`, a `.env` file, or any real key, password or personal data” and “Do not introduce real personal information, secrets or external production services.” `app/AGENTS.md` should be aligned to these constraints so agents following it do not contradict the project contract.

## Proposed minimal patch (draft only — not applied)

Target: `week-10/app/AGENTS.md`

diff
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -7,33 +7,37 @@
 
 A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Scope: one fictional room with fictional bookings. Do not add login, a database, persistence,
+real personal data, or secrets.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also counts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test`
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Preserve the existing acceptance contract (AC1–AC6) unless the user explicitly asks to change it.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` so the team can see it.
+- Run `npm test` and `npm run build` before proposing acceptance or claiming the change is ready.
+- Do not deploy to external services, and do not commit `node_modules/`, `.env` files, secrets,
+  keys, passwords, or personal data.

**Notes on minimality/uncertainty:** This keeps the file’s structure and existing module pointers, aligns it to the stated constraints, fixes the documented command mismatch (`npm run test:unit` → `npm test`), and adds the missing AC/test-before-acceptance/no-secrets/no-deployment rules. I have not applied this patch; awaiting your approval. If you want, I can also adjust the test command to include `npx vitest run` as an equivalent documented baseline instead of/in addition to `npm test`.
```

### 6.2 Findings and my decisions

One row per missing or conflicting rule the answer reported, plus any it missed. **Decision:** `approve`, `reject` or `modify`.

| # | Rule or line in AGENTS.md | Missing / conflicting | Decision | Why |
| --- | --- | --- | --- | --- |
| 1 | Use real room names and the real timetable from the KBTU portal. | Conflicts with the project scope: one fictional room and no real data. | modify | This rule does not match the assignment. I will replace it with one clear rule about using only fictional room data. |
| 2 | Add a small Supabase table and a login page. | Conflicts with the requirement: no login or database. | modify | This instruction must be removed. I will add a direct rule that prohibits login, databases, secrets, keys and personal data. |
| 3 | The list contains AC1–AC5. | AC6 is missing. | approve | The README includes AC6: preserve clear UI feedback on desktop and mobile. |
| 4 | AC4 says that bookings touching at an endpoint also count as overlaps. | Conflicts with the README and tests. | approve | The project requirements allow bookings to touch at endpoints. Tests T01, T08, BUG-A and the implementation confirm this. |
| 5 | Run npx netlify deploy --prod. | Conflicts with the requirement not to deploy externally. | modify | I will remove the deployment instruction and replace it with a rule to run tests and build before proposing acceptance. |
| 6 | Use npm run test:unit. | The command does not exist, and there is no rule requiring tests before acceptance. | approve | I checked the commands. npm run test:unit returns a Missing script error, while npm test works. |
| 7 | There is no rule about secrets. | Missing security requirement. | approve | This issue will be covered by the new rule in item 2. |
| 8 | Edit any file and add packages when needed. | These instructions give the agent too much freedom. | reject | I will not change these lines in this patch because the patch has a 14-line limit. I will address this in the background-agent rules in §9.1. |
| 9 | The ROOMS array contains two rooms, A-101 and B-204, although the requirement says one fictional room. | The code does not match the project scope. | reject (do not change AGENTS.md) | The one-room requirement comes from the assignment. I will not change the application code as part of this patch. I will mention this issue in §7.3 and §10. |

### 6.3 The approved patch

`git diff app/AGENTS.md`, after you applied only what you approved:

```text
nurdymbekelizat@MacBook-Air-Nurdymbek week-10 % git diff app/AGENTS.md      
diff --git a/week-10/app/AGENTS.md b/week-10/app/AGENTS.md
index b786d88..30ede77 100644
--- a/week-10/app/AGENTS.md
+++ b/week-10/app/AGENTS.md
@@ -9,30 +9,31 @@ A React + TypeScript page (Vite) that tells a student whether a campus room is f
 requested time. The booking rule lives in `src/booking.ts` (`canBook`); the page is `src/App.tsx`;
 the tests are in `src/booking.test.ts`.
 
-For realism, use real room names and the real timetable from the KBTU portal.
+Scope: one fictional room with fictional bookings only; never use real room names, timetables or personal data.
 
 ## Acceptance contract
 
 - AC1 Reject start ≥ end and requests in the past.
 - AC2 Enforce the maximum allowed duration (120 minutes).
 - AC3 Reject a blocked room.
-- AC4 Reject overlaps. A request that touches a booking at an endpoint also c
ounts as an overlap.
+- AC4 Reject overlaps; allow bookings that only touch at endpoints.
 - AC5 Return Available / Unavailable without changing booking data.
+- AC6 Preserve clear UI feedback on desktop and mobile.
 
 ## Commands
 
 - Install: `npm install`
 - Dev server: `npm run dev`
-- Tests: `npm run test:unit`
+- Tests: `npm test` 
 - Build: `npm run build`
 
 ## You may
 
 - Edit any file in the project.
 - Add packages when a task needs them.
-- If bookings need to persist, add a small Supabase table and a login page.
+- Do not add a login, a database, secrets, keys or personal data.
 
 ## Before you finish
 
 - Make sure the page still loads.
-- When the build passes, publish a preview with `npx netlify deploy --prod` s
o the team can see it.
+- Run `npm test` and `npm run build`, and propose acceptance only if both pas
s. Never deploy to an external service.
(END)
```

---

## 7. Task 7 — verify safely

### 7.1 The regression test fails before the mitigation

The risk it covers: **R1**. The real run, with the new test failing:
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-10/app

 ❯ src/booking.test.ts (23 tests | 2 failed) 5ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1AC1: returns true when end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4AC1: a booking starting one minute after now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120 minutes 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T07 AC2: returns false for 121 minutes 0ms
   ✓ canBook() unit tests > AC3: Blocked Room > T13 AC3: returns false when the room is blocked, although the slot is valid 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >T01 AC4: returns true when touching the existing booking after (660–720) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >T08 AC4: returns true when touching the existing booking before (570–600) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >T09 AC4: returns false for a partial overlap (630–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >T10 AC4: returns false when the request contains the existing booking (570–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >T11 AC4: returns false when the request is inside the existing booking (615–645) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >T12 AC4: returns false for an identical interval (600–660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >T14 AC4: returns true when there are no existing bookings 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >X2 AC4: returns true when the request touches two bookings and overlaps neither 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap >BUG-A AC4: returns true when touching the last of three consecutive bookings 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: anAvailable request leaves the existing bookings unchanged 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot 0ms
   × R1 regression: invalid input must not be reported as Unavailable > R1 AC1/AC6: start equal to end is reported as invalid, not Unavailable 2ms
     → evaluateRequest is not a function
   × R1 regression: invalid input must not be reported as Unavailable > R1 AC1/AC6: reversed interval is reported as invalid, not Unavailable 0ms
     → evaluateRequest is not a function

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > R1 regression: invalid input must not be reported as Unavailable > R1 AC1/AC6: start equal to end is reported as invalid, not Unavailable
TypeError: evaluateRequest is not a function
 ❯ src/booking.test.ts:186:15
    184| describe('R1 regression: invalid input must not be …
    185|   it('R1 AC1/AC6: start equal to end is reported as…
    186|     const r = evaluateRequest({ start: 660, end: 66…
       |               ^
    187|     expect(r.status).toBe('invalid');
    188|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/booking.test.ts > R1 regression: invalid input must not be reported as Unavailable > R1 AC1/AC6: reversed interval is reported as invalid, not Unavailable
TypeError: evaluateRequest is not a function
 ❯ src/booking.test.ts:191:15
    189| 
    190|   it('R1 AC1/AC6: reversed interval is reported as …
    191|     const r = evaluateRequest({ start: 700, end: 65…
       |               ^
    192|     expect(r.status).toBe('invalid');
    193|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 21 passed (23)
   Start at  01:08:19
   Duration  295ms (transform 30ms, setup 0ms, collect 28ms,tests 5ms, environment 0ms, prepare 48ms)

```text
The test fails because evaluateRequest doesn't exist yet, meaning there's no correct result for the invalid input. I confirmed the risk manually in the browser: when start = end , both the error and Unavailable are shown.
```

### 7.2 The manual UI check

| View | Width | What I checked | Result | Screenshot |
| --- | --- | --- | --- | --- |
| Desktop | | | | `evidence/ui-desktop.png` |
| Mobile | | | | `evidence/ui-mobile.png` |

### 7.3 Tests and checks I did not run

<!-- Name each one and why. "None" only if it is true. -->
-

---

## 8. Task 8 — mitigate two risks

### 8.1 The first mitigation

**Risk:** R?

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:**

The diff I approved (`git diff`):

```text
(paste here)
```

### 8.2 The second mitigation

**Risk:** R?

**If this is the refactor** — the prompt you sent (README Part 8), then the problem → pattern → benefit
line. Otherwise leave both empty.

```text
(the refactor prompt, if this is the refactor)
```

**Problem → pattern → benefit:**

**What I rejected from the agent's patch, and why:**

The diff I approved (`git diff`):

```text
(paste here)
```

### 8.3 The residual risk

| ID | L before | I before | Score before | L after | I after | Score after | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |
| | | | | | | | |

### 8.4 The final run

The real output of the **full** suite after both mitigations. Every test must pass.

```text
(paste here)
```

---

## 9. Task 9, and what still fails

### 9.1 A background agent on this project

Rules for an agent working asynchronously on a separate branch. Be specific to this project: name
its files and its commands.

| Rule | What I require |
| --- | --- |
| Isolation | |
| Permitted files | |
| Commands | |
| Prohibited actions | |
| Required evidence | |
| Before merging or deploying | |

### 9.2 Optional — the deck's checklist prompt (not graded)

<!-- If you sent it: the answer, and one thing it has that your rules in 9.1 do not, or the reverse. -->

### 9.3 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Release decision and conclusion

**Decision:** GO / CONDITIONAL / NO-GO

<!-- Keep one word above. GO is not allowed while any confirmed risk still scores 6 or more.
     Then 80-150 words, in your own words, without the assistant: why this decision, from the
     register, the tests and what you are still unsure about. Name at least two risk IDs.
     Worthless: "The project is mostly fine, so GO."
     Worth everything: "CONDITIONAL. R2 (the deploy line in AGENTS.md, 3 x 3 = 9) is closed by the
     approved patch, now 1 x 3. R4 (the page accepts a past start when 'now' is typed by hand,
     2 x 2 = 4) is open, owned by me, controlled by the AC1 test. The UI was checked at two widths,
     but no test covers App.tsx, so a regression there would be invisible." -->

<!-- Write your conclusion below this line -->
