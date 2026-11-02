# SIS #03 — Report: Smart Campus Room Availability Checker

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT |
| Coding assistant model | GPT-6 |
| Bolt.new model | Standard |
| Bolt project link | https://bolt.new/~/sb1-oyt3a5kl|
| Language | Python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | fresh |

## 2. Baseline — before any new AI exchange
### 2.1 Scope in my own words

**Scope:** The system is a small room availability checker for one selected room. It uses fictional room and booking data to check whether a requested time interval is available. The user enters the start time and end time, and the system checks the request against the current time, the room's blocked status, and existing bookings. It displays a clear Available or Unavailable result. The project is limited to checking availability only. It does not include user login, a database, a backend, an API, payments, or actual booking creation.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | Valid time: Start and end must be integers. The start must be at least 0 and less than the end. The end must not exceed 1440, so exactly 1440 (midnight) is allowed, but 1441 is not. The current time must be between 0 and 1439, and the start must be strictly later than the current time. |
| AC2 | Maximum duration: The requested interval must not be longer than 120 minutes. Exactly 120 minutes is allowed. |
| AC3 | Blocked room: If the selected room is blocked, the request must be rejected. |
| AC4 | Overlapping bookings: The requested interval must not overlap with any existing booking. If one booking ends exactly when the next one starts, it is allowed. |
| AC5 | Result and no mutation: The system must clearly display either Available or Unavailable. Checking availability must not create, delete, or modify any booking or input data. |
| AC6 | Error messages and responsive layout: The system must show understandable feedback when the user enters invalid values. The page must also remain readable and usable on a narrow mobile screen. |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Failure point 1: Incorrect time boundary validation | AC1 | With now = 540, test start = 540, end = 600; this must be rejected because the start is not later than the current time. Also test start = 1380, end = 1440, which should pass the time-boundary check, and start = 1380, end = 1441, which must be rejected. |
| 2 | Failure point 2: Incorrect overlap checking | AC4 | If an existing booking is (600, 660), a request (660, 720) should be allowed because the first booking ends exactly when the new one starts. A request (630, 690) should be rejected because the intervals overlap. |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Requested booking start time | Integer from 0 to 1439 |
| `end` | Requested booking end time | Integer from 1 to 1440; must be greater than start |
| `now` | Current time | Integer from 0 to 1439 |
| `blocked` | Whether the selected room is blocked | Boolean: True or False |
| `existing` | Existing booking intervals | List of booking pairs, where each pair contains integer start and end minutes |
| returns | Whether the requested time can be booked | Boolean: True if all AC1–AC4 conditions pass; otherwise False |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. The value of now is always provided as a valid integer between 0 and 1439. The function does not need to calculate the current time itself.
2. Existing bookings are valid intervals within the same day, and they do not overlap with each other. The function checks the requested interval against them.

**Checked manually:**

- For now = 540, start = 600, and end = 720, the start is 60 minutes in the future and the duration is exactly 120 minutes. This request should pass AC1 and AC2.
- For an existing booking (600, 660) and a requested interval (660, 720), the intervals only touch at minute 660. They do not overlap, so the request should pass AC4.
- For the same existing booking (600, 660) and a requested interval (630, 690), the intervals share the period from 630 to 660. Therefore, the request should fail AC4.
- For start = 1380 and end = 1440, the end is exactly the allowed daily limit. For end = 1441, the request must be rejected.

## 3. Python v1 review

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| 0 <= start < end <= 1440 | AC1 | Yes | Checks that start is not negative, end is greater than start, and end does not exceed 1440. It accepts an end time of exactly 1440 and rejects 1441. |
| start > now | AC1 | Yes | Requires the requested start time to be strictly later than the current time. If start == now, the function returns False, as in T6. |
| (end - start) > 120 | AC2 | Yes | Rejects durations greater than 120 minutes. Exactly 120 minutes is allowed, while 121 minutes is rejected. |
| blocked | AC3 | Yes | If the room is blocked (True), the function immediately returns False. |
| start < b_end and end > b_start | AC4 | Yes | Checks whether the requested interval overlaps an existing booking. Strict comparisons allow touching endpoints, such as T1, while actual overlaps such as T2 and T10 are rejected. |

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a one-page, responsive "Smart Campus Room Availability Checker" for ONE selected room, using fictional booking data. The page only checks availability; it does not create or confirm bookings.

