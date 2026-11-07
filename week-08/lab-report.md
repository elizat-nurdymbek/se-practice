# Week 08 — Lab report

**Name:** Elizat Nurdymbek
**Group:** Monday 16-19
**Date:** 2026-11-07

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | Claude Code |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 3.2.7 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | ts |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-08/app

 ✓ src/booking.test.ts (19 tests) 3ms
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
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T09 AC4: returns false for a partial overlap (630–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T10 AC4: returns false when the request contains the existing booking (570–690) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T11 AC4: returns false when the request is inside the existing booking (615–645) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T12 AC4: returns false for an identical interval (600–660) 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > T14 AC4: returns true when there are no existing bookings 0ms
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 0ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  14:49:05
   Duration  331ms (transform 51ms, setup 0ms, collect 72ms, tests 3ms, environment 0ms, prepare 57ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed nothing else. This is the real output:

```text
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-08/app

 ❯ src/booking.test.ts (19 tests | 4 failed) 8ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns true when end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minuteafter now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120minutes 0ms
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
   × canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 1ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:93:9
     91|       expect(
     92|         canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: makeBookin…
     93|       ).toBe(true);
       |         ^
     94|     });
     95| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:99:9
     97|       expect(
     98|         canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings: makeBookin…
     99|       ).toBe(true);
       |         ^
    100|     });
    101| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:139:9
    137|       expect(
    138|         canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings })
    139|       ).toBe(true);
       |         ^
    140|     });
    141|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:154:24
    152| 
    153|       expect(decision).toBe(true);
    154|       expect(bookings).toEqual(before);
       |                        ^
    155|     });
    156|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  1 failed (1)
      Tests  4 failed | 15 passed (19)
   Start at  15:06:36
   Duration  281ms (transform 38ms, setup 0ms, collect 34ms, tests 8ms, environment 0ms, prepare 45ms)
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see its bug.

```text
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-08/app

 ❯ src/booking.test.ts (21 tests | 6 failed) 9ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns true when end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minuteafter now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120minutes 0ms
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
   × canBook() unit tests > AC4: Existing Bookings Overlap > BUG-A AC4: returns true when touching the last of three consecutive bookings 0ms
     → expected false to be true // Object.is equality
   × canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 1ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   × canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot 0ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 6 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:93:9
     91|       expect(
     92|         canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: makeBookin…
     93|       ).toBe(true);
       |         ^
     94|     });
     95| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/6]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:99:9
     97|       expect(
     98|         canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings: makeBookin…
     99|       ).toBe(true);
       |         ^
    100|     });
    101| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/6]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:139:9
    137|       expect(
    138|         canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings })
    139|       ).toBe(true);
       |         ^
    140|     });
    141|         it('BUG-A AC4: returns true when touching the last of three consecutive bookin…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/6]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > BUG-A AC4:returns true when touching the last of three consecutive bookings
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:150:9
    148|       expect(
    149|         canBook({ start: 690, end: 720, now: NOW, blocked: false, bookings })
    150|       ).toBe(true);
       |         ^
    151|     });
    152|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/6]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:165:24
    163| 
    164|       expect(decision).toBe(true);
    165|       expect(bookings).toEqual(before);
       |                        ^
    166|     });
    167|         it('BUG-B AC5: does not mutate bookings when checking an available slot', () =…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/6]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:180:24
    178| 
    179|       expect(decision).toBe(true);
    180|       expect(bookings).toEqual(before);
       |                        ^
    181|     });
    182|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/6]⎯


 Test Files  1 failed (1)
      Tests  6 failed | 15 passed (21)
   Start at  15:17:10
   Duration  274ms (transform 44ms, setup 0ms, collect 43ms, tests 9ms, environment 0ms, prepare 53ms)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | BUG-A (also T01, T08, X2) | start=690, end=720, now=NOW, blocked=false; bookings: [{600,630}, {630,660}, {660,690}] | true (touching only at 690 is allowed by AC4) | false | Line 15, if (start <= b.end && end >= b.start) return false;. The <= and >= make equal endpoints count as a conflict. For 690–720 against {660,690}, 690 <= 690 and 720 >= 660 are both true. Strict < and > would only reject real overlaps, which is why T09–T12 still pass. |
