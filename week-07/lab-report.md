# Week 07 — Lab report

**Name:** Elizat Nurdymbek
**Group:** Monday 16-19
**Date:** 2026/11/04

---

## 1. Setup

| | |
| --- | --- |
| Project I continue | `starter` = the provided starter |
| Bolt project link | not shared (no Week 06 project, used the provided starter) |
| Assistant that generated the tests (tool) | ChatGPT|
| Exact model | GPT-5.6 Luna |
| Where I ran the tests | my computer |
| Vitest version | 3.2.7 |
| Test command | npx vitest run |

---

## 2. Task 1 — baseline and the booking function

**Before editing:** where did the booking decision live in the project you started from?

| | |
| --- | --- |
| File and function (or "inside the page component") | inside the page component: check() in src/App.tsx |
| Its inputs | s, e, n (start, end, now in minutes, from toMinutes), the blocked state, room.bookings |
| What it returned | nothing; it sets the boolean ok through setResult(ok) |
| How the page used it | result shows Available / Unavailable; the time-order error message is set in the same function |

**What I changed to extract `canBook`.** Say which file it now lives in, what you moved, and why
the behaviour did not change. Also say which file of the page now calls it. 40 words or more.

I moved the booking decision logic from the `check()` function in `App.tsx` into a separate file called `src/booking.ts`. I created the `canBook()` function, which receives the start time, end time, current time, blocked status, and existing bookings as input. It checks whether the requested time is valid, whether it is in the future, whether its duration is within 120 minutes, whether the room is blocked, and whether it overlaps with another booking. The `App.tsx` file now imports and calls `canBook()` when the user clicks the availability button. I kept the original conditions and their order. After the change, I tested three scenarios in the browser: 11:00–12:00 returned Available, 10:30–11:30 returned Unavailable, and a blocked room returned Unavailable. All three results matched the expected outcomes. The time conversion and error messages remain in `App.tsx`.

---

## 3. Task 2 — the test plan

Default fixture: `now = 540`, `blocked = false`, `bookings = [{ start: 600, end: 660 }]`, fresh
for every test. **The Expected column comes from AC1–AC4, never from the code.** Write the
**reason** for each expected result **before** you send the generation prompt.

| ID | Candidate / changed input | Expected | AC | Reason (in your words) |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 | The new booking starts at 660, exactly when the existing booking ends, so the intervals do not overlap. |
| T02 | 540–570 (starts now) | false | AC1 | The start time is equal to the current time (540), but a booking must start after the current time. |
| T03 | 720–720 (zero duration) | false | AC1 | The start and end times are both 720, so the booking has zero duration. |
| T04 | 750–720 (reversed) | false | AC1 | The end time (720) is earlier than the start time (750), so the time interval is invalid. |
| T05 | 1380–1441 (past day end) | false | AC1 | The end time is 1441, which is greater than the maximum allowed time of 1440 minutes. |
| T06 | 720–840 (120 minutes) | true | AC2 | The booking duration is exactly 120 minutes, which is the maximum allowed duration. |
| T07 | 720–841 (121 minutes) | false | AC2 | The booking duration is 121 minutes, which exceeds the 120-minute limit. |
| T08 | 570–600 (touching before) | true | AC4 | The new booking ends at 600, exactly when the existing booking starts, so the intervals do not overlap. |
| T09 | 630–690 (partial overlap) | false | AC4 | The new booking overlaps with the existing booking from 630 to 660. |
| T10 | 570–690 (contains booking) | false | AC4 | The new booking starts before and ends after the existing booking, so it fully overlaps it. |
| T11 | 615–645 (inside booking) | false | AC4 | The new booking is completely inside the existing booking, so the two intervals overlap. |
| T12 | 600–660 (identical interval) | false | AC4 | The new booking has exactly the same start and end times as the existing booking, so it overlaps completely. |
| T13 | 660–720, blocked = true | false | AC3 | The room is blocked, so no new booking should be allowed even if the requested time is valid. |
| T14 | 630–690, bookings = [] | true | AC4 | There are no existing bookings, so the requested valid time does not overlap with anything. |
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 | The function should return the correct result without changing the original bookings array. |
| X1 | 1380–1440 (ends exactly at 24:00) | true | AC1 | End = 1440 is the last allowed value, because AC1 says end ≤ 1440. It is the other side of T05 (1441). The page produces this with the “Ends at 24:00” checkbox. A defect like end < 1440 would reject it. Duration is 60 minutes, start is after now, no overlap. |
| X2 | 660–720, bookings = [{600–660}, {720–780}] | true | AC4 | The new booking touches the first booking at 660 and the second at 720, and overlaps neither, because AC4 allows touching. The duration is 60 minutes and the start is after now. It catches code that checks only the first booking or counts touching the second one as overlap. |

