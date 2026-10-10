# Week 05 — Lab report

**Name:** Nurdymbek Elizat
**Group:** Monday 16:00 - 19:00
**Date:** 2026.10.11

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT |
| **Exact** model name | GPT-5.6 Luna |
| Language and version | Python 3.13.1 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

My Week 04 model already said touching bookings are allowed, so AC4 does not change my diagrams.
<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
### Implementation Plan

1. **Input Validation & Order of Evaluation**
* Perform pure boolean evaluation returning `False` as soon as any condition fails (short-circuiting).
* Keep all inputs immutable and unchanged throughout execution.

2. **Sequential Check Pipeline**
* **Check 1: Time Constraints & Ordering (AC1)**
* Confirm `0 <= start`.
* Confirm `start < end`.
* Confirm `end <= 1440`.
* Confirm `start > now`.

* **Check 2: Duration Constraint (AC2)**
* Confirm `(end - start) <= 120`.

* **Check 3: Room Status (AC3)**
* Confirm `not blocked`.

* **Check 4: Overlap Detection with Existing Bookings (AC4)**
* Iterate through each tuple `(b_start, b_end)` in `existing`.
* Because half-open intervals $[start, end)$ and $[b\_start, b\_end)$ overlap if and only if $\max(start, b\_start) < \min(end, b\_end)$, verify that **no** booking satisfies `start < b_end and end > b_start`.

* **Check 5: Final Decision (AC5)**
* Return `True` if all preceding checks pass; return `False` otherwise.

---

### Identified Assumptions

* **Data Types:** `start`, `end`, and `now` are integers. `blocked` is a boolean. `existing` is an iterable (e.g., `list` or `set`) containing `(start, end)` integer tuples.
* **Interval Type:** Standard half-open interval $[start, end)$ behavior applies. Equal boundary points (e.g., `end == b_start` or `start == b_end`) are treated as non-overlapping touching endpoints.
* **Pre-validated Inputs:** Per the contract, `now` is strictly within `0..1439` and tuples in `existing` are already valid active bookings.

---

### Suggested Boundary Test Cases

| Case | Input Values | Expectation / Target Check | Reason |
| --- | --- | --- | --- |
| **Start equals now** | `start = 600`, `now = 600` | `False` (AC1) | Tests strict inequality `start > now`. |
| **Start barely after now** | `start = 601`, `now = 600` | Dependent on other ACs | Tests minimum valid offset from `now`. |
| **Max duration boundary** | `start = 100`, `end = 220` (120 min) | `True` (AC2) | Tests upper edge of 120-minute limit. |
| **Exceed max duration** | `start = 100`, `end = 221` (121 min) | `False` (AC2) | Tests off-by-one error on max duration. |
| **End boundary at midnight** | `end = 1440`, `start = 1320` | `True` (AC1) | Tests upper limit of time spectrum ($1440$). |
| **End exceeding midnight** | `end = 1441`, `start = 1320` | `False` (AC1) | Tests out-of-bounds `end` value. |
| **Touching existing (End-to-Start)** | New: `(100, 160)`, Existing: `[(160, 220)]` | `True` (AC4) | Tests that touching endpoints do not trigger overlap. |
| **Touching existing (Start-to-End)** | New: `(220, 280)`, Existing: `[(160, 220)]` | `True` (AC4) | Tests adjacent end-to-start touching boundary. |
| **1-minute overlap** | New: `(100, 161)`, Existing: `[(160, 220)]` | `False` (AC4) | Tests minimal interval overlap detection. |
| **Enclosed within existing** | New: `(120, 150)`, Existing: `[(100, 200)]` | `False` (AC4) | Tests strict containment detection. |
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the contract or in AC1–AC5, or that says something different from them. If you found none, write one row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | The heading says "Input Validation & Order of Evaluation". | The contract says inputs are already valid. No AC asks for input validation. | The plan has no validation steps under this heading, only the order of checks and "do not change inputs". I kept it as it is. |
| 2 | "existing is an iterable (e.g., list or set)". | The contract says only that existing contains (start, end) tuples. | Harmless, but I will treat existing as a list of tuples. |
| 3 | "now is strictly within 0..1439". | The contract says now is valid (0-1439), so both ends are included. | Wrong word, but no check depends on it. I ignored it. |
| 4 | Checks 1-5 (AC1 to AC5 in order, overlap as `start < b_end and end > b_start`). | AC1-AC5 and "intervals include the start and exclude the end". | I checked every step against its AC line. I found no invented rule (no buffer, no sorting, no extra limit). |

**Boundary cases the assistant suggested that I kept as tests:**

