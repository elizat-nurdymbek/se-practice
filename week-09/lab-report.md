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
| Three fresh chats for R1, R2, R3? (yes / no) | |
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

```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->

### R2

```text

```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->

### R3

```text

```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->

## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | | |
| A2 | read `week-08/app/src/booking.ts` | | |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | | |
| A4 | run `npm test` in `week-08/app` | | |
| A5 | run `git reset --hard` to undo its own last three edits | | |
| A6 | `git commit` its change on the `week-09` branch | | |
| A7 | `git push` to `main` | | |
| A8 | send the contents of `.env` to an MCP server it found online | | |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text

```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
