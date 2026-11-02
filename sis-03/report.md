# SIS #03 — Report: Smart Campus Room Availability Checker

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT |
| Coding assistant model | GPT-5.6 Luna |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/~/sb1-oyt3a5kl |
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
| App component | src/App.tsx | Main user interface: room info, "Room is blocked" toggle, start and end time inputs, Check availability and Reset buttons, validation messages and the Available / Unavailable result panel. |
| Availability logic | src/availability.ts | Validation rules for the time interval (AC1), maximum duration (AC2), blocked room (AC3) and overlap with existing bookings (AC4); also parses and formats times. |
| Fictional data | src/data.ts | The fictional room and booking data shown on the page. |
| Type definitions | src/types.ts | TypeScript types for rooms, bookings and the Available / Unavailable result. |

**What v1 does:**

- Shows one fictional room, Room A-101, with the current time 09:00 as fixed text and one existing booking, Faculty Meeting 10:00–11:00.
- Has a "Room is blocked" toggle (off by default), start and end time inputs, and "Check availability" and "Reset" buttons.
- Shows Available or Unavailable with the reasons, and validation messages for invalid input.
- On first load it already shows "Start time is required" and "End time is required" (issue 3); the time input stops at 23:59 (issue 2).

## 5. Test cases — executed on both artifacts

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Available | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Unavailable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Unavailable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Not testable | Available |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Available | Available |
| T11 | Same check twice | 660–720, twice | Available | True | True | Available | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Available | Available |

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py`: `0 <= start < end <= 1440 and start > now`; page: `web/final/project/src/availability.ts` (end > 1440, start >= end, start <= currentTime) | T6, T7, T8, T9 | T6 Unavailable, T7 Unavailable, T8 Available, T9 Unavailable | Python: T6 False, T7 False, T8 True, T9 False. Page: T6 Unavailable, T7 Unavailable, T8 Not testable, T9 Not testable | Python: same as v1. Page: T6 Unavailable, T7 Unavailable, T8 Available (with "End at midnight" checkbox), T9 Not testable |
| AC2 | `code/booking.py`: `(end - start) > 120`; page: `availability.ts` (`end - start > MAX_BOOKING_MINUTES`) | T4, T5 | T4 Available, T5 Unavailable | Python: T4 True, T5 False. Page: T4 Available, T5 Unavailable | Python: same as v1. Page: T4 Available, T5 Unavailable |
| AC3 | `code/booking.py`: `if blocked: return False`; page: "Room is blocked" toggle, checked in `availability.ts` | T3 | Unavailable | Python: False. Page: Unavailable | Python: False. Page: Unavailable |
| AC4 | `code/booking.py`: `start < b_end and end > b_start`; page: `availability.ts` (same condition over `data.ts` bookings) | T1, T2, T10, T11 | T1 Available, T2 Unavailable, T10 Unavailable, T11 Available | Python: T1 True, T2 False, T10 False, T11 True. Page: T1 Available, T2 Unavailable, T10 Available (FAIL: only one booking in the data), T11 Available | Python: same as v1. Page: T10 Available (declared in section 13) |
| AC5 | `code/booking.py`: the loop only reads `existing`; page: verdict panel in `src/App.tsx`, bookings are only filtered in `availability.ts` | T11, unit test `test_existing_is_not_changed` | Same result on both calls; `existing` unchanged | Python: T11 True; test passes. Page: T11 Available | Python: T11 True, 25 tests OK. Page: T11 Available |
| AC6 | `web/final/project/src/App.tsx`: validation messages, responsive layout | T12, empty fields after load, 12:00-11:00 | T12 Available at ~375 px; no errors on load; clear message for reversed times | Page: T12 Available; "required" errors shown on load (issue 3); reversed times show a start/end message | Page: no errors on load, "required" messages after Check with empty fields; T12 Available at ~375 px (`evidence/final-narrow.png`) |

## 7. Issue log

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | The page has only one fictional booking, so the second-booking scenario (T10) cannot be tested. | T10: 12:00-13:00 shows Available, expected Unavailable (AC4). | Medium | Prompt 1: "The fictional data has only one booking (10:00-11:00). Add a second booking, 11:40-12:40, to the existing bookings list so a request of 12:00-13:00 is Unavailable because it overlaps it. Do not change any other behaviour or add features." Retest: T10 became Unavailable, but T1 (11:00-12:00) also became Unavailable, because it overlaps 11:40-12:40. By calculation T4 (720-840) and T11 would be affected the same way. Prompt 2: "Remove the second booking "Student Council" (11:40–12:40) from the existing bookings, so that only the Faculty Meeting 10:00–11:00 remains. Keep everything else unchanged, including the "End at midnight (24:00)" checkbox and the validation behaviour. Do not add any other features." | Reverted. T1, T4 and T11 are Available again. T10 stays Available on the page and is declared as a known fail in section 13. |
| 2 | The hint says "End time may go up to 24:00", but the time input stops at 23:59, so end = 1440 cannot be entered. | T8: 23:00-24:00 cannot be entered on the page (AC1 allows end = 1440). | Medium | Prompt: "The hint says "End time may go up to 24:00", but the time input stops at 23:59, so an end time of exactly 24:00 (minute 1440) cannot be entered, although AC1 allows end = 1440. Add a checkbox "End at midnight (24:00)" next to the end time. When it is checked, use end = 1440 and ignore the end time input. Keep every other rule unchanged: the validation, the 120-minute limit, the blocked toggle and the overlap check. Do not add any other features." Change: a checkbox "End at midnight (24:00)" was added; when checked, the end is set to minute 1440. | Start 23:00 with the checkbox: Available (T8). Start 22:00 with the checkbox: Available (exactly 120 minutes). Start 21:00 with the checkbox: Unavailable (180 minutes, AC2). T9 stays Not testable because a time above 24:00 cannot be entered. |
| 3 | Required-field validation messages are shown immediately on page load, before the user enters any values. | Refresh the page and enter nothing (AC6). The "Please fix the following" block with "Start time is required" and "End time is required" is already visible. | Low | Prompt: "On first load, before the user types anything, the page already shows "Please fix the following: Start time is required. End time is required." Show validation messages only after the user presses Check availability. Do not change any other behaviour or add features." Change: validation messages now appear only after Check is pressed. | After the fix, a fresh load shows no errors; pressing Check with empty fields shows the "required" messages. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 3: on first load the page already displayed "Please fix the following: Start time is required. End time is required." (before); after the fix a fresh load shows no errors (after).

## 8. Critique decisions

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | The web page cannot accept an end time of 24:00, so end = 1440 is unreachable from the UI. | I tried to enter 24:00 and 24:01 in the time input. The field stops at 23:59 and does not accept them. | accept | AC1 allows end = 1440; T8 and T9 are Not testable on the page. This matches my issue 2. |
| 2 | Clearing the "Current time" input silently disables the start-after-now rule. | I checked the page: "Current time: 09:00" is plain text, not an editable field. | reject | AC1; the scenario cannot happen in the real interface. |
| 3 | The "start after now" message is suppressed when the interval is invalid. | I entered an interval with start later than end. Both messages appeared: the start/end order message and the start-after-current-time message. | reject | AC1; the reported behaviour did not reproduce. |
| 4 | can_book returns only False, so it cannot explain why a request was rejected. | I checked the contract: can_book returns a Boolean. The page already shows reason messages. | reject | Contract is fixed (True only when AC1-AC4 hold); AC6 feedback belongs to the page. |
| 5 | can_book accepts floats (AC1 says integer minutes). | I ran can_book(9.5, 10.5, 9, False, []) and it returned True. | modify | AC1; real but outside the contract, which guarantees integer inputs, so I did not change booking.py. |
| 6 | booking_v1.py has broken indentation and will raise SyntaxError. | I ran python3 -m py_compile original/booking_v1.py: no errors. My 25 tests pass on the same code. | reject | The file is valid; the problem was an artifact of pasting into the chat. |

## 9. Coding-agent analysis

### 9.1 The loop

| Step | What happened in this assignment |
| --- | --- |
| User goal | Make the Bolt page demonstrate the second-booking case (T10, AC4) without changing the other rules or the original T1–T12 test data. |
| Model / plan | I sent Bolt a focused prompt asking it to add a second booking from 11:40 to 12:40 so that a request from 12:00 to 13:00 would be Unavailable, without making unrelated changes. |
| Tool call | Bolt edited the project files and rebuilt the preview. |
| Observation | T10 (12:00–13:00) became Unavailable as intended. But T1 (11:00–12:00) also became Unavailable, with the message "Overlaps existing booking "Student Council" (11:40–12:40)". |
| Next step | I concluded that with fixed base data one extra booking cannot keep T10 Unavailable and T1 and T4 Available, because any booking that overlaps 720–780 also overlaps 720–840. I sent a second prompt asking Bolt to remove the added booking. |
| Human review | After the rollback I reran T1, T4, T10 and T11. T1, T4 and T11 are Available again, as expected. T10 stays Available, so I declared it as a known fail in section 13. |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| ChatGPT (Week 05, Python v1) | Only the text I typed in the chat: the function name, the contract and the AC1-AC5 wording. It did not see my repository. | No file access and no code execution that I saw. I copied the generated code into booking_v1.py by hand. | Observed: I pasted the prompt and the code manually. Assumed: that it did not run the code before answering. |
| Bolt.new (web v1 and the three repairs) | My prompt plus the project files in its own workspace (src/App.tsx, availability.ts, data.ts, types.ts). | It created and edited project files and rebuilt the preview after each prompt; I saw a file list in the export and a refreshed preview. | Observed: the files, the exported project and the changed preview. Assumed: that it sends the project files to the model with every prompt and that it runs a dev server and install step internally. |
| Bolt.new (critique chat) | The code I pasted into the prompt (booking_v1.py, availability.ts, data.ts). Its answer also named App.tsx and VerdictPanel and said the project on disk still contained an earlier single-room app. | Text answer only, with follow-up suggestion buttons. I did not see it run code. | Observed: the answer text and the follow-up buttons. Assumed: that it read the files in its own Bolt workspace, since it described code I had not pasted. |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before accepting any AI output I ran it myself. I compiled booking_v1.py with py_compile and ran 25 unit tests, checked that the exported web folder has no node_modules or .env, and reran the test cases on the page after every Bolt prompt. That last step caught the regression where adding a second booking also made T1 Unavailable.

**Reliability, security, responsibility:** The assistants were useful, but they were wrong or incomplete in places: the critique claimed an indentation error that was only a paste artefact, and one repair idea (a second booking) broke T1. Nothing was safe to trust without running it. Permissions matter too: Bolt can edit and rebuild files by itself, so I limited it with focused prompts, kept v1 untouched in its own folder, and I stay responsible for reviewing every change and every test result.

## 10. Reflection

In this assignment, I used AI-assisted coding for Python and vibe coding with Bolt for the web page. With Python, I could review the function and run unit tests to check each acceptance criterion. With Bolt, I mainly checked the preview, so I had to be more careful when verifying the generated changes.

One reliability risk was that adding a second booking to demonstrate T10 also made T1 unavailable. This showed that one change can affect other test cases. A usability risk was the time input, which initially did not allow users to enter 24:00 even though the requirements allowed it. A security risk is giving an AI tool broad editing permissions without reviewing the files it changes or exports.

Human review, tool permissions and testing remain important because AI can make incorrect changes or give inaccurate feedback. For example, I rejected the critic's claim that my original Python file had broken indentation after py_compile completed successfully. I also kept the Python function's Boolean return type because it was part of the required contract.

Next, I would improve test coverage for boundary times and multiple bookings while keeping the original requirements and scope unchanged.

## 11. Appendix A — AI exchanges

### B1

- **Tool:** ChatGPT
- **Model:** GPT-5.6 Luna
- **Date:** 2026-10-11
- **Stage:** Plan
- **Source:** week-05

**Prompt:**

~~~~text
Propose a short implementation plan for can_book. List the checks in order and identify assumptions. Use Python 3 and the supplied rules. Do not write code yet. Suggest boundary cases that could expose an incorrect implementation.
~~~~

**Response:**

~~~~text
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
~~~~

### B2

- **Tool:** ChatGPT
- **Model:** GPT-5.6 Luna
- **Date:** 2026-10-11
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
Scenario: Smart Campus study room booking.
User story: As a student, I want to check a room's availability so that I can choose a valid booking time.
Feature: implement can_book(...) for one selected room. Return a decision. The complete system handles saving and confirmation.

Function contract
can_book(start, end, now, blocked, existing)
- Times are integer minutes after midnight on one date. Example: 600 means 10:00.
- now is valid (0-1439). blocked is a Boolean.
- existing contains valid (start, end) tuples for this room's active bookings only.
- Return True or False. Keep all inputs unchanged.

Acceptance criteria
AC1: 0 <= start < end <= 1440, and start > now.
AC2: Duration is at most 120 minutes.
AC3: The room is not blocked.
AC4: No overlap with an existing booking. Touching endpoints are allowed.
AC5: Return True only when AC1-AC4 hold. Return False otherwise and never alter existing.

Intervals include the start and exclude the end.
~~~~

**Response:**

~~~~text
def can_book(start, end, now, blocked, existing):
    """
    Checks if a study room can be booked for the given time slot.
    
    AC1: Valid range (0 <= start < end <= 1440) and start > now.
    AC2: Duration (end - start) is at most 120 minutes.
    AC3: Room is not blocked.
    AC4: No overlap with existing active bookings (touching endpoints allowed).
    AC5: Return True if all hold, False otherwise without altering inputs.
    """
    # AC3: The room is not blocked
    if blocked:
        return False

    # AC1: 0 <= start < end <= 1440, and start > now
    if not (0 <= start < end <= 1440) or start <= now:
        return False

    # AC2: Duration is at most 120 minutes
    if (end - start) > 120:
        return False

    # AC4: No overlap with existing bookings (touching endpoints allowed)
    # Half-open intervals [start, end) overlap if: start < e_end and end > e_start
    for e_start, e_end in existing:
        if start < e_end and end > e_start:
            return False

    # AC5: All criteria AC1-AC4 hold
    return True
~~~~

### B3

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Review my Python function and my web page against these acceptance criteria. Be specific and cite code.
AC1: 0 <= start < end <= 1440 (integer minutes), start strictly after now.
AC2: duration at most 120 minutes; exactly 120 is allowed.
AC3: reject every request when the room is blocked.
AC4: reject overlap with any existing booking; touching at an endpoint is not an overlap.
AC5: show an unambiguous Available / Unavailable result; do not mutate existing bookings.
AC6: understandable validation feedback and a usable narrow/mobile layout.
Do not suggest new features (no cleaning buffer, no 90-minute limit, no Book button).
List each finding as a numbered claim with the AC it concerns.
booking_v1.py,
def can_book(start, end, now, blocked, existing):
"""
Checks if a room can be booked based on time constraints, room availability,
and existing bookings.


Acceptance Criteria:
- AC1: 0 <= start < end <= 1440, and start > now
- AC2: Duration is at most 120 minutes (end - start <= 120)
- AC3: Room is not blocked (not blocked)
- AC4: No overlap with existing bookings (touching endpoints allowed)
- AC5: Return True only when AC1-AC4 hold; False otherwise. Inputs unchanged.
"""

# AC1: Check time bounds and order
if not (0 <= start < end <= 1440 and start > now):
return False

# AC2: Check maximum duration restriction
if (end - start) > 120:
return False

# AC3: Check room blocked status
if blocked:
return False

# AC4: Check for interval overlaps with existing bookings # Two half-open intervals [start, end) and [b_start, b_end) overlap iff # start < b_end and end > b_start.
for b_start, b_end in existing:
if start < b_end and end > b_start:
return False

# AC5: Return True only if all criteria (AC1-AC4) are satisfied
return True

src/availability.ts,
import type { Booking, Room, Verdict } from "./types";

const MAX_BOOKING_MINUTES = 120;
const DAY_END = 1440;

/**

AC1: 0 ≤ start < end ≤ 1440 and start must be after current time.
AC2: No booking longer than 120 minutes.
AC3: Reject when the selected room is blocked.
AC4: Reject overlap with existing bookings; touching endpoints are allowed.
AC5: Pure check — never mutates bookings. */ export function checkAvailability( roomId: string, start: number, end: number, currentTime: number, rooms: Room[], bookings: Booking[] ): Verdict { const reasons: string[] = [];
// AC1 — interval validity
if (!Number.isFinite(start) || !Number.isFinite(end)) {
reasons.push("Start and end times are required.");
} else {
if (end > DAY_END) {
reasons.push("End time cannot be later than 24:00.");
}
if (start >= end) {
reasons.push("Start time must be earlier than end time.");
}
if (start <= currentTime && start < end) {
reasons.push("Start time must be after the current time.");
}
}

// AC2 — max duration
if (Number.isFinite(start) && Number.isFinite(end) && end - start > MAX_BOOKING_MINUTES) {
reasons.push("Bookings may not exceed 120 minutes.");
}

// AC3 — blocked room
const room = rooms.find((r) => r.id === roomId);
if (!room) {
reasons.push("Please select a room.");
} else if (room.blocked) {
reasons.push("${room.name}" is currently blocked and cannot be booked.);
}

// AC4 — overlap (touching endpoints allowed)
if (room && !room.blocked && start < end && start >= 0 && end <= DAY_END) {
const conflicts = bookings.filter(
(b) => b.roomId === roomId && start < b.end && end > b.start
);
for (const c of conflicts) {
reasons.push(
Overlaps existing booking by ${c.bookedBy} (${fmt(c.start)}–${fmt(c.end)}).
);
}
}

return reasons.length === 0 ? { kind: "available" } : { kind: "unavailable", reasons };
}

/** minutes-from-midnight -> "HH:MM" */
export function fmt(min: number): string {
const h = Math.floor(min / 60);
const m = Math.round(min % 60);
return ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")};
}

/** "HH:MM" -> minutes-from-midnight, or NaN when unparseable */
export function parseTime(value: string): number {
const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
if (!match) return NaN;
const h = Number(match[1]);
const m = Number(match[2]);
if (h < 0 || h > 23 || m < 0 || m > 59) return NaN;
return h * 60 + m;
}

и src/data.ts
import type { Room, Booking } from "./types";

// Fictional sample data — no real campus, no real people
export const ROOMS: Room[] = [
{ id: "R1", name: "Allen Hall 101", building: "Allen Hall", capacity: 40, blocked: false },
{ id: "R2", name: "Allen Hall 102", building: "Allen Hall", capacity: 30, blocked: true },
{ id: "R3", name: "Bexar Lab 220", building: "Bexar Lab", capacity: 25, blocked: false },
{ id: "R4", name: "Bexar Lab 310", building: "Bexar Lab", capacity: 50, blocked: false },
{ id: "R5", name: "Cass Library Annex", building: "Cass Library", capacity: 12, blocked: false },
{ id: "R6", name: "Cass Library Quiet Room", building: "Cass Library", capacity: 8, blocked: true },
{ id: "R7", name: "Drew Hall 105", building: "Drew Hall", capacity: 20, blocked: false },
];

// Times stored as minutes-from-midnight
export const BOOKINGS: Booking[] = [
{ id: "B1", roomId: "R1", start: 9 * 60, end: 10 * 60 + 30, bookedBy: "Prof. Acosta" },
{ id: "B2", roomId: "R1", start: 14 * 60, end: 15 * 60, bookedBy: "Dept. Seminar" },
{ id: "B3", roomId: "R3", start: 11 * 60, end: 12 * 60, bookedBy: "Study Group A" },
{ id: "B4", roomId: "R4", start: 13 * 60, end: 14 * 60 + 30, bookedBy: "Lab Session" },
{ id: "B5", roomId: "R5", start: 15 * 60, end: 16 * 60, bookedBy: "Reading Circle" },
{ id: "B6", roomId: "R3", start: 16 * 60, end: 17 * 60, bookedBy: "Office Hours" },
{ id: "B7", roomId: "R4", start: 9 * 60 + 30, end: 11 * 60, bookedBy: "Workshop" },
{ id: "B8", roomId: "R7", start: 10 * 60, end: 11 * 60, bookedBy: "Morning Lecture" },
];
~~~~

**Response:**

~~~~text
Here is my review of the pasted `booking_v1.py`, `src/availability.ts`, and `src/data.ts` against AC1–AC6. Note: `src/types.ts` is imported by two files but was not included, so I'm inferring `Room`, `Booking`, and `Verdict` from usage. I'm reviewing the code as pasted; the project on disk still contains the earlier single-room app.
Findings

1. AC1 — `checkAvailability` never checks `start >= 0` (or `end >= 0`). The AC1 block validates `end > DAY_END`, `start >= end`, and `start <= currentTime`, but there is no lower-bound check. A call with `start = -30, end = 60, currentTime = -60` would add zero AC1 reasons. From the UI this is unreachable (`parseTime` returns 0–1439), but as a pure function the contract `0 <= start` is unenforced.
2. AC1 — `parseTime` rejects "24:00", so `end = 1440` is unreachable from the UI. AC1 permits `end <= 1440`, but `parseTime` guards `h > 23` → `return NaN`. A user typing 24:00 in the end-time `<input type="time">` gets `NaN`, which becomes "Start and end times are required" — a misleading message for a value the AC explicitly allows.
3. AC1 — clearing the "Current time" input silently disables the start-after-now rule. `currentStr = ""` → `parseTime("")` → `NaN` → `currentTime = NaN`. Inside `checkAvailability`, `start <= currentTime` evaluates to `false` for any `start` (NaN comparisons are always false), so "Start time must be after the current time" is never pushed. A slot with `start = 09:00` would be judged available even if the real clock is 14:00. There is no `Number.isFinite(currentTime)` guard anywhere.
4. AC4 — the overlap block is gated on `start >= 0 && end <= DAY_END`, which AC1 never enforces. The guard `if (room && !room.blocked && start < end && start >= 0 && end <= DAY_END)` means a negative `start` skips overlap detection entirely. Combined with finding #1, a direct call with `start = -30, end = 30, currentTime = -60, blocked = false` on a room that has a booking at 0–60 would return `{ kind: "available" }` — a false positive. Not exploitable through the UI, but a correctness gap in the pure function.
5. AC6 — validation errors and genuine unavailability share one "Unavailable" panel. `checkAvailability` pushes both invalid-input reasons ("Start time must be earlier than end time") and real conflicts ("Overlaps existing booking…") into the same `reasons` array, rendered identically under a red "Unavailable" header in `VerdictPanel`. A user who enters `start >= end` sees "Unavailable" rather than a form-validation message, blurring "your input is wrong" with "the room is taken."
6. AC1 (message completeness) — the `start <= currentTime` check is guarded by `start < end`. The condition `if (start <= currentTime && start < end)` suppresses the "after current time" reason when `start >= end`. If a user enters `start = 08:00, end = 07:00, currentTime = 09:00`, only "Start time must be earlier than end time" appears; the also-true "start must be after 09:00" is hidden. The outcome (unavailable) is correct, but the feedback is incomplete.
7. AC5/AC6 — `can_book` returns `False` for both invalid input and legitimate unavailability. A caller cannot distinguish "start is not after now" from "room is blocked" from "overlaps a booking." The AC5 requirement of an "unambiguous" result is satisfied at the binary level (True = available, False = unavailable), but AC6's "understandable validation messages" cannot be produced from this function alone — the caller has no way to tell the user why.
8. AC1 (Python) — no integer-type validation. `can_book` accepts floats (`can_book(9.5, 10.5, 9, False, [])` returns `True`) without checking `isinstance(start, int)`. AC1 specifies "integer minutes." This is minor if the caller guarantees integers, but the function's docstring claims to enforce AC1 and does not.
9. Python — broken indentation in the pasted source. Every `return False` line is flush-left, not indented under its `if`. As written this is a `SyntaxError` in Python. This is almost certainly a paste artifact, but if the file on disk matches, the function will not run at all.
10. Minor — `fmt` uses `Math.round(min % 60)`. For integer inputs this is harmless (`min % 60` is already integral). For a non-integer `min` like 1439.7, `Math.round(1439.7 % 60)` = `Math.round(59.7)` = 60, producing the invalid string `"23:60"`. Not reachable through the current UI, but the rounding is unnecessary and masks bad input rather than rejecting it.

Summary of what's correct: AC2 (exactly 120 allowed, `> 120` rejects), AC3 (blocked → unavailable in both implementations), AC4 overlap logic (`start < b_end && end > b_start` correctly treats endpoint-touching as non-overlap), and AC5 non-mutation (`BOOKINGS` is never written to; `rooms.find` / `bookings.filter` are read-only) are all sound. The mobile layout (single-column stack under `lg`, responsive grids) satisfies AC6's layout requirement. The most impactful issues to fix are #3 (NaN `currentTime` bypass), #1 (missing `start >= 0`), and #2 (24:00 unreachable).
~~~~

### B4

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-01
- **Stage:** Generate
- **Source:** this SIS

**Prompt:**

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

**Response:**

~~~~text
Your Smart Campus Room Availability Checker is built and verified. Here's what it does:
Room info displayed: Room A-101, current time 09:00, and one existing booking (10:00–11:00, "Faculty Meeting"). A "Room is blocked" toggle sits above the time inputs, off by default.

How it works: Enter a start and end time (24-hour, to the minute) and hit "Check availability." The page validates all the rules before showing a result:

Times must be valid, start before end, end no later than 24:00, and start strictly after 09:00.
Duration must be at most 120 minutes (exactly 120 is allowed).
If the room is blocked, everything is unavailable.
Overlapping the 10:00–11:00 booking is unavailable, but touching at an endpoint (e.g. 11:00–12:00) is fine.
Results are shown clearly in green (Available) or red (Unavailable) with specific reasons.
Validation: Invalid input shows friendly amber messages listing each issue. The layout stacks vertically on mobile with full-width inputs and buttons, and expands to a two-column grid on larger screens. No login, backend, or database — everything runs in the browser with the fixed demo data.
~~~~

### B5

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-02
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
On first load, before the user types anything, the page already shows "Please fix the following: Start time is required. End time is required." Show validation messages only after the user presses Check availability. Do not change any other behaviour or add features.
~~~~

**Response:**

~~~~text
src/App.tsx
I'll add a showErrors flag that only turns on when the user presses Check, and gate the validation panel on it. The Check button also needs to be clickable when inputs are empty (otherwise the user can't trigger the messages), so I'll remove the disabled state and handle errors inside handleCheck.

Validation messages now stay hidden until you press "Check availability." The Check button is always clickable, so pressing it with empty inputs triggers the "Please fix the following" panel. Hitting "Reset" hides the messages again. No other behavior was changed.
~~~~

### B6

- **Tool:** Bolt.new
- **Model:** not displayed
- **Date:** 2026-11-02
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
The fictional data has only one booking (10:00-11:00). Add a second booking, 11:40-12:40, to the existing bookings list so a request of 12:00-13:00 is Unavailable because it overlaps it. Do not change any other behaviour or add features.
~~~~

**Response:**

~~~~text
Added a second booking (11:40–12:40, "Student Council") to the existing bookings list. A request of 12:00–13:00 will now show as Unavailable because it overlaps that booking.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

~~~~text
nurdymbekelizat@MacBook-Air-Nurdymbek code % python3 -m unittest -v
test_blocked_room_is_rejected (test_booking.BookingTests.test_blocked_room_is_rejected) ... ok
test_empty_existing_is_allowed (test_booking.BookingTests.test_empty_existing_is_allowed) ... ok
test_end_after_midnight_is_rejected (test_booking.BookingTests.test_end_after_midnight_is_rejected) ... ok
test_end_exactly_1440_is_allowed (test_booking.BookingTests.test_end_exactly_1440_is_allowed) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed)... ok
test_existing_is_not_changed (test_booking.BookingTests.test_existing_is_not_changed) ... ok
test_gap_between_several_bookings_is_allowed (test_booking.BookingTests.test_gap_between_several_bookings_is_allowed) ... ok
test_negative_start_is_rejected (test_booking.BookingTests.test_negative_start_is_rejected) ...ok
test_new_contains_existing_is_rejected (test_booking.BookingTests.test_new_contains_existing_is_rejected) ... ok
test_new_inside_existing_is_rejected (test_booking.BookingTests.test_new_inside_existing_is_rejected) ... ok
test_one_minute_at_end_of_day_is_allowed (test_booking.BookingTests.test_one_minute_at_end_of_day_is_allowed) ... ok
test_one_minute_overlap_at_start_is_rejected (test_booking.BookingTests.test_one_minute_overlap_at_start_is_rejected) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ...ok
test_overlap_at_start_side_is_rejected (test_booking.BookingTests.test_overlap_at_start_side_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_overlap_with_second_of_several_is_rejected (test_booking.BookingTests.test_overlap_with_second_of_several_is_rejected) ... ok
test_reversed_t7 (test_booking.BookingTests.test_reversed_t7) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected) ... ok
test_same_check_twice (test_booking.BookingTests.test_same_check_twice) ... ok
test_same_interval_is_rejected (test_booking.BookingTests.test_same_interval_is_rejected) ... ok
test_second_booking_overlap_t10 (test_booking.BookingTests.test_second_booking_overlap_t10) ...ok
test_start_equal_to_now_is_rejected (test_booking.BookingTests.test_start_equal_to_now_is_rejected) ... ok
test_start_one_minute_after_now_is_allowed (test_booking.BookingTests.test_start_one_minute_after_now_is_allowed) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 26 tests in 0.003s

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

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| C4 (T10 on the page) | The page has fixed data with one booking (10:00–11:00), so the second-booking case cannot be shown; adding a second booking made T1 Unavailable. | Let the user enter bookings on the page, which would widen the scope. |
| T9 is Not testable on the page | A time above 24:00 cannot be entered. This is accepted by C4 for T8 and T9. | Keep as is. |