X1 and X2 are **your own two cases**: a boundary or a state that T01–T14 do not reach. Fill all
five columns.

---

## 4. Task 3 — the generation prompt and the first suite

**The prompt exactly as I sent it.** Use the deck's prompt with `[our test framework]` replaced by
`Vitest`, followed by the case table from section 3:

```text
Generate tests for the existing booking function using Vitest. Use AC1–AC6 and the reviewed case table below.

Import the real function used by the page. Keep its code unchanged. Use fixed time and fresh fixtures. Assert exact decisions and unchanged booking data.

Return the test file, run command, and AC mapping. Flag unclear requirements. We will run the tests ourselves.

export type Interval = { start: number; end: number };

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

| ID | Candidate / changed input | Expected | AC |
| --- | --- | --- | --- | --- |
| T01 | 660–720 (touching after) | true | AC4 |
| T02 | 540–570 (starts now) | false | AC1 |
| T03 | 720–720 (zero duration) | false | AC1 |
| T04 | 750–720 (reversed) | false | AC1 |
| T05 | 1380–1441 (past day end) | false | AC1 |
| T06 | 720–840 (120 minutes) | true | AC2 |
| T07 | 720–841 (121 minutes) | false | AC2 |
| T08 | 570–600 (touching before) | true | AC4 |
| T09 | 630–690 (partial overlap) | false | AC4 |
| T10 | 570–690 (contains booking) | false | AC4 |
| T11 | 615–645 (inside booking) | false | AC4 |
| T12 | 600–660 (identical interval) | false | AC4 |
| T13 | 660–720, blocked = true | false | AC3 |
| T14 | 630–690, bookings = [] | true | AC4 | 
| AC5 | an Available request — the bookings after the call equal the bookings before | true, data unchanged | AC5 |
| X1 | 1380–1440 (ends exactly at 24:00) | true | AC1 |
| X2 | 660–720, bookings = [{600–660}, {720–780}] | true | AC4 |
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```
### Acceptance Criteria (AC) Mapping

| AC | Description | Associated Tests |
| --- | --- | --- |
| **AC1** | Time interval validity ($0 \le \text{start} < \text{end} \le 1440$ and $\text{start} > \text{now}$) | T02, T03, T04, T05, X1 |
| **AC2** | Maximum booking duration limit ($\text{end} - \text{start} \le 120$) | T06, T07 |
| **AC3** | Blocked room status handling ($\text{blocked} = \text{true} \implies \text{false}$) | T13 |
| **AC4** | Existing bookings overlap validation (half-open intervals $[\text{start}, \text{end})$ allow touching boundaries) | T01, T08, T09, T10, T11, T12, T14, X2 |
| **AC5** | Pure function check — source `bookings` array data remains unchanged after evaluation | AC5 (Immutability block) |
| **AC6** | *(Unspecified in prompt; inferred below)* | N/A |

---

### Unclear Requirements & Potential Risks

