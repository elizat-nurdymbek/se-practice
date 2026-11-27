# Week 11 — Lab report

**Name:** Elizat Nurdymbek
**Group:** Monday 16-19
**Date:** 2026/11/28

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I built the feature with (tool) | Claude |
| Its exact model (with its version, or `not displayed`) | |
| Assistant I reviewed with (tool) | |
| Its exact model (with its version, or `not displayed`) | |
| Starting point (`week-10` or `week-08`) | week-10 |
| Baseline commit — the checkpoint of Part 0 | dc98cce |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | v3.2.7 |

---

## 2. Task 1 — the baseline

### 2.1 The project's commands

Run each command in `week-11/app/` before any change. **Exists:** `yes` or `no`. **Result:** `pass`, `fail`, `missing` or `not run`.

| Command | Exists | Result | Note |
| --- | --- | --- | --- |
| `npx vitest run` | yes | pass | 23 tests passed |
| `npm run build` | yes | pass | tsc && vite build is OK |
| `npm run lint` | no | missing | No "lint" script in package.json |

### 2.2 The baseline test run

The **real** output of `npx vitest run` in `week-11/app/`, before any change:

```text
 RUN  v3.2.7 /Users/nurdymbekelizat/se-practice/week-11/app

 ✓ src/booking.test.ts (23 tests) 3ms
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
   ✓ canBook() unit tests > AC4: Existing Bookings Overlap > BUG-A AC4: returns true when touching the last of three consecutive bookings 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > AC5: an Available request leaves the existing bookings unchanged 0ms
   ✓ canBook() unit tests > AC5: Data Preservation > BUG-B AC5: does not mutate bookings when checking an available slot 0ms
   ✓ R1 regression: invalid input must not be reported as Unavailable > R1 AC1/AC6: start equal to end is reported as invalid, not Unavailable 0ms
   ✓ R1 regression: invalid input must not be reported as Unavailable > R1 AC1/AC6: reversed interval is reported as invalid, not Unavailable 0ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  01:32:45
   Duration  244ms (transform 31ms, setup 0ms, collect 28ms, tests 3ms, environment 0ms, prepare 46ms)
```

### 2.3 What I located

| What | Where (file, and the function or component name) |
| --- | --- |
| The availability function | |
| The UI component | |
| The repository instructions | |

---

## 3. Task 2 — the feature, defined before the code

### 3.1 The user story

As a student, I want a short explanation of room availability so I understand the decision.

### 3.2 The contract

One row per field. **Validation** is what you reject, and how.

| Field | Direction | Type / format | Validation |
| --- | --- | --- | --- |
| `roomLabel` | input | string | Trim it. Reject if empty or longer than 60 characters. |
| `start` | input | string "HH:MM"	| Reject if it is not a real time in the format HH:MM. |
| `end` | input | string "HH:MM" | Same as start. |
| `isAvailable` | input | boolean | Comes from canBook. Reject if it is not a boolean. |
| `reasonCode` | input | one of 6 codes | Comes from availabilityReason. Reject any other value. |
| `explanation` | output | string | Not empty, max 280 characters, max 2 sentences, agrees with isAvailable, has no time that is not in the request. |

### 3.3 Acceptance criteria and failure behaviour

F1–F5 (README §3.4), then what the student sees in each failure:

F1 Existing availability and overlap rules remain unchanged.
F2 The explanation agrees with the deterministic result; no invented booking details.
F3 Empty, malformed or overly long input is rejected.
F4 API timeout, error or unavailable key produces a safe fallback.
F5 A user can distinguish generated explanation from confirmed booking status.

| Failure | What the student sees |
| --- | --- |
| Invalid input (empty, malformed, too long) | A short message about the input. The adapter is not called. The booking status is still shown. |
| The model times out | The fallback sentence made from the reason code. The status does not change. |
| The model fails (error, no key) | The same fallback sentence. The page still works. |
| The model's answer contradicts the decision, or invents a detail | The answer is thrown away. The fallback sentence is shown instead. |

### 3.4 The flow

A written flow with arrows (`->`), or a diagram in a code block. Name your checker function and the adapter, and say which one decides availability.

```text
student input -> validation -> availabilityReason (checker, DECIDES) -> { isAvailable, reasonCode }
  -> explainAvailability -> adapter (mock, only EXPLAINS) -> check the output
  -> UI shows: status line (confirmed) + "Generated explanation (mock), not a booking decision"
If the adapter is late, throws, or gives a bad answer -> fallback text from reasonCode.
Only availabilityReason / canBook decides availability. The adapter never does.
```

---

## 4. Task 3 — build it with an AI assistant

### 4.1 The implementation prompt and the answer

What you sent, exactly (the deck's prompt, and the contract if you sent it):

```text
(paste here)
```

The assistant's answer, pasted unedited (its description of each changed file is enough if the code
is long):

