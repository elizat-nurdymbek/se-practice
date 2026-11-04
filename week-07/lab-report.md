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
| Vitest version (the `RUN  v…` line of a run) | RUN  v3.2.7 |
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

I moved the booking decision logic from the `check()` function in `App.tsx` into a separate file called `src/booking.ts`. I created the `canBook()` function, which receives the start time, end time, current time, blocked status, and existing bookings as input. It checks whether the requested time is valid, whether it is in the future, whether its duration is within 120 minutes, whether the room is blocked, and whether it overlaps with another booking. The `App.tsx` file now imports and calls `canBook()` when the user clicks the availability button. I kept the original conditions and their order. After the change, I tested three scenarios in the browser: 11:00–12:00 returned Available, 10:00–11:00 returned Unavailable, and a blocked room returned Unavailable. All three results matched the expected outcomes. The time conversion and error messages remain in `App.tsx`.

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
(paste here)
```

**The assistant's answer: run command, AC mapping and any unclear requirements it flagged,
pasted unedited.** Its test file goes to `suites/first/` and is not pasted here:

```text
(paste here)
```

The first suite was saved to `suites/first/` **before** I changed anything in it: yes / no

---

## 5. Task 4 — review of the first suite

Review it **before** you run it. Look at the imports, the expected values, isolation, duplicates
and skipped tests. Make one row per decision. At least **two** rows, and each one names the kind of
weakness (the deck's table: *no exception occurred* · *expected = current output* · *only valid
requests* · *mocked booking function*, or your own) and the AC that decides it.

| # | Test or part of the suite | What is weak or wrong | Decision: accept / revise / reject | AC or reason |
| --- | --- | --- | --- | --- |
| 1 | | | accept / revise / reject | |
| 2 | | | accept / revise / reject | |

---

## 6. Task 5 — running, diagnosing, improving

### 6.1 The first run

The **real** terminal output of the first run of the first suite, pasted unedited. Include the
`RUN  v…` line and the `Tests` summary line. A build message or the assistant saying "tests pass"
is not a run.

```text
(paste here)
```

**Each failure, diagnosed** (the deck's table: import/runner error · assertion mismatch · result
changing per run · no tests discovered). Write `none` in the first row if nothing failed.

| Failing test | Observed failure | First check | Test repair or implementation fix? | Action taken |
| --- | --- | --- | --- | --- |
| | | | | |

### 6.2 The improvement prompt

The deck's improvement prompt exactly as sent, followed by the actual output from 6.1. Then
paste the assistant's answer, unedited:

```text
(paste here)
```

### 6.3 The final run

The **real** output of the final suite (`booking.test.*` beside your module), after every
change and after restoring the correct code from section 7. Every test must pass. If a real defect
is still open, leave its test failing and explain it in 9.1.

```text
(paste here)
```

---

## 7. Task 6 — deliberate defects

You need a reviewed, passing suite first. Then introduce **one** defect at a time in your booking
module, leave the tests unchanged, run, record, and **restore** the code. A syntax or import
error does not count as detection.

| Trial | Intentional change | Detected / Survived | Failing test ID(s) | If it survived: why, and what you added |
| --- | --- | --- | --- | --- |
| M1 | Reject duration >= 120 instead of > 120 | Detected / Survived | | |
| M2 | Treat touching endpoints as an overlap | Detected / Survived | | |
| M3 | Remove the blocked-room rejection | Detected / Survived | | |

**The run of each mutant, pasted unedited.** Paste the `Tests` summary line and the failing test
names at least:

```text
(paste here)
```

All three changes reverted, and the full suite run again (section 6.3): yes / no

---

## 8. Task 7 — manual UI checks

Use `now = 09:00` and an existing `10:00–11:00` booking. Do them in the page in a browser. Save a
screenshot of each as `evidence/ui-1.png` … `evidence/ui-5.png`. Take **ui-4 at phone width**
(about 375 px, portrait).

| # | Action | Expected observation | AC | What I observed | Pass / Fail / Not testable |
| --- | --- | --- | --- | --- | --- |
| U1 | Check 11:00–12:00, unblocked | Available, with the fixed sample booking | AC5 | | Pass / Fail / Not testable |
| U2 | Enable blocked, then check again | Unavailable replaces the earlier result | AC3, AC5 | | Pass / Fail / Not testable |
| U3 | Clear a required input and submit | Understandable validation feedback | AC6 | | Pass / Fail / Not testable |
| U4 | Use a narrow (phone) width | Controls and result remain usable | AC6 | | Pass / Fail / Not testable |
| U5 | Repeat the checks on the same data | Existing bookings remain unchanged | AC5 | | Pass / Fail / Not testable |

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
| Executed / passed / failed | | |
| Requirements with meaningful tests (AC IDs and gaps) | | |
| Selected mutants detected | | |
| Accepted / revised / rejected tests | | |
| Remaining limitations | | |

### 9.3 What no AC decides

Call your function with `bookings = [{ start: 700, end: 650 }]` (a reversed existing booking)
and a request of 660–720. What does it return? Does any AC say what it should return? (This is
the value you declare in `submission.yml` under `assumptions.invalid_existing_booking`.)

-

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