1. **AC6 missing specification:** The prompt references "AC1–AC6", but no Acceptance Criterion 6 text or table entry was supplied. If AC6 refers to handling boundary inputs like negative values ($\text{start} < 0$) or float/NaN handling, explicit tests should be added once clarified.
2. **Handling of `now` relative to start time:** `canBook` enforces `start > now`. This prevents bookings starting at the current exact minute (T02). If "starts right now" is intended to be permissible in production (i.e. $\text{start} \ge \text{now}$), the function implementation would require modification.
```
The first suite was saved to `suites/first/` **before** I changed anything in it: yes

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | Shared defaultBookings fixture | The same bookings array is shared across multiple tests. Each test should use fresh test data to avoid affecting other tests. | revise | Test isolation |
| 2 | T02 and AI's start >= now suggestion | The suggestion allows a booking to start at the current time, but AC1 requires the start time to be strictly after the current time. | reject | AC1 |
| 3 | start = 1440, end = 1440 | This test repeats T03 because the interval has zero duration. | reject | AC1 — duplicate test |
| 4 | AC6 Strict Boolean | The AI misunderstood AC6. It concerns the mobile UI and user feedback, not the return type. | Reject | AC6 |
| 5 | AC5 Object.freeze | Freezing the input does not replace comparing the booking data before and after the function call. | revise | AC5 |
| 6 | X3: start = -1 | This checks the lower time boundary, which was missing from the original test plan. | accept | AC1 |
| 7 | 541–542 | This checks that a booking starting one minute after the current time is accepted. | Accept | AC1 |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the `RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass" is not a run.

