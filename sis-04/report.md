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

The rooms.ts file now contains 5 fictional rooms: A-101, B-204, C-305, D-110 and E-001. Each room has its own id, name, capacity, equipment, blocked status and bookings. Lab C-305 is blocked. I also added an attendees field and equipment checkboxes (projector, whiteboard, computers and microphone).
The filterRooms function checks two requirements:
- F1: Room capacity must be equal to or greater than the number of attendees.
- F2: The room must have ALL selected equipment.
The room selector shows only rooms that match the selected filters. Above it, the page shows how many rooms match. If no rooms match, the message "No rooms match: try fewer attendees or less equipment" appears (F4).
The availability result is calculated every time the page updates. This means that when I select another room, the result changes immediately and the previous result does not stay on the screen (F5). Blocked rooms are still visible in the list with a "blocked" label, but they are never shown as Available (F3).

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees = 10, projector and whiteboard selected. Only Room B-204 and Lab C-305 match the filters. |
| `evidence/filter-empty.png` | Attendees = 100. No room has enough capacity, so the message "No rooms match" appears. |
| `evidence/switch-a.png` | Room A-101 selected, current time 09:00, start 10:00, end 11:00. The result is Unavailable because the room is already booked at that time. |
| `evidence/switch-b.png` | The same time settings, but Room B-204 is selected. The result is Available because this room has no bookings. |
| `evidence/narrow.png` | The page is shown on a phone-sized screen in portrait mode. The controls are arranged in one column and the result is visible. |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Contains the Interval and Room types and the catalog of 5 fictional rooms. |
| `src/booking.ts` | Contains booking rules: canBook (AC1–AC5, unchanged) and checkRoom, which finds a room by id and calls canBook using that room's own blocked status and bookings. |
| `src/filter.ts` | Contains filterRooms, which checks capacity (F1) and all selected equipment (F2). It returns a new array. |
| `src/App.tsx` | Handles the UI, form state and rendering. It imports the functions and does not contain room data or booking rules. |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| result and error are calculated on every render using the selected room and time values. | Keep result in useState and reset it when the room changes. | The old result could stay on the screen after changing rooms (risk 3, F5). Calculating it directly prevents this problem and does not require extra reset code. |
| Blocked rooms remain in the filtered list with a "blocked" label. | Hide blocked rooms inside filterRooms. | filterRooms is responsible only for F1 and F2. F3 is checked in canBook, and users can see why a room is unavailable. |
| checkRoom only passes room.blocked and room.bookings to canBook. | The assistant suggested checking blocked rooms directly inside checkRoom as well. | canBook already checks AC3 (test T13), so adding the same check again would duplicate the rule. Test C02 checks F3. |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| The Interval type was defined in App.tsx, booking.ts and inside the canBook signature. | Now there is only one Interval type in rooms.ts, which is imported by the other modules and tests. |
| The blocked status existed in two places: the "Room blocked" checkbox in App.tsx and the blocked field in each room. | Now only room.blocked is used in rooms.ts. The checkbox was removed. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | T03 AC1: returns false for zero duration (start === end) | start = end → false |
| AC2 | T06 B1 AC2: returns true for exactly 120 minutes | 120 minutes → true |
| AC3 | T13 AC3: returns false when the room is blocked, although the slot is valid | Blocked room, valid time → false |
| AC4 | T09 B4 AC4: returns false for a partial overlap (630–690) | Overlap with 600–660 → false |
| AC5 | C05 AC5: checking a room does not change the catalog | Catalog JSON stays the same before and after checking |
| F1 | L01 F1 B5: capacity exactly equal to attendees is included | 8 attendees, room capacity 8 → included |
| F2 | L04 F2: the room must have ALL selected items, not any | Projector + whiteboard → only rooms b and c |
| F3 | C02 F3: a blocked room is never available, although the slot is valid | Blocked room c → false |
| F4 | L07 F4: no matching room gives an empty list | 100 attendees → [] |
| F5 | C01 F5: the same time gives a different result in another room | 600–660: room a → false, room b → true |
| B1 | T06 B1 AC2: returns true for exactly 120 minutes | 120 minutes → true |
| B2 | T07 B2 AC2: returns false for 121 minutes | 121 minutes → false |
| B3 | T01 B3 AC4: returns true when touching the existing booking after (660–720) | 660–720 after 600–660 → true |
| B4 | T09 B4 AC4: returns false for a partial overlap (630–690) | 630–690 vs 600–660 → false |
| B5 | L01 F1 B5: capacity exactly equal to attendees is included | Capacity 8, attendees 8 → included |
| B6 | L02 F1 B6: capacity one below attendees is excluded | Capacity 8, attendees 9 → excluded |
| INT | I01 INT F5 F3: filterRooms then checkRoom gives a per-room result | Filter shows a, b, c; checkRoom → [false, true, false] |