Fixed demo data shown on the page: room "Room A-101", current time 09:00, one existing booking 10:00-11:00. A "Room is blocked" toggle (off by default). Inputs: start time and end time (24-hour, to the minute) and a "Check" button.

Rules:
- AC1: start and end are valid, start is before end, end is no later than 24:00 (midnight), and start is strictly later than the current time (09:00).
- AC2: duration is at most 120 minutes; exactly 120 is allowed.
- AC3: if the room is blocked, every request is Unavailable.
- AC4: a request that overlaps an existing booking is Unavailable; touching at an endpoint (for example 11:00-12:00) is NOT an overlap.
- AC5: show a clear, unambiguous "Available" or "Unavailable" result; never modify the existing bookings.
- AC6: show understandable validation messages for invalid input, and a usable layout on narrow mobile screens.

Do NOT add login, a backend, or a database. No external APIs, payments, analytics, or unrelated features.
~~~~

| Generated file or component | Path | Its role |
| --- | --- | --- |
| App component | src/App.tsx | Contains the main user interface, room selection, time inputs, booking schedule, and availability result panel. |
| Availability logic | src/availability.ts | Contains the validation rules for time intervals, maximum duration, blocked rooms, and overlapping bookings. |
| Type definitions | src/types.ts | Defines the TypeScript interfaces for rooms and bookings, and the Available/Unavailable result structure. |

**What v1 does:**

- Allows the user to select a room from the available room list.
- Provides inputs for current time, start time, and end time.
- Checks whether the requested time interval is valid and whether its duration exceeds 120 minutes.
- Checks whether the selected room is blocked.
- Compares the requested interval with existing bookings and detects overlaps.
- Displays an Available or Unavailable result with explanatory messages.
- Shows the existing booking schedule for the selected room.
- Uses a responsive layout intended to work on desktop and narrow screens.

## 5. Test cases — executed on both artifacts

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | |
| T1 | Touching | 660–720 | Available | True | True | Available | |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Available | |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | |

## 6. Traceability

<!-- His table. Implementation / file: where the rule lives (booking.py line, a component).
     Test input: the case IDs from section 5. v1 / final actual: what those cases gave. -->

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC2 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC3 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC4 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC5 | (write here) | (write here) | (write here) | (write here) | (write here) |
| AC6 | (write here) | (write here) | (write here) | (write here) | (write here) |

## 7. Issue log

<!-- At least two, from v1 — a functional defect and a usability or code-quality issue where you
     have them. If every case passed on v1, log the preventive cleanup and say why.
     Reproduction names a case (T1-T12) or an AC. Priority: High, Medium or Low.
     Prompt / change: the focused prompt you sent, and what changed. Never "make it better". -->

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) | (write here) |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue (write here)

## 8. Critique decisions

<!-- The AI's review against AC1-AC6 (stage C), claim by claim. At least three rows.
     How I verified it: the case, test or run that confirmed or refuted the claim.
     Decision: accept, reject or modify. At least one reject or modify — the reflection asks for it. -->

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | (write here) | (write here) | (write here) | (write here) |
| 2 | (write here) | (write here) | (write here) | (write here) |
| 3 | (write here) | (write here) | (write here) | (write here) |

## 9. Coding-agent analysis

### 9.1 The loop

<!-- One real pass through the loop from this assignment — with your assistant or with Bolt. -->