- start equals now (start = 600, now = 600) -> False (AC1). I use the base input: (540, 570).
- exactly 120 minutes allowed and 121 minutes rejected (AC2). I use (720, 840) and (720, 841).
- end exactly 1440 allowed (AC1). I use (1380, 1440).
- touching at both ends allowed (AC4): (660, 720) and (570, 600).
- one-minute overlap rejected (AC4): (559, 601) against (600, 660).
- new interval inside the existing one rejected (AC4): (610, 640).
- I did not copy (1320, 1441): AC1 and AC2 both reject it. I use (1400, 1441), where only AC1 rejects it.

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | `0 <= start` (in the first `if not (...)`) | AC1 | Yes. Start can be 0, so `>=` is right. |
| 2 | `start < end` | AC1 | Yes. Strict, so zero-length and reversed times are rejected. |
| 3 | `end <= 1440` | AC1 | Yes. End can be 1440, because the end is excluded. |
| 4 | `start > now` | AC1 | Yes. Strict, so start == now is rejected. |
| 5 | `if (end - start) > 120: return False` | AC2 | Yes. Exactly 120 passes, 121 is rejected. |
| 6 | `if blocked: return False` | AC3 | Yes. |
| 7 | `if start < b_end and end > b_start: return False` | AC4 | Yes. Both comparisons are strict, so touching endpoints pass. |
| 8 | `return True` at the end | AC5 | Yes. It is reached only if AC1-AC4 all held. |


**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

- Only a docstring and comments. No extra rule, no extra validation, no buffer, no saving, no other return type.
- The `for` loop only reads `existing`, so it is not changed (AC5).

**Before running v1** I expected it to pass all my tests. I did not expect any problem except non-integer times, which the contract leaves open.

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720) | none | True | AC4 | pass | pass |
| 2 | test_overlap_is_rejected | (630, 690) | none | False | AC4 | pass | pass |
| 3 | test_blocked_room_is_rejected | (660, 720) | blocked=True | False | AC3 | pass | pass |
| 4 | test_exactly_two_hours_is_allowed | (720, 840) | none | True | AC2 | pass | pass |
| 5 | test_over_two_hours_is_rejected | (720, 841) | none | False | AC2 | pass | pass |
| 6 | test_start_equal_to_now_is_rejected | (540, 570) | none | False | AC1 | pass | pass |
| 7 | test_zero_length_is_rejected | (700, 700) | existing=[] | False | AC1 | pass | pass |
| 8 | test_reversed_times_are_rejected | (700, 680) | existing=[] | False | AC1 | pass | pass |
| 9 | test_end_after_midnight_is_rejected | (1400, 1441) | existing=[] | False | AC1 | pass | pass |
| 10 | test_end_exactly_1440_is_allowed | (1380, 1440) | existing=[] | True | AC1 | pass | pass |
| 11 | test_negative_start_is_rejected | (-10, 30) | now=0, existing=[] | False | AC1 (also start > now) | pass | pass |
| 12 | test_start_one_minute_after_now_is_allowed | (541, 600) | none | True | AC1 | pass | pass |
| 13 | test_empty_existing_is_allowed | (600, 660) | existing=[] | True | AC4 | pass | pass |
| 14 | test_gap_between_several_bookings_is_allowed | (660, 700) | existing=[(600, 660), (700, 760), (800, 860)] | True | AC4 | pass | pass |
| 15 | test_overlap_with_second_of_several_is_rejected | (750, 810) | existing=[(600, 660), (700, 760), (800, 860)] | False | AC4 | pass | pass |
| 16 | test_same_interval_is_rejected | (600, 660) | none | False | AC4 | pass | pass |
| 17 | test_new_inside_existing_is_rejected | (610, 640) | none | False | AC4 | pass | pass |
| 18 | test_new_contains_existing_is_rejected | (590, 700) | none | False | AC4 | pass | pass |
| 19 | test_overlap_at_start_side_is_rejected | (570, 610) | none | False | AC4 | pass | pass |
| 20 | test_one_minute_overlap_at_start_is_rejected | (559, 601) | none | False | AC4 | pass | pass |
| 21 | test_touching_start_is_allowed | (570, 600) | none | True | AC4 | pass | pass |
| 22 | test_existing_is_not_changed | (660, 700) | existing=[(700, 760), (600, 660)]; the test checks the list after the call | list equal to its copy | AC5 | pass | pass |
| 23 | test_one_minute_at_end_of_day_is_allowed | (1439, 1440) | now=1438, existing=[] | True | AC1 | pass | pass |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | can_book(1439, 1440, 1438, False, []) | True | True | No defect. `if not (0 <= start < end <= 1440 and start > now)` accepts it: 1439 > 1438 and 1440 <= 1440. | None. No change was needed. | n/a |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
There are no concrete issues or defects in this implementation relative to the provided contract and AC1–AC5:

1. AC1 compliance: `0 <= start < end <= 1440 and start > now` directly evaluates all required boundary and time ordering conditions.

2. AC2 compliance: `(end - start) > 120` correctly rejects bookings longer than 120 minutes.

3. AC3 compliance: `if blocked:` correctly rejects when the room is blocked.

4. AC4 compliance: `start < b_end and end > b_start` strictly detects half-open interval overlap while permitting touching endpoints.

5. AC5 & Contract compliance: Returns `True` if and only if all criteria hold, returns `False` otherwise, and does not alter `existing` or any other input.