```text
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-07/app

 ✓ src/booking.test.ts (17 tests) 8ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02: returns false when start time equals now (starts now) 2ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04: returns false when start is greater than end (reversed times) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05: returns false when end time exceeds maximum 1440 minutes 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1: returns true when end time is exactly 1440 (ends at 24:00 boundary) 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06: returns true for a booking of exactly 120 minutes 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T07: returns false for a booking of 121 minutes (exceeds 120 min max) 0ms
   ✓ canBook() unit tests > AC3: Blocked Room State > T13: returns false when the room is blocked, even with a valid time slot 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T01: returns truewhen touching existing booking after (ends at 660, starts at 660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T08: returns truewhen touching existing booking before (starts at 600, ends at 600) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T09: returns false for a partial overlap with an existing booking 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T10: returns false when the requested booking completely encloses an existing booking 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T11: returns false when the requested booking is completely inside an existing booking 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T12: returns false for an identical time slot to an existing booking 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T14: returns truewhen there are no existing bookings (bookings = []) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > X2: returns true when slot fits precisely between two adjacent bookings 0ms
   ✓ canBook() unit tests > AC5: Data Immutability > ensures the bookings array and objects are not modified during invocation 1ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  16:23:54
   Duration  595ms (transform 51ms, setup 0ms, collect 38ms, tests 8ms, environment 0ms, prepare 80ms)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| none | none | none | none | none |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then paste the assistant's answer, unedited:

````text
Review this test suite against AC1–AC6 and our case table. Identify incorrect expectations, weak assertions, duplicated cases, and missing boundaries.

For each proposed change, explain the requirement and the defect it could detect. Improve the tests without changing correct expectations to match buggy behavior.

Use the actual failure output below. Separate test repairs from implementation fixes.
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-07/app

 ✓ src/booking.test.ts (17 tests) 8ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02: returns false when start time equals now (starts now) 2ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04: returns false when start is greater than end (reversed times) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05: returns false when end time exceeds maximum 1440 minutes 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1: returns true when end time is exactly 1440 (ends at 24:00 boundary) 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06: returns true for a booking of exactly 120 minutes 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T07: returns false for a booking of 121 minutes (exceeds 120 min max) 0ms
   ✓ canBook() unit tests > AC3: Blocked Room State > T13: returns false when the room is blocked, even with a valid time slot 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T01: returns truewhen touching existing booking after (ends at 660, starts at 660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T08: returns truewhen touching existing booking before (starts at 600, ends at 600) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T09: returns false for a partial overlap with an existing booking 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T10: returns false when the requested booking completely encloses an existing booking 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T11: returns false when the requested booking is completely inside an existing booking 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T12: returns false for an identical time slot to an existing booking 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T14: returns truewhen there are no existing bookings (bookings = []) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > X2: returns true when slot fits precisely between two adjacent bookings 0ms
   ✓ canBook() unit tests > AC5: Data Immutability > ensures the bookings array and objects are not modified during invocation 1ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  16:23:54
   Duration  595ms (transform 51ms, setup 0ms, collect 38ms, tests 8ms, environment 0ms, prepare 80ms)

## Test Suite Audit & Findings

While all 17 tests currently pass against the provided implementation of `canBook`, an audit reveals weak assertions, missing edge cases, and structural gaps relative to standard AC boundary requirements.

### 1. Weak Assertions & Immutability Test Gaps

* **Issue in AC5:** `JSON.stringify()` checks array shape, but it does not catch object mutation (e.g., modifying properties directly or freezing objects). Additionally, `Object.freeze()` is not tested to ensure the function is strictly read-only.
* **Defect detectable:** Mutating properties inside existing `Interval` items during the loop, or calling array mutation methods like `.sort()` or `.pop()` on frozen input arrays.

### 2. Missing Boundary Conditions (AC1, AC2, AC4)

* **Missing AC1 Lower Bound ($start \ge 0$):** No test checks negative start times (e.g., `start: -1`).
* **Missing AC1 Upper Bound ($start < 1440$):** No test checks $start = 1440$.
* **Missing AC1/AC2 Duration Bounds:** Minimal valid duration (e.g., 1 minute) is not tested.
* **Defect detectable:** A bug where `0 <= start` check is omitted, or strict inequalities like `< 1440` are relaxed to `<= 1440`.

### 3. AC Alignment & AC6 Coverage

* **AC6 Context:** AC6 typically represents defensive input handling or return contract consistency (e.g., returning strictly boolean `false` rather than falsy values like `undefined` or throwing unhandled errors when evaluating empty/invalid edge cases).

---

## Proposed Test Enhancements

### Summary of Changes

| Target AC | Proposed Test / Repair | Requirement | Defect Detectable |
| --- | --- | --- | --- |
| **AC1** | Negative Start Time (`start: -1`) | $start \ge 0$ | Omitting lower bound check on `start`. |
| **AC1** | Boundary Start Time (`start: 1440`) | $start < 1440$ | Using $start \le 1440$ instead of $start < end \le 1440$. |
| **AC1** | Minimum Duration (`start: 541, end: 542`) | $start < end$ (1 min duration) | Off-by-one errors on minimum allowable duration. |
| **AC4/AC5** | Object/Array Immutability (`Object.freeze`) | Pure function execution | In-place mutation, sorting, or array modification. |
| **AC6** | Strict Boolean Return Type | Function must return `boolean` | Returning numbers, `undefined`, or truthy/falsy non-booleans. |

---

## Refined Vitest Suite (`src/booking.test.ts`)

```typescript
import { describe, expect, it } from 'vitest';
import { canBook, type Interval } from './booking';