```text
(paste here)
```

### 4.2 Every changed file, decided

**Decision:** `accept`, `modify` or `reject`.

| File | What the assistant changed | Decision | Why |
| --- | --- | --- | --- |
| | | | |
| | | | |
| | | | |

### 4.3 The adapter

| | |
| --- | --- |
| The mock adapter (its name in `explain.ts`) | |
| The timeout (milliseconds) | |
| A real-model adapter too? (`no`, or `yes` and where it runs, and where its key lives) | |

---

## 5. Task 4 — prompt engineering

### 5.1 Three instructions

```text
A: (paste here)
```

```text
B: (paste here)
```

```text
C: (paste here)
```

### 5.2 The three inputs and the answers

The same three JSON inputs (`available`, `overlap`, `room_blocked`), sent after each prompt in a fresh
chat, and the answers, unedited:

```text
(paste here)
```

### 5.3 The comparison

**Clarity** and **consistency:** 1 (poor) to 3 (good). **Agrees with the facts:** `yes` or `no`.
**Invented:** what it made up (a time, a booking, a person), or `nothing`.

| Prompt | Clarity | Consistency | Agrees with the facts | Invented |
| --- | --- | --- | --- | --- |
| A | | | | |
| B | | | | |
| C | | | | |

### 5.4 The one I chose

**Chosen:** A / B / C

<!-- Why, from the table above. Then confirm it is in explain.ts as SYSTEM_INSTRUCTION. -->

---

## 6. Task 5 — tests

### 6.1 The test cases

**Verdict:** `pass`, `fail` or `not run`. **How:** the Vitest test title, or `manual` and what you did.

| ID | Case | Expected | Observed | Verdict | How |
| --- | --- | --- | --- | --- | --- |
| E1 | available | | | | |
| E2 | overlap | | | | |
| E3 | blocked room | | | | |
| E4 | invalid time | | | | |
| E5 | past time | | | | |
| E6 | empty input | | | | |
| E7 | long input | | | | |
| E8 | timeout | | | | |
| E9 | simulated API failure | | | | |
| UI | the UI never changes the deterministic decision | | | | |

### 6.2 The run after the feature

The real output of `npx vitest run` with `explain.test.ts` in place (before the review fixes):

```text
(paste here)
```

### 6.3 Screenshots

| File | What it shows |
| --- | --- |
| `evidence/explain-available.png` | |
| `evidence/explain-fallback.png` | |

---

## 7. Task 6 — the agentic code review

### 7.1 The reviewer and its context

Where it ran, how you made sure it could not edit, and what you gave it (the diff, README,
`AGENTS.md`, the criteria):

<!-- Write below this line -->

### 7.2 The review prompt and the answer

What you sent, exactly (the deck's prompt):

```text
(paste here)
```

The reviewer's answer, pasted unedited:

```text
(paste here)
```

### 7.3 The findings, verified

At least **three**; at least **two** `confirmed`. **Category:** `correctness`, `security`,
`maintainability`, `performance` or `tests`. **Severity:** `high`, `medium` or `low`. **Found by:**
`reviewer`, `me` or `both`.

| ID | Finding (short) | Category | Severity | File | How I verified it | Label | Found by |
| --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | | | | | | | |
| V2 | | | | | | | |
| V3 | | | | | | | |

### 7.4 My own inspection, and the linter

What you checked by hand that the reviewer did not, and which of these findings a linter would have
caught and which it could not:

<!-- Write below this line -->

---

## 8. Task 7 — repair and regression-test

### 8.1 The first fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.2 The second fix

**Finding:** V?

**Why it is necessary:**

**What I rejected from the assistant's proposal, and why:**

The diff (`git diff`):

```text
(paste here)
```

### 8.3 The final run

The real output of the **full** suite after both fixes: the old booking tests and the feature tests
together. Every test must pass.

```text
(paste here)
```

### 8.4 Ready for demonstration?

**Ready:** yes / no

**What remains unresolved:**

<!-- Write below this line -->

---

## 9. Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| | |

---

## 10. Reflection

<!-- 80-150 words, in your own words, without the assistant: what the AI generated, what you
     verified, and what you changed. Name at least one finding ID (V1...) and one test ID (E1...).
     Worthless: "AI helped me build the feature faster and the review was useful."
     Worth everything: "Bolt wrote explain.ts and put a fetch to the OpenAI API in App.tsx with a
     VITE_ key; I rejected that file and kept the mock (X4). The reviewer's V3, 'prompt injection
     through roomLabel', was unsupported: the label comes from a fixed list. E8 failed at first
     because the timeout was never armed; V1 was confirmed by a test that failed before the fix." -->

<!-- Write your reflection below this line -->