The provided code fully satisfies all contract requirements and acceptance criteria.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | AC1 line is correct: `0 <= start < end <= 1440 and start > now`. | accept | I checked it by hand: it has all four AC1 parts, and `start > now` is strict. Tests 6, 7, 8, 9, 10, 12 and 23 cover it. | No change, 23 tests OK |
| 2 | AC2 line is correct: `(end - start) > 120`. | accept | AC2 says at most 120, so 120 passes and 121 is rejected. Tests 4 and 5 show this. | No change, 23 tests OK |
| 3 | AC3 line is correct: `if blocked:`. | accept | AC3 says the room is not blocked. Test 3 shows it. | No change, 23 tests OK |
| 4 | AC4 line is correct: `start < b_end and end > b_start`. | accept | Both comparisons are strict, so touching passes. For (660, 720) against (600, 660): 660 < 660 is False. Tests 1, 14, 21 and the overlap tests show it. | No change, 23 tests OK |
| 5 | AC5 and the contract are satisfied: the function returns True or False and does not change `existing`. | accept | The loop only reads `existing`. Test 22 and checker F9 and F10 confirm it. | No change, 23 tests OK |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | No change. `code/booking.py` is identical to `code/original/booking_v1.py`. | v1 passed all my tests and F1-F10. The critique found no issue. | M1-M10 all PASS and the checker says "identical to your final: yes". |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests.test_empty_existing_is_allowed) ... ok
test_end_after_midnight_is_rejected (test_booking.BookingTests.test_end_after_midnight_is_rejected) ... ok
test_end_exactly_1440_is_allowed (test_booking.BookingTests.test_end_exactly_1440_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_is_not_changed (test_booking.BookingTests.test_existing_is_not_changed) ... ok
test_gap_between_several_bookings_is_allowed (test_booking.BookingTests.test_gap_between_several_bookings_is_allowed) ... ok
test_negative_start_is_rejected (test_booking.BookingTests.test_negative_start_is_rejected) ... ok
test_new_contains_existing_is_rejected (test_booking.BookingTests.test_new_contains_existing_is_rejected) ...ok
test_new_inside_existing_is_rejected (test_booking.BookingTests.test_new_inside_existing_is_rejected) ... ok
test_one_minute_at_end_of_day_is_allowed (test_booking.BookingTests.test_one_minute_at_end_of_day_is_allowed)... ok
test_one_minute_overlap_at_start_is_rejected (test_booking.BookingTests.test_one_minute_overlap_at_start_is_rejected) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_at_start_side_is_rejected (test_booking.BookingTests.test_overlap_at_start_side_is_rejected) ...ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_overlap_with_second_of_several_is_rejected (test_booking.BookingTests.test_overlap_with_second_of_several_is_rejected) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected) ... ok
test_same_interval_is_rejected (test_booking.BookingTests.test_same_interval_is_rejected) ... ok
test_start_equal_to_now_is_rejected (test_booking.BookingTests.test_start_equal_to_now_is_rejected) ... ok
test_start_one_minute_after_now_is_allowed (test_booking.BookingTests.test_start_one_minute_after_now_is_allowed) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 23 tests in 0.001s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (33 lines)
PASS   S1   your suite has at least 11 tests            23 tests
PASS   S2   your suite is green on your own code        23 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_start_equal_to_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_end_after_midnight_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_room_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_gap_between_several_bookings_is_allowed, test_start_one_minute_after_now_is_allowed, test_touching_end_is_allowed and 1 more
PASS   M7   your tests catch a fault in AC4             caught by test_overlap_with_second_of_several_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_new_contains_existing_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_is_not_changed, test_touching_start_is_allowed
PASS   M10  your tests catch a fault in AC5             caught by test_existing_is_not_changed
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 14 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              8 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  23 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 5 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      151 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | n/a (Path A) | n/a (Path A) | n/a (Path A) |

The three failing runs (Path A students leave this block empty):

```
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 32 checks passed in the final run. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

- My function does no type check. With 600.5 it works like a normal number: `can_book(600.5, 660.5, 540, False, [])` returns True, because all the comparisons still work. With the string "600" it raises TypeError at `0 <= start`, because Python cannot compare a number with a string.
- I think this is the right call. The contract says times are integers, so a non-integer time is outside the contract. AC1-AC5 do not ask for type checks, and the task says to add nothing beyond the contract. I did not write a test for it, because the contract does not say what the result must be.

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

- The bound `0 <= start`. The contract says `now` is between 0 and 1439, and AC1 also needs `start > now`, so every valid request already has `start >= 1`. A request with `start = 0` or a negative start always breaks `start > now` too. So `0 <= start` is never the only reason for a rejection. This is why my test with start = -10 is rejected by two rules at once.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->
(a) The overlap check is `start < b_end and end > b_start`. A new booking overlaps an old one only if it starts before the old one ends and also ends after the old one starts. Both comparisons are strict, so for (660, 720) against (600, 660) we get 660 < 660, which is False, and touching is allowed, as AC4 says.

(b) No fault survived: M1 to M10 all passed on the first checker run, so there was no missing test to find. I think this is because I tested both sides of every boundary (120 and 121 minutes, touching at both ends, 1440 and 1441) and several bookings in one list.

(c) The contract does not say what to do with a time like 600.5. I decided to add no type check, because AC5 and the contract ask for nothing more, and I wrote the reason in 9.2.