# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Elizat Nurdymbek
**Student ID:** 24B031946
**GitHub:** elizat-nurdymbek

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | ChatGPT |
| Exact model (or "not displayed") | GPT-6 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | 3.13.1 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether a room can be booked for a requested time slot. It only checks and never saves, changes or creates a booking. All times are whole minutes since midnight, from 0 to 1440 (10:00 is 600, 24:00 is 1440). The slot must start after the current time, end after it starts, last at most 120 minutes, avoid a blocked room and not overlap existing bookings (touching is allowed). Returns Available or Unavailable.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {"type": "integer", "minimum": 0, "maximum": 1440, "description": "Requested start, in whole minutes since midnight (10:00 = 600)."},
      "end": {"type": "integer", "minimum": 0, "maximum": 1440, "description": "Requested end, in whole minutes since midnight (24:00 = 1440)."},
      "now": {"type": "integer", "minimum": 0, "maximum": 1440, "description": "Current time, in whole minutes since midnight."},
      "blocked": {"type": "boolean", "description": "True if the room is blocked, false otherwise."},
      "bookings": {
        "type": "array",
        "description": "Existing bookings as objects with start and end in minutes since midnight. May be empty.",
        "items": {
          "type": "object",
          "properties": {
            "start": {"type": "integer", "minimum": 0, "maximum": 1440},
            "end": {"type": "integer", "minimum": 0, "maximum": 1440}
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| name | check_room | The model may call a tool with the wrong name. |
| description | 25+ words, minutes, 1440, does not save | The model may misunderstand the units and assume it creates bookings. |
| start | integer, minimum 0, maximum 1440 | Invalid or fractional start times may be accepted. |
| end | integer, minimum 0, maximum 1440 | Invalid end values and time strings may be accepted. |
| now | integer, minimum 0, maximum 1440 | The current time may be missing or invalid. |
| blocked | boolean | A string such as "false" may be interpreted incorrectly. |
| bookings | array | Existing bookings may have the wrong structure. |
| bookings.items | object | A booking represented as [660,720] may be accepted. |
| booking.start/end | integer, minimum 0, maximum 1440 | Booking times may be invalid. |
| booking.required | start, end | An incomplete booking may be accepted. |
| required | all five fields | A tool call may omit a required argument. |
| additionalProperties | false | The model may invent unsupported fields such as room. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | No change needed |
| S02 | PASS | PASS | No change needed |
| S03 | FAIL | PASS | Added integer type for end |
| S04 | FAIL | PASS | Added now to required fields |
| S05 | FAIL | PASS | Added additionalProperties: false |
| S06 | FAIL | PASS | Added minimum: 0 |
| S07 | FAIL | PASS | Added maximum: 1440 |
| S08 | FAIL | PASS | Required start and end in each booking |
| S09 | FAIL | PASS | Added boolean type for blocked |
| S10 | FAIL | PASS | Added integer type for time values |
| S11 | PASS | PASS | No change needed |
| S12 | FAIL | PASS | Added object type for booking items |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->
Match: YES. All values match the request: 9:00 = 540 (now), 10:00 = 600 (start), 11:00 = 660 (end), and the existing booking from 11:00 to 12:00 = 660–720. The model correctly represented bookings as an object containing start and end. The existing booking starts exactly when the requested slot ends. These intervals only touch, so the request is valid under AC4. No values were invented.

### R2

```text
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->
Match: YES. The model correctly converted the times: 13:30 = 810, 14:00 = 840, and 16:30 = 990. It also correctly set blocked to true and used an empty bookings array. The model should call the tool even when the room is blocked because the function is responsible for returning the availability result. The requested slot lasts 150 minutes, which exceeds the 120-minute limit. Therefore, the function should return Unavailable for two reasons: AC2 (duration limit) and AC3 (blocked room). The schema validates the integer values but cannot check the duration rule. No values were invented.

### R3

```text
What time tomorrow afternoon would you like the room (start and end time)?
```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->
The model asked a clarification question instead of calling the tool. This was reasonable because the request did not provide exact start and end times. However, other required arguments were also missing: now, blocked, and bookings. The model asked only about the requested time, so additional information would still be needed before all five arguments could be filled.
The phrase “a couple of hours” suggests an approximate duration of 120 minutes, but “afternoon” does not specify an exact time. The word “tomorrow” also cannot be represented by the current tool schema because it has no date field; now is expressed only as minutes since midnight. The model did not invent any values, but its clarification question was incomplete.

## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->

The JSON schema checks the structure and basic types of the input, but it cannot verify every business rule.

- For AC1, the schema can check that start and end are integers between 0 and 1440 using minimum and maximum. However, it cannot compare the two fields. For example, start: 600 and end: 600 can still pass schema validation, even though the start must be earlier than the end. It also cannot check whether start is later than now.
- For AC2, the duration must not exceed 120 minutes. This requires calculating end - start, which the schema cannot do. For example, the R2 interval from 840 to 990 lasts 150 minutes, but both values are valid integers within the allowed range.
- For AC4, the requested interval must be compared with every booking in the bookings array. The schema cannot perform these comparisons or determine whether two intervals overlap. The function must handle this rule while allowing intervals that only touch.
- The schema also cannot decide whether a room is actually unavailable under AC3. It can only check that blocked is a boolean. AC5 requires checking the function's behavior to ensure it does not change or save data. AC6 concerns feedback displayed by the page, so it must be tested through the user interface.
- Therefore, the schema validates the form of the input, while canBook must validate its meaning and business rules.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | The check_room tool is read-only and does not create or modify bookings. It is safe to call when all required arguments are available and valid. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading booking.ts inside the project's own repository only inspects existing code and does not change the working files. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | Increasing the limit from 120 to 180 minutes changes the business rule in AC2. The specification owner should approve this change because existing tests and documentation would no longer match. |
| A4 | run `npm test` in `week-08/app` | allow | Running npm test in the known week-08/app folder is a reasonable local verification step. The command executes project scripts, so it should remain limited to this trusted project directory. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | git reset --hard can discard uncommitted changes in tracked files, including work that belongs to the user rather than the agent. Confirmation is needed before using it. |
| A6 | `git commit` its change on the `week-09` branch | allow | Creating a commit on the dedicated week-09 branch is a local and reviewable action. It does not publish changes to the shared main branch. |
| A7 | `git push` to `main` | block | Pushing directly to main bypasses the required pull request review and violates the instruction not to merge the submission. |
| A8 | send the contents of `.env` to an MCP server it found online | block | An unknown external MCP server is not a trusted destination for .env contents. The file may contain API keys or tokens, so sending it could expose secrets. |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline), the exact command that returns you to it, and what that command would throw away. -->

**Checkpoint commit:** `e824244` (HEAD -> week-09) Week 09: checkpoint before agent edits
git commit --allow-empty after the working tree was clean.

**Exact restore command:**

```bash
git reset --hard e824244
```

This command resets the current branch, staging area, and tracked working files to the checkpoint commit. It discards tracked uncommitted changes and removes later commits from the current branch history. Later commits may still be recoverable temporarily through `git reflog`. Untracked files are not removed by this command.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
nurdymbekelizat@MacBook-Air-Nurdymbek week-09 % python3 tests/check_tool.py
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->
None

## 10. Conclusion (80–150 words)

During this lab, I learned that a tool definition, a model and a function have different responsibilities. The JSON schema checks the input structure, data types and basic limits, but it cannot enforce every business rule. For example, in R2, the model correctly converted 14:00–16:30 into 840–990 minutes and called the tool, even though the room was blocked. The interval also lasted 150 minutes, exceeding the 120-minute limit. The function must evaluate these conditions and return the correct result. The model's responsibility is to understand the request, provide accurate arguments and ask questions when information is missing, as it did in R3. I also learned that permissions matter: reading files is low-risk, while exposing `.env` contents must be blocked.