| Step | What happened in this assignment |
| --- | --- |
| User goal | (write here) |
| Model / plan | (write here) |
| Tool call | (write here) |
| Observation | (write here) |
| Next step | (write here) |
| Human review | (write here) |

### 9.2 Context, tools and permissions

<!-- At least three rows. Last column: Observed (you saw it happen) or Assumed (you infer it
     about the internals). Use both at least once. -->

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** (write here)

**Reliability, security, responsibility:** (write here)

## 10. Reflection

<!-- 100-200 words, in your own words, no AI. Compare AI-assisted coding (the Python part) with
     vibe coding (the Bolt part); one example each of a reliability, an availability/usability and
     a security risk; why review, tool permissions and tests stay human responsibilities; one AI
     recommendation you rejected or modified, and why; what you would improve next without
     expanding the scope. -->

(write here)

## 11. Appendix A — AI exchanges

<!-- At least four. Complete prompts and complete responses, as text — never screenshots. Paste
     each inside the ~~~~ block that follows its label.
     Stage: Plan, Generate, Critique or Repair (the brief's A-D) — at least one of each.
     Source: this SIS, week-05 or week-06. Reused exchanges keep their original date.
     The Generate exchange for Python must contain your v1 exactly as it is in code/original/.
     Add B5, B6 … if you ran more. -->

### B1

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B2

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B3

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

### B4

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Stage:** (write here)
- **Source:** (write here)

**Prompt:**

~~~~text
(paste here)
~~~~

**Response:**

~~~~text
(paste here)
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

<!-- The complete terminal output of your final suite. Path A: python -m unittest -v, run inside
     code/ — the part ending in "Ran N tests" and OK or FAILED. -->

~~~~text
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests.test_empty_existing_is_allowed) ... ok
test_end_after_midnight_is_rejected (test_booking.BookingTests.test_end_after_midnight_is_rejected) ... ok
test_end_exactly_1440_is_allowed (test_booking.BookingTests.test_end_exactly_1440_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_is_not_changed (test_booking.BookingTests.test_existing_is_not_changed) ... ok
test_gap_between_several_bookings_is_allowed (test_booking.BookingTests.test_gap_between_several_bookings_is_allowed) ... ok
test_negative_start_is_rejected (test_booking.BookingTests.test_negative_start_is_rejected) ... ok
test_new_contains_existing_is_rejected (test_booking.BookingTests.test_new_contains_existing_is_rejected) ... ok
test_new_inside_existing_is_rejected (test_booking.BookingTests.test_new_inside_existing_is_rejected) ... ok
test_one_minute_at_end_of_day_is_allowed (test_booking.BookingTests.test_one_minute_at_end_of_day_is_allowed) ... ok
test_one_minute_overlap_at_start_is_rejected (test_booking.BookingTests.test_one_minute_overlap_at_start_is_rejected) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_at_start_side_is_rejected (test_booking.BookingTests.test_overlap_at_start_side_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_overlap_with_second_of_several_is_rejected (test_booking.BookingTests.test_overlap_with_second_of_several_is_rejected) ... ok
test_reversed_t7 (test_booking.BookingTests.test_reversed_t7) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected) ... ok
test_same_interval_is_rejected (test_booking.BookingTests.test_same_interval_is_rejected) ... ok
test_second_booking_overlap_t10 (test_booking.BookingTests.test_second_booking_overlap_t10) ... ok
test_start_equal_to_now_is_rejected (test_booking.BookingTests.test_start_equal_to_now_is_rejected) ... ok
test_start_one_minute_after_now_is_allowed (test_booking.BookingTests.test_start_one_minute_after_now_is_allowed) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 25 tests in 0.000s

OK
~~~~

### 12.2 Path B only — three faults you planted

<!-- Path A: leave this table as it is. Path B: three rows — the line you broke, the AC it
     breaks, the test that failed. -->

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

<!-- One row per check ID in submission.yml known_fails, and any limitation you know of.
     If the checker is clean and you know of none, one row that says so. -->

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
