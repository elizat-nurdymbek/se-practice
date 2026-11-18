# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT |
| Assistant model | GPT-6 |
| Starting point | week-08 |
| Baseline commit | 4235df7 |
| Language (ts or js) | ts |
| Vitest version | 3.2.7 |
| Where I ran the tests | local macOS terminal |

### 1.1 Baseline run

```text

 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/sis-04/app

 ✓ src/booking.test.ts (21 tests) 3ms
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
   Start at  16:39:46
   Duration  336ms (transform 28ms, setup 0ms, collect 27ms, tests 3ms, environment 0ms, prepare 43ms)
```

## 2. Context for the assistant

### 2.1 Repository map

```text
sis-04/app
├── index.html          Vite entry page
├── package.json        scripts and dependencies (react, vite, vitest)
├── tsconfig.json, vite.config.ts   build / test configuration
└── src/
    ├── main.tsx        mounts <App /> into the page
    ├── App.tsx         the whole page: ROOMS data, Room type, form state, toMinutes/fmt helpers,
                        check() handler, rendering of the result and bookings list
    ├── booking.ts      canBook({start,end,now,blocked,bookings}): AC1–AC4, no mutation (AC5)
    ├── booking.test.ts 21 Vitest tests for canBook (T01–T14, X1–X4, BUG-A, BUG-B)
    └── index.css       page styles (AC6)
```

### 2.2 The context message as sent

```text
I am extending a small React + TypeScript + Vitest app (Smart Campus Room Availability Checker).
I want a maintainability analysis and a plan of small steps. Do NOT write code and do NOT propose
a full rewrite.

Repository map:
- src/main.tsx: mounts App
- src/App.tsx: the whole page. Holds ROOMS data (2 rooms: id, name, blocked, bookings), type Room
  and type Interval, form state (roomId, now, blocked checkbox, start, end, endOfDay, result,
  error), helpers toMinutes and fmt, the check() handler, rendering.
- src/booking.ts: canBook({start,end,now,blocked,bookings}) with AC1-AC4, no mutation.
- src/booking.test.ts: 21 Vitest tests for canBook, all passing (baseline 21/21).
- src/index.css: styles.

Existing criteria that must stay true:
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

New requirements:
Catalog of at least 4 fictional rooms, each with id, name, capacity, equipment list, blocked
status and its own bookings.
F1 Capacity filter: room capacity >= requested attendees.
F2 Equipment filter: the room must contain ALL selected items.
F3 A blocked room cannot be reported as available.
F4 Clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result.
The availability check must use the chosen room's bookings, not another room's data.

Fixed target layout: src/rooms.ts (Room type + ROOMS), src/filter.ts (filterRooms),
src/booking.ts (canBook unchanged + checkRoom(rooms, roomId, request) that calls canBook),
UI imports the rules and holds no rules or room data.

Constraints: fictional data only; fixed current time; no login, payments, live APIs, database,
network calls or browser storage.

Please give me:
1. Maintainability risks, each with the file and function it is in and what evidence I can check
   myself in the code.
2. A prioritised plan of small steps, smallest safe step first, with the tests to run after each.
Do not write implementation code.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | Room data and UI responsibilities are mixed | src/App.tsx | The ROOMS array, Room type, form state, helper functions and UI rendering are in the same component file | High |
| 2 | Room-specific blocked status is not used by the availability handler | rc/App.tsx, check() | check() passes the separate blocked state variable to canBook() instead of using the selected room's blocked property | High |
| 3 | Availability result can become stale after room selection changes | src/App.tsx, room select onChange | The room selector updates roomId, but does not reset or recompute result | High |
| 4 | Time validation is duplicated in the UI and booking module | src/App.tsx, check() and src/booking.ts | check() checks start and end ordering, and canBook() also validates the interval | Medium |
| 5 | Interval type is duplicated across module boundaries | src/App.tsx and src/booking.ts | App.tsx defines Interval, while booking.ts separately describes booking intervals in its parameter type | Low |

### 3.2 Improvement plan — before editing

1. Extract the Room and Interval types and create a catalog of at least four fictional rooms in src/rooms.ts. Include capacity, equipment, blocked status and bookings. Preserve the existing canBook() behavior. Run the existing 21 tests after the change.
2. Add checkRoom() in src/booking.ts. It should find the selected room, handle unknown room IDs, and use that room's blocked status and bookings. Add tests for room selection, blocked rooms and non-mutation. Run the full Vitest suite.
3. Create src/filter.ts with filterRooms(). Implement capacity and equipment filtering, requiring all selected equipment. Add tests for matching rooms and empty results. Run the full Vitest suite.
4. Refactor src/App.tsx to use the separate rooms, booking and filter modules. Add capacity and equipment controls, a clear empty state, and remove the separate blocked checkbox. Run Vitest and TypeScript checks.
5. Fix the stale availability result when the selected room changes or is filtered out. Verify AC1–AC6 and F1–F5 manually, inspect desktop and mobile layouts, and capture the required screenshots.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Rewrite or modify the existing canBook() function while implementing the new features. | Modified| I decided to keep canBook() unchanged because the original implementation passed all 21 baseline tests. I will add checkRoom() separately to reduce regression risk and preserve AC1–AC5 |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
