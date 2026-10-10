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
- one-minute overlap rejected (AC4): (599, 661) style cases.
- new interval inside the existing one rejected (AC4): (610, 640).

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes / no

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type):

-

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
(paste here)
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | | accept / reject | | |
| 2 | | accept / reject | | |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | | | |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
(paste here)
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
(paste here)
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

-

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