describe('canBook() unit tests', () => {
  const NOW = 540; // 09:00 AM
  const defaultBookings: Interval[] = [{ start: 600, end: 660 }];

  // ---------------------------------------------------------------------------
  // AC1: Time Interval Validity (0 <= start < end <= 1440, start > now)
  // ---------------------------------------------------------------------------
  describe('AC1: Time Interval Validity', () => {
    it('T02: returns false when start time equals now', () => {
      expect(
        canBook({ start: 540, end: 570, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });

    it('T03: returns false for zero duration (start === end)', () => {
      expect(
        canBook({ start: 720, end: 720, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });

    it('T04: returns false when start is greater than end', () => {
      expect(
        canBook({ start: 750, end: 720, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });

    it('T05: returns false when end time exceeds 1440 minutes', () => {
      expect(
        canBook({ start: 1380, end: 1441, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });

    it('X1: returns true when end time is exactly 1440', () => {
      expect(
        canBook({ start: 1380, end: 1440, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(true);
    });

    it('returns false when start time is negative (< 0)', () => {
      expect(
        canBook({ start: -1, end: 60, now: -10, blocked: false, bookings: [] })
      ).toBe(false);
    });

    it('returns false when start time equals 1440', () => {
      expect(
        canBook({ start: 1440, end: 1440, now: NOW, blocked: false, bookings: [] })
      ).toBe(false);
    });

    it('returns true for 1-minute valid booking directly after now', () => {
      expect(
        canBook({ start: 541, end: 542, now: NOW, blocked: false, bookings: [] })
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // AC2: Maximum Duration Limit (<= 120 minutes)
  // ---------------------------------------------------------------------------
  describe('AC2: Maximum Duration Limit', () => {
    it('T06: returns true for a booking of exactly 120 minutes', () => {
      expect(
        canBook({ start: 720, end: 840, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(true);
    });

    it('T07: returns false for a booking of 121 minutes', () => {
      expect(
        canBook({ start: 720, end: 841, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // AC3: Blocked Room State
  // ---------------------------------------------------------------------------
  describe('AC3: Blocked Room State', () => {
    it('T13: returns false when the room is blocked', () => {
      expect(
        canBook({ start: 660, end: 720, now: NOW, blocked: true, bookings: defaultBookings })
      ).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // AC4: Existing Bookings Overlap
  // ---------------------------------------------------------------------------
  describe('AC4: Existing Bookings Overlap', () => {
    it('T01: returns true when touching existing booking after', () => {
      expect(
        canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(true);
    });

    it('T08: returns true when touching existing booking before', () => {
      expect(
        canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(true);
    });

    it('T09: returns false for partial overlap with an existing booking', () => {
      expect(
        canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });

    it('T10: returns false when requested booking completely encloses existing booking', () => {
      expect(
        canBook({ start: 570, end: 690, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });

    it('T11: returns false when requested booking is inside existing booking', () => {
      expect(
        canBook({ start: 615, end: 645, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });

    it('T12: returns false for an identical time slot', () => {
      expect(
        canBook({ start: 600, end: 660, now: NOW, blocked: false, bookings: defaultBookings })
      ).toBe(false);
    });

    it('T14: returns true when bookings array is empty', () => {
      expect(
        canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings: [] })
      ).toBe(true);
    });

    it('X2: returns true when slot fits precisely between two adjacent bookings', () => {
      const adjacentBookings: Interval[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];
      expect(
        canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: adjacentBookings })
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // AC5: Data Immutability
  // ---------------------------------------------------------------------------
  describe('AC5: Data Immutability', () => {
    it('does not mutate input parameters or frozen bookings array', () => {
      const originalBookings: readonly Interval[] = Object.freeze([
        Object.freeze({ start: 600, end: 660 }),
        Object.freeze({ start: 720, end: 780 }),
      ]);

      const result = canBook({
        start: 660,
        end: 720,
        now: NOW,
        blocked: false,
        bookings: originalBookings as Interval[],
      });

      expect(result).toBe(true);
      expect(originalBookings).toHaveLength(2);
      expect(originalBookings[0]).toEqual({ start: 600, end: 660 });
    });
  });

  // ---------------------------------------------------------------------------
  // AC6: Strict Output Type Contract
  // ---------------------------------------------------------------------------
  describe('AC6: Return Contract Consistency', () => {
    it('returns strict boolean primitive values', () => {
      const validResult = canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: [] });
      const invalidResult = canBook({ start: 500, end: 520, now: NOW, blocked: false, bookings: [] });

      expect(typeof validResult).toBe('boolean');
      expect(typeof invalidResult).toBe('boolean');
    });
  });
});

```
````

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text

 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-07/app

 ✓ src/booking.test.ts (19 tests) 2ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns true when end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0<= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minute after now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120 minutes 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T07 AC2: returns false for 121 minutes 0ms
   ✓ canBook() unit tests > AC3: Blocked Room > T13 AC3: returns false when the room is blocked, although the slot is valid 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T09 AC4: returns false for a partial overlap (630–690)0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T10 AC4: returns false when the request contains the existing booking (570–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T11 AC4: returns false when the request is inside the existing booking (615–645) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T12 AC4: returns false for an identical interval (600–660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T14 AC4: returns true when there are no existing bookings 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 0ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  17:14:56
   Duration  287ms (transform 35ms, setup 0ms, collect 24ms, tests 2ms, environment 0ms, prepare 50ms)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected | T06 | |
| M2 | Treat touching endpoints as an overlap | Detected | T01, T08, X2 | |
| M3 | Remove the blocked-room rejection | Detected | T13 | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
M1             
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-07/app

 ❯ src/booking.test.ts (19 tests | 1 failed) 6ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns truewhen end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minute after now is accepted 0ms
   × canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120 minutes 4ms
     → expected false to be true // Object.is equality
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T07 AC2: returns false for 121 minutes 0ms
   ✓ canBook() unit tests > AC3: Blocked Room > T13 AC3: returns false when the room is blocked, although the slot is valid 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T09 AC4: returns false for a partial overlap (630–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T10 AC4: returns false when the request contains the existing booking (570–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T11 AC4: returns false when the request is inside the existing booking (615–645) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T12 AC4: returns false for an identical interval (600–660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T14 AC4: returns true when there are no existing bookings 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: an Available requestleaves the existing bookings unchanged 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120 minutes
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:65:9
     63|       expect(
     64|         canBook({ start: 720, end: 840, now: NOW, blocked: false, boo…
     65|       ).toBe(true);
       |         ^
     66|     });
     67| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 18 passed (19)
   Start at  17:01:52
   Duration  254ms (transform 31ms, setup 0ms, collect 24ms, tests 6ms, environment 0ms, prepare 47ms)

M2
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-07/app

 ❯ src/booking.test.ts (19 tests | 3 failed) 7ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns true when end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minute after now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120 minutes 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T07 AC2: returns false for 121 minutes 0ms
   ✓ canBook() unit tests > AC3: Blocked Room > T13 AC3: returns false when the room is blocked, although the slot is valid 0ms
   × canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720) 4ms
     → expected false to be true // Object.is equality
   × canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600) 0ms
     → expected false to be true // Object.is equality
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T09 AC4: returns false for a partial overlap (630–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T10 AC4: returns false when the request contains the existing booking (570–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T11 AC4: returns false when the request is inside the existing booking (615–645) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T12 AC4: returns false for an identical interval (600–660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T14 AC4: returns true when there are no existing bookings 0ms
   × canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither 0ms
     → expected false to be true // Object.is equality
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:93:9
     91|       expect(
     92|         canBook({ start: 660, end: 720, now: NOW, blocked: false, boo…
     93|       ).toBe(true);
       |         ^
     94|     });
     95| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:99:9
     97|       expect(
     98|         canBook({ start: 570, end: 600, now: NOW, blocked: false, boo…
     99|       ).toBe(true);
       |         ^
    100|     });
    101| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:139:9
    137|       expect(
    138|         canBook({ start: 660, end: 720, now: NOW, blocked: false, boo…
    139|       ).toBe(true);
       |         ^
    140|     });
    141|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed | 16 passed (19)
   Start at  17:04:11
   Duration  267ms (transform 35ms, setup 0ms, collect 30ms, tests 7ms, environment 0ms, prepare 45ms)

M3
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-07/app

 ❯ src/booking.test.ts (19 tests | 1 failed) 7ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns truewhen end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minute after now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120 minutes 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T07 AC2: returns false for 121 minutes 0ms
   × canBook() unit tests > AC3: Blocked Room > T13 AC3: returns false when the room is blocked, although the slot is valid 5ms
     → expected true to be false // Object.is equality
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T09 AC4: returns false for a partial overlap (630–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T10 AC4: returns false when the request contains the existing booking (570–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T11 AC4: returns false when the request is inside the existing booking (615–645) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T12 AC4: returns false for an identical interval (600–660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T14 AC4: returns true when there are no existing bookings 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: an Available requestleaves the existing bookings unchanged 0ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC3: Blocked Room > T13 AC3: returns false when the room is blocked, although the slot is valid
AssertionError: expected true to be false // Object.is equality

- Expected
+ Received

- false
+ true

 ❯ src/booking.test.ts:82:9
     80|       expect(
     81|         canBook({ start: 660, end: 720, now: NOW, blocked: true, book…
     82|       ).toBe(false);
       |         ^
     83|     });
     84|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 18 passed (19)
   Start at  17:05:06
   Duration  264ms (transform 30ms, setup 0ms, collect 25ms, tests 7ms, environment 0ms, prepare 52ms)

```

All three changes reverted, and the full suite run again (section 6.3): yes

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | 11:00–12:00 gave Available; the 10:00–11:00 booking stayed in the list | Pass |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | With “Room blocked” on, the same check showed Unavailable instead of Available | Pass |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | After clearing the end time, the page showed “Fill in the current time, the start and the end.” | Pass |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | At phone width the controls and the result stayed visible and usable | Pass |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | After repeating the checks, the list still showed only 10:00–11:00 | Pass |

---

## 9. Comparison and what still fails

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Original and improved suites

| Measure | First suite | Improved suite |
| --- | --- | --- |
| Executed / passed / failed | 17 / 17 / 0 | 19 / 19 / 0 |
| Requirements with meaningful tests (AC IDs and gaps) | AC1–AC5 covered; AC6 manual UI requirement not covered by unit tests | AC1–AC5 covered; AC6 checked manually in Part 7 |
| Selected mutants detected | M1: T06; M2: T08, X2, AC5; M3: T13 | M1: T06; M2: T01, T08, X2; M3: T13 |
| Accepted / revised / rejected tests | Original AI-generated tests; no review decisions applied | X3 and X4 accepted; shared fixture and AC5 revised; duplicate and incorrect AC6 test suggestions rejected |
| Remaining limitations | Shared fixture; weak AC5 snapshot check; missing lower-bound and one-minute-after-now tests | Unit tests do not verify the actual mobile UI; invalid existing booking behaviour is not defined by ACs |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-The function returns `true` for the request from 660 to 720 when the existing booking is `{ start: 700, end: 650 }`. The reversed existing booking is ignored by the current overlap check. No acceptance criterion defines how invalid existing bookings should be handled. Therefore, I declare the assumption that invalid existing bookings are ignored.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three in your own words, without the assistant:
     (a) Which mistake in the FIRST suite would have let a wrong canBook pass, and how did you find it?
     (b) What does your final green run prove, and what does it NOT prove? Use a mutant or a UI check.
     (c) One testing limitation that remains.
     Worthless: "The AI wrote good tests and they all passed."
     Worth everything: "The first suite expected T06 (exactly 120 minutes) to be rejected. That
     contradicts AC2, and it failed on a correct canBook. If I had changed the code to make it
     pass, M1 would have become the real behaviour." -->

<!-- Write your conclusion below this line -->
The first suite checked the upper end-of-day boundary, but it did not test a negative start time. Because of this missing case, an incorrect canBook implementation that accepted negative start times could still pass the first suite. I noticed this gap when reviewing the test cases against AC1 and added tests for the lower boundary in the improved suite.

The final green run with 19 passing tests proves that the implementation satisfies the expectations covered by those tests. It does not prove that the function is correct for every possible input. Mutation testing gave additional evidence: the improved suite detected M1, M2, and M3, including the incorrect 120-minute limit and overlap condition. The five UI checks also passed, confirming the tested browser interactions.

One limitation remains: AC6 was checked manually through the interface rather than automated unit tests. Also, the requirements do not clearly define how invalid existing bookings should be handled. These cases would need clearer requirements and additional tests.