### 6.2 Commands

```text
cd sis-04/app
npm install
npx vitest run src/checkRoom.test.ts   # before checkRoom existed: 5 failed
npx vitest run src/filter.test.ts      # before filter.ts existed: suite failed to load
npx vitest run
npx tsc --noEmit
npm run dev
grep -rn "\.skip\|\.only\|\.todo\|test\.each\|vi\.mock" src/*.test.ts
```

### 6.3 Final run

```text
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/sis-04/app

 ✓ src/integration.test.ts (1 test) 1ms
 ✓ src/checkRoom.test.ts (5 tests) 2ms
 ✓ src/filter.test.ts (9 tests) 2ms
 ✓ src/booking.test.ts (21 tests) 3ms

 Test Files  4 passed (4)
      Tests  36 passed (36)
   Start at  01:00:43
   Duration  309ms (transform 116ms, setup 0ms, collect 166ms, tests 8ms, environment 0ms, prepare 230ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 21/21 | 36/36 | Checked the Tests line in the outputs from sections 1.1 and 6.3. |
| Duplicated logic locations removed | 0 | 2 | Counted the changes in section 5.3 (Interval type and blocked status). |
| Code structure: modules and their responsibilities | App.tsx contained the page, room data, types, helpers and check handler. booking.ts contained canBook. | rooms.ts contains data, booking.ts contains booking rules, filter.ts contains filtering, and App.tsx contains the UI. | Compared git ls-files app/src before and after and checked the responsibilities in section 5.1. |
| Remaining limitation | n/a | The UI does not have automated tests. F4, F5 and the layout were checked manually (6 scenarios) and with screenshots. INT works only at function level. | Compared the test files with App.tsx. There are no tests that render the page. |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** ChatGPT, GPT-6
**Date:** 2026-11-19
**Purpose:** Analysis of the codebase: maintainability risks and a plan of small steps (Task 1).

**Prompt:**

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

**Output used:**

```text
Risks: App.tsx mixes ROOMS data, types, helpers, form state and booking wiring […]
Stale result when roomId changes (F5) […] separate blocked state competes with room data (F3) […]
Plan: 1. extract types and catalog into rooms.ts; 2. add checkRoom, canBook unchanged;
3. add filterRooms; 4. rewire App.tsx; 5. refresh on room change and make layout responsive.
```

**Problems found:** It missed the real AC1 bug in `check()`: no `return` after `setError`, so the error and "Unavailable" were shown together (found by running the page with Start = End). It named a circular-import risk that does not exist, because `rooms.ts` imports nothing. It proposed tests for case and order independence, which are outside F1 and F2. In step 2 it proposed that `checkRoom` rejects blocked rooms itself.
**Changes made:** I added the AC1 bug as risk 4, dropped the circular-import risk and the extra tests, kept AC3 only in `canBook`, and reordered the plan so tests come before code.
**Verified by:** running the page by hand (F5 stale result and AC1 double message confirmed) and reading `src/App.tsx` and `src/booking.test.ts`.

### 8.2 Exchange 2

**Tool and model:** Claude, Claude Sonnet 5.5
**Date:** 2026-11-19
**Purpose:** Implementation with tests first: `checkRoom` and `filterRooms`.

**Prompt:**

```text
I am working on a React + TypeScript room booking project. I need to add two functions: `checkRoom()` and `filterRooms()`.

Please help me write Vitest tests before implementing the functions.

Requirements:
- `checkRoom(rooms, roomId, request)` should find the selected room and check its availability using the existing `canBook()` function.
- It should use the selected room's own `blocked` status and `bookings`.
- If the room ID does not exist, it should return false.
- `filterRooms()` should filter rooms by capacity and selected equipment.
- Capacity must be greater than or equal to the number of attendees.
- A room must have ALL selected equipment items.