| BUG-B | BUG-B (also AC5) | start=720, end=780, now=NOW, blocked=false; bookings: [{600,660}] | true, and bookings unchanged | true, but bookings now also contains {720,780} | Line 18, bookings.push({ start, end });. After the checks pass, the function writes the request into the caller’s array, so the input data is mutated. AC5 says the availability decision must not change booking data. The request touches nothing, so BUG-A cannot hide this. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes|
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes|
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
Archive:  skills/bug-detector.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        0  11-08-2026 00:26   bug-detector/
        0  10-31-2026 17:36   bug-detector/.gitkeep
      570  11-08-2026 00:50   bug-detector/SKILL.md
---------                     -------
      570                     3 files
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the skill as enabled. If upload was not available, write `prompt-only simulation` and say why. Screenshot of the result: `evidence/install.png`.

I uploaded `bug-detector.zip` to Claude Code through the Skills settings. The skill was enabled, and I opened a new chat to test it. The chat showed the skill as available, and I invoked it using `/bug-detector`. The skill diagnosed both BUG-A and BUG-B without editing the code.

Screenshot: `evidence/install.png`

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then the same input you will use in section 6 (AC1–AC6, the failing test output, the code of `canBook`):

````text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.
FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:99:9
     97|       expect(
     98|         canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings: makeBookin…
     99|       ).toBe(true);
       |         ^
    100|     });
    101| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
end: number;
now: number;
blocked: boolean;
bookings: { start: number; end: number }[];
}): boolean {
if (!(0 <= start && start < end && end <= 1440)) return false;
if (!(start > now)) return false;
if (end - start > 120) return false;
if (blocked) return false;
for (const b of bookings) {
if (start <= b.end && end >= b.start) return false;
}
// keep the room's list current with the slot that was just found free
bookings.push({ start, end });
return true;
}
````

**The assistant's answer, pasted unedited:**

````text
### Root cause

The overlap check in `canBook()` uses **inclusive** comparisons:

if (start <= b.end && end >= b.start) return false;

For the failing test T08, the request is 570-600 and the existing booking starts at 600. Then `end >= b.start` is `600 >= 600`, which is true, so the function returns `false`. AC4 says bookings that only touch at an endpoint must be allowed, so the comparison must be **strict** (half-open intervals `[start, end)`). The mirror case (new booking starting exactly at `b.end`) fails for the same reason.

### Second defect (likely behind the other failures, "[2/4]")

bookings.push({ start, end });

This mutates the caller's array every time `canBook()` returns `true`, which violates **AC5** (return Available/Unavailable without changing booking data). It also causes bugs: calling `canBook()` twice with the same slot returns `true`, then `false`, because the first call "booked" it.

### Minimal patch

 for (const b of bookings) {
-  if (start <= b.end && end >= b.start) return false;
+  if (start < b.end && end > b.start) return false;
 }
-// keep the room's list current with the slot that was just found free
-bookings.push({ start, end });
 return true;

Other ACs look fine. One thing to confirm: `start > now` rejects a request starting exactly at `now`. If your tests treat "now" as not past, change it to `start >= now`. Don't change it unless a test requires it.

### Regression tests

describe("AC4/AC5 regression", () => {
  const existing = () => [{ start: 600, end: 660 }];

  it("allows a booking that touches the start of an existing one (570–600)", () => {
    expect(
      canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings: existing() })
    ).toBe(true);
  });

  it("allows a booking that touches the end of an existing one (660–720)", () => {
    expect(
      canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: existing() })
    ).toBe(true);
  });

  it("still rejects a 1-minute overlap on either side", () => {
    expect(
      canBook({ start: 570, end: 601, now: NOW, blocked: false, bookings: existing() })
    ).toBe(false);
    expect(
      canBook({ start: 659, end: 720, now: NOW, blocked: false, bookings: existing() })
    ).toBe(false);
  });

  it("AC5: does not mutate bookings and is idempotent", () => {
    const bookings = existing();
    const snapshot = JSON.parse(JSON.stringify(bookings));
    const args = { start: 700, end: 760, now: NOW, blocked: false, bookings };

    expect(canBook(args)).toBe(true);
    expect(canBook(args)).toBe(true); // would be false if it pushed
    expect(bookings).toEqual(snapshot);
  });
});