Please do not change my existing `canBook()` function. Write tests for normal cases and edge cases, and explain what each test checks. Do not implement the functions yet.
```

**Output used:**

```text
checkRoom.test.ts with a fixed catalog (C01-C05) and filter.test.ts (L01-L09); then
checkRoom(rooms, roomId, request) = find room by id, unknown id -> false, else
canBook({ ...request, blocked: room.blocked, bookings: room.bookings });
filterRooms = rooms.filter(r => r.capacity >= attendees && equipment.every(i => r.equipment.includes(i)))
```

**Problems found:** An earlier draft of `canBook` from the assistant used `start < now`, but my `canBook` rejects `start == now` (test T02), so I kept my own `canBook` and only added `checkRoom`.
**Changes made:** `canBook` untouched; I took the tests as a pattern and checked every expected value against F1, F2, F3 and AC4.
**Verified by:** `npx vitest run src/checkRoom.test.ts` failed 5/5 (`checkRoom is not a function`) and `src/filter.test.ts` failed to load (`Cannot find module './filter'`); after the code, 26/26 and then 35/35 passed.

### 8.3 Exchange 3

**Tool and model:** Claude, Claude Sonnet 5.5
**Date:** 2026-11-19 
**Purpose:** Refactoring: move `Interval` and the catalog into `rooms.ts`, rewire `App.tsx`.

**Prompt:**

```text
I want to refactor my React + TypeScript room booking project to make the code easier to understand and maintain.

Please help me move the `Interval` type, `Room` type and room catalog into a separate `rooms.ts` file.

I also want to organize the project like this:
- `rooms.ts` — types and room data.
- `booking.ts` — existing `canBook()` and new `checkRoom()`.
- `filter.ts` — `filterRooms()`.
- `App.tsx` — user interface only.

Please update the imports where necessary. Remove the separate blocked checkbox because each room already has its own blocked status.

The availability result should update when I select another room. Please keep the existing `canBook()` behavior unchanged and do not add a backend, database or API.

Explain the changes and tell me which commands I should run to check the project.
```

**Output used:**

```text
rooms.ts with Interval, Room and 5 rooms; booking.ts imports Interval from rooms;
App.tsx rewritten: no blocked checkbox, result computed on render from checkRoom,
filterRooms for the list, empty state when no rooms match.
```

**Problems found:** After moving `Interval`, `npx tsc --noEmit` failed: `booking.test.ts` imported `Interval` from `./booking`. Vitest passed 21/21 because it strips types, so only `tsc` showed the error.
**Changes made:** In `booking.test.ts` I import `Interval` from `./rooms` and did not re-export it from `booking.ts`, to keep a single source.
**Verified by:** `npx tsc --noEmit` with no output, `npx vitest run` 36/36, and six manual scenarios in the browser (filter, F5 room switch, F3, F4, AC1, F2).


## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

During this assignment, I gave the AI assistant information about my project structure, existing functions, assignment requirements and limitations. I explained the AC1–AC6 and F1–F5 criteria and asked for a plan to improve my project without rewriting everything.

Some AI suggestions were useful. For example, it helped me organize the work into smaller steps and separate the room data, booking logic and filtering logic into different files. However, not all suggestions were correct. The assistant missed an AC1 problem in my check() function and suggested some unnecessary tests. It also suggested changing the canBook() logic. I compared this suggestion with my original requirements and decided to keep my original function unchanged.

I personally checked the code and tested the application in the browser. I checked what happens when I change the selected room, use different filters and select a blocked room. I also used npx tsc --noEmit to find TypeScript errors. For example, it helped me find an incorrect import of the Interval type after moving it to rooms.ts.

Tests also influenced my decisions. I wrote tests before implementing checkRoom(). At first, they failed because the function was not ready. After implementing it, I ran the tests again. The original 21 tests also helped me make sure that the old canBook() behavior was not broken during refactoring.

In the future, I would like to improve the UI testing. I could use React Testing Library to test the empty state and room switching automatically instead of checking everything manually in the browser.

Overall, I learned that AI can help with planning and coding, but I should always check its suggestions and understand my own code.