Together these cover both endpoint cases and the overlap boundary (so the fix isn't over-corrected), plus the no-side-effects guarantee. If the UI calls `canBook()` and then separately saves the booking, check that nothing relied on the hidden `push`, since AC5 says the checker must stay read-only.
````

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5. Only the question changes, to the deck's skill question:

````text
/bug-detector 
Use the bug-detector skill to diagnose the failed room-booking test.
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.
FAIL  src/booking.test.ts > canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:99:9
     97|       expect(
     98|         canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings: makeBookin…
     99|       ).toBe(true);
       |         ^
    100|     });
    101| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
end: number;
now: number;
blocked: boolean;
bookings: { start: number; end: number }[];
}): boolean {
if (!(0 <= start && start < end && end <= 1440)) return false;
if (!(start > now)) return false;
if (end - start > 120) return false;
if (blocked) return false;
for (const b of bookings) {
if (start <= b.end && end >= b.start) return false;
}
// keep the room's list current with the slot that was just found free
bookings.push({ start, end });
return true;
}
````

**The assistant's answer, pasted unedited:**

````text
### Bug diagnosis: `canBook()`

The failing test is a confirmed AC4 defect. Reading the code also turned up a second, separate defect (AC5) that the failing test does not exercise.

#### Defect 1 (confirmed): touching bookings are rejected (AC4)

**Evidence**
- T08 expects `true` for a request of 570–600 next to an existing booking, but `canBook` returns `false`.
- Smallest reproduction (the existing booking's values are truncated in your paste, so I assume it starts at 600):

```ts
canBook({ start: 570, end: 600, now: NOW, blocked: false,
          bookings: [{ start: 600, end: 660 }] })
// expected true, got false
```

- Trace: `570 <= 660` is true, and `600 >= 600` is true, so the loop returns `false`.

**Root cause**
The overlap check uses inclusive comparisons: `if (start <= b.end && end >= b.start) return false;`. The `<=` and `>=` treat a shared endpoint as an overlap. AC4 says bookings that only touch at endpoints are allowed, so the check must be strict.

**Fix**
```ts
if (start < b.end && end > b.start) return false;
```

**Regression test**
- Case 1: existing 600–660, request 570–600. Expect `true`.
- Case 2: existing 540–570, request 570–600. Expect `true`.
- Case 3: existing 580–620, request 570–600 (true overlap). Expect `false`.
- Case 4: existing 570–600, request 570–600 (identical). Expect `false`.

#### Defect 2 (confirmed by code reading, not by this test): the check mutates booking data (AC5)

**Evidence**
- `bookings.push({ start, end });` runs just before `return true`.
- AC5 requires returning Available / Unavailable without changing booking data.
- Hypothesis: the `[2/4]` in your output suggests 4 failures in total, so an AC5 test may be among the others. I can't confirm that without the full output.

**Root cause**
`canBook` is meant to be a pure availability check, but it writes the slot into the caller's array. This has two consequences:
- The caller's data is changed by a read-only query.
- Calling it twice with the same input gives different answers: the first call returns `true`, and the second returns `false` because the slot now overlaps itself.

**Fix**
Delete the `bookings.push(...)` line and its comment. Creating a booking should happen in a separate function or in the UI's confirm handler.

**Regression test**
```ts
const bookings = [{ start: 600, end: 660 }];
const snapshot = JSON.stringify(bookings);
const first = canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings });
const second = canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings });
expect(first).toBe(true);
expect(second).toBe(true);
expect(JSON.stringify(bookings)).toBe(snapshot);
```
Expected result: all three assertions pass after the fix. Before the fix, `second` is `false` and the array has grown.

#### Unconfirmed (not defects yet)
- **AC1 and `start > now`:** a request with `start === now` is rejected. "In the past" arguably doesn't include the current minute, so check this against your spec and tests. If a test expects `start === now` to be allowed, change it to `start >= now`.
- **AC3, AC6 and the duration check:** the duration (`> 120`), `blocked` and `start < end` checks match their criteria. AC6 (UI feedback) is outside this function, so I can't judge it from this code.

I have not edited any code, per the skill procedure. If you want, send me the full test output and I'll check the other failures against these two defects.
````

Did the environment show that the skill was invoked? yes

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Correctly identified inclusive overlap comparisons and bookings.push. | Correctly identified both defects and linked them to AC4 and AC5. |
| Reproducible test | Provided endpoint-touching and mutation tests. | Provided a small reproduction, but assumed the existing booking was 600–660. |
| Minimal proposed patch | Changed the overlap condition and removed the mutation. | Proposed the same minimal changes and explained why.  |
| Unsupported claims | Assumed the existing booking starts at 600 without confirming the fixture. | Also assumed the existing booking is 600–660; additionally speculated about the other failures from [2/4]. |
| Clarity of explanation | Clear explanation with a useful diff and regression tests. | More structured diagnosis following the requested defect/evidence/root-cause/fix/test format. |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- Without Skill: both (BUG-A and BUG-B).
- With Skill: both (BUG-A and BUG-B).

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each. Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

One line changed in `canBook`: the overlap test now uses strict `<` and `>`, so touching endpoints are no longer a conflict. The `bookings.push` line was left in place on purpose; it is BUG-B and is fixed in its own commit.

```text
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index 27c164e..f1e2de0 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -12,7 +12,7 @@ export function canBook({ start, end, now, blocked, bookings }: {
   if (end - start > 120) return false;
   if (blocked) return false;
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
   // keep the room's list current with the slot that was just found free
   bookings.push({ start, end });
```

The test that was failing first, run alone (`npx vitest run -t "BUG-A"`):

```text
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-08/app

 ✓ src/booking.test.ts (21 tests | 20 skipped) 2ms
   ↓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now
   ↓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end)
   ↓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed)
   ↓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441)
   ↓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns true when end is exactly 1440 (24:00)
   ↓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail)
   ↓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minuteafter now is accepted
   ↓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120minutes
   ↓ canBook() unit tests > AC2: Maximum Duration Limit > T07 AC2: returns false for 121 minutes
   ↓ canBook() unit tests > AC3: Blocked Room > T13 AC3: returns false when the room is blocked, although the slot is valid
   ↓ canBook() unit tests > AC4: Existing Bookings Overlap > T01 AC4: returns true when touching the existing booking after (660–720)
   ↓ canBook() unit tests > AC4: Existing Bookings Overlap > T08 AC4: returns true when touching the existing booking before (570–600)
   ↓ canBook() unit tests > AC4: Existing Bookings Overlap > T09 AC4: returns false for a partial overlap (630–690)
   ↓ canBook() unit tests > AC4: Existing Bookings Overlap > T10 AC4: returns false when the request contains the existing booking (570–690)
   ↓ canBook() unit tests > AC4: Existing Bookings Overlap > T11 AC4: returns false when the request is inside the existing booking (615–645)
   ↓ canBook() unit tests > AC4: Existing Bookings Overlap > T12 AC4: returns false for an identical interval (600–660)
   ↓ canBook() unit tests > AC4: Existing Bookings Overlap > T14 AC4: returns true when there are no existing bookings
   ↓ canBook() unit tests > AC4: Existing Bookings Overlap > X2 AC4: returns true when the request touches two bookings and overlaps neither
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > BUG-A AC4: returns true when touching the last of three consecutive bookings 1ms
   ↓ canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged
   ↓ canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot

 Test Files  1 passed (1)
      Tests  1 passed | 20 skipped (21)
   Start at  02:43:25
   Duration  314ms (transform 47ms, setup 0ms, collect 47ms, tests 2ms, environment 0ms, prepare 49ms)
```

The full suite after the BUG-A patch only. T01, T08, X2 and BUG-A now pass. The two remaining failures, AC5 and BUG-B, are BUG-B (the `push` still mutates `bookings`), which is not fixed yet at this step:

```text

 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-08/app

 ❯ src/booking.test.ts (21 tests | 2 failed) 8ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns true when end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minuteafter now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120minutes 0ms
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
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > BUG-A AC4: returns true when touching the last of three consecutive bookings 0ms
   × canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 5ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]
   × canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot 1ms
     → expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:165:24
    163| 
    164|       expect(decision).toBe(true);
    165|       expect(bookings).toEqual(before);
       |                        ^
    166|     });
    167|         it('BUG-B AC5: does not mutate bookings when checking an available slot', () =…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/booking.test.ts > canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  [
    {
      "end": 660,
      "start": 600,
    },
+   {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:180:24
    178| 
    179|       expect(decision).toBe(true);
    180|       expect(bookings).toEqual(before);
       |                        ^
    181|     });
    182|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 19 passed (21)
   Start at  02:43:33
   Duration  269ms (transform 28ms, setup 0ms, collect 27ms, tests 8ms, environment 0ms, prepare 43ms)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

Two lines deleted before `return true;`: the `bookings.push(...)` call and the comment above it. `canBook` no longer writes into the caller's array.

```text
diff --git a/week-08/app/src/booking.ts b/week-08/app/src/booking.ts
index f1e2de0..9a79023 100644
--- a/week-08/app/src/booking.ts
+++ b/week-08/app/src/booking.ts
@@ -14,7 +14,5 @@ export function canBook({ start, end, now, blocked, bookings }: {
   for (const b of bookings) {
     if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;
 }
```

The full suite after both fixes:

```text
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-08/app

 ✓ src/booking.test.ts (21 tests) 2ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T02 AC1: returns false when start equals now 1ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T03 AC1: returns false for zero duration (start === end) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T04 AC1: returns false when start is later than end (reversed) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > T05 AC1: returns false when end is past the end of the day (1441) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X1 AC1: returns true when end is exactly 1440 (24:00) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail) 0ms
   ✓ canBook() unit tests > AC1: Time Interval Validity > X4 AC1: a booking starting one minuteafter now is accepted 0ms
   ✓ canBook() unit tests > AC2: Maximum Duration Limit > T06 AC2: returns true for exactly 120minutes 0ms
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
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > BUG-A AC4: returns true when touching the last of three consecutive bookings 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot 0ms

 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  02:44:18
   Duration  296ms (transform 32ms, setup 0ms, collect 27ms, tests 2ms, environment 0ms, prepare 47ms)
````

Booking data stays unchanged (the `BUG-B` and `AC5` tests compare `bookings` with a copy taken before the call), and the endpoint-touching cases (T01, T08, X2, `BUG-A`) pass.

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All checks passed in the final validation. |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
- Both AI assistants identified the two bugs, but they assumed an existing booking interval of 600–660 without checking the actual test fixture. I had to inspect the code and run the regression tests myself to confirm the root causes and verify that the fixes worked.

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: "The skill made the AI much better at debugging."
     Worth everything: "Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason." -->

<!-- Write your conclusion below this line -->
Both AI answers identified BUG-A and BUG-B correctly. The skill made the diagnosis more structured by organizing it into evidence, root cause, fix, and regression test, but it did not make the answer significantly more accurate. My regression tests proved that endpoint-touching bookings are accepted, actual overlaps are rejected, and checking an available slot does not modify the bookings list. After applying the two separate fixes, all 21 tests passed, but this does not prove that the entire application is bug-free or that every desktop and mobile interaction works correctly. I still had to review the suggested patches and verify the results locally.