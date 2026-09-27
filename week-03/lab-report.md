# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a missing heading reads as a missing section.

Name: Elizat Nurdymbek
Student ID: 24B031946
GitHub username: elizat-nurdymbek

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | ChatGPT |
| Exact model name and version | GPT-5.6 Luna |
| Date of the session | 27.09.2026 |
| Diagram renderer used | PlantUML |

One tool and one model for all three prompts. If you switched, say why here — it changes what your findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

1. As a Student, I want to view available study rooms and time slots, so that I can choose a suitable room for my individual or group study.
   Priority: High
   Assumption: Students can view the availability of rooms before making a booking.

2. As a Student, I want to book an available study room for a future time slot, so that I can reserve a room for my individual or group study.
   Priority: High
   Assumption: A student can book a room only if the selected time slot is available and does not overlap another booking.

3. As a Student, I want to cancel my booking, so that the room becomes available for other students when I no longer need it.
   Priority: High
   Assumption: A student can cancel a booking that they previously made.

4. As an Administrator, I want to block or unblock a study room, so that I can keep unavailable rooms from being booked and return usable rooms to service.
   Priority: High
   Assumption: Administrators can change the availability status of study rooms.

5. As an Administrator, I want to review study room usage over a period, so that I can understand how the rooms are being used.
   Priority: Medium
   Assumption: Usage information is available for the administrator to review.

6. As a Student, I want to receive a confirmation after booking or cancelling a room, so that I know whether my action was successfully completed.
   Priority: Medium
   Assumption: The system sends a confirmation when a booking or cancellation is completed.

7. As an Administrator, I want to see which study rooms are available, so that I can monitor room availability.
   Priority: Low
   Assumption: Administrators can access current study room availability.

8. As a Student, I want to book a study room for no more than two hours, so that my reservation follows the booking duration rule.
   Priority: Medium
   Assumption: The maximum allowed booking duration is two hours.

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| 1. Student — view available rooms | Kept unchanged | Clear goal, correct stakeholder, testable and in scope. | US-01 |
| 2. Student — book an available room | Rewrote | The story should cover all booking rules, not only availability and overlap. | US-02 |
| 3. Student — cancel my booking | Kept unchanged | Clear outcome, correct stakeholder and in scope. | US-03 |
| 4. Administrator — block or unblock a room | Kept unchanged | Correct stakeholder and matches UC-04. | US-04 |
| 5. Administrator — review room usage | Kept unchanged | Clear goal and matches UC-05. | US-05 |
| 6. Student — receive confirmation | Rewrote | Kept within UC-06 and avoided adding other notification types. | US-06 |
| 7. Administrator — see room availability | Deleted | Duplicates the Student availability story. | - |
| 8. Student — book for no more than two hours | Merged into Story 2 | The two-hour limit is a booking rule, not a separate goal. | - |

**Did the assistant invent anything outside the scenario?** 
No. I checked the stories against the out-of-scope list. No out-of-scope functions were added.

**How many stories did you end with, and why that number?**
I kept 6 stories. I removed one duplicate and merged the two-hour booking story into the main booking story.

---

## 4. Original AI output — acceptance criteria (Part 3)

# Acceptance Criteria — Three Selected Stories

## Assumptions

* A booking must start in the future.
* The maximum booking duration is 2 hours.
* A room cannot have two overlapping bookings.
* A blocked room cannot be booked.
* A student can cancel only their own booking.

---

## US-01 — View availability

### AC-01 — Show available rooms

**Given** the student selects a future date and time
**When** the student checks room availability
**Then** the system shall display rooms that are available for the selected time.

### AC-02 — Show unavailable rooms

**Given** a room already has a booking during the selected time
**When** the student checks availability
**Then** the system shall show that the room is unavailable.

### AC-03 — Show blocked rooms

**Given** a room is blocked by an administrator
**When** the student checks availability
**Then** the system shall indicate that the room is blocked and cannot be booked.

### AC-04 — Reject past time

**Given** the student selects a time in the past
**When** the student checks availability
**Then** the system shall show a validation message and not allow the availability search.

---

## US-02 — Book room

### AC-01 — Successfully book an available room

**Given** the student selects an available room and a future time
**When** the booking duration is no more than 2 hours and there is no overlapping booking
**Then** the system shall create the booking and confirm it to the student.

### AC-02 — Reject booking in the past

**Given** the student selects a time in the past
**When** the student tries to book the room
**Then** the system shall reject the booking and display a validation message.

### AC-03 — Reject booking longer than 2 hours

**Given** the student selects a future booking time
**When** the requested duration is more than 2 hours
**Then** the system shall reject the booking and display a message that the maximum duration is 2 hours.

### AC-04 — Reject overlapping booking

**Given** the selected room already has a booking during the requested time
**When** the student tries to book the room
**Then** the system shall reject the booking and inform the student that the room is unavailable.

### AC-05 — Reject blocked room

**Given** the selected room is blocked by an administrator
**When** the student tries to book the room
**Then** the system shall reject the booking and inform the student that the room cannot be booked.

---

## US-03 — Cancel booking

### AC-01 — Successfully cancel a booking

**Given** the student has an existing booking
**When** the student selects the booking and chooses to cancel it
**Then** the system shall cancel the booking and make the room available for that time.

### AC-02 — Confirm cancellation

**Given** the student chooses to cancel an existing booking
**When** the cancellation is completed
**Then** the system shall display a confirmation that the booking has been cancelled.

### AC-03 — Prevent cancellation of another student's booking

**Given** the selected booking belongs to another student
**When** the student tries to cancel it
**Then** the system shall reject the action and display an error message.

### AC-04 — Handle non-existing booking

**Given** the selected booking no longer exists
**When** the student tries to cancel it
**Then** the system shall display an error message and not perform the cancellation.

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| US-01 AC-04 - Reject past time | The criterion is valid, but the result should clearly state that the selected time must be in the future. | Clarified the validation result and kept the criterion | US-01 AC-04 |
| US-02 AC-01 — Successfully book an available room | The criterion does not explicitly confirm that exactly 2 hours is allowed. | Added a separate boundary criterion for a booking of exactly 2 hours. | US-02 AC-02 |
| US-02 AC-03 — Reject booking in the past | The rule is correct, but the reason for rejection should clearly refer to the future-start requirement. | Clarified the expected validation result. | US-02 AC-03 |
| US-02 AC-04 — Reject overlapping booking | The generated criterion does not distinguish a real overlap from two bookings that only touch at their boundaries. | Added the boundary decision to the assumptions and treated touching bookings as allowed. | US-02 AC-01 / Assumptions |
| US-02 AC-05 — Reject blocked room | The criterion combines two different error conditions: overlapping and blocked rooms. | Kept the rule but made the condition clearer by stating that either condition causes rejection. | US-02 AC-05|
| US-03 AC-03 — Prevent cancellation of another student's booking | The generated criterion is useful, but the expected result should explicitly say that the booking remains unchanged. | Added that the action must not cancel the booking. | US-03 AC-03 |

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | The two bookings do not use the room at the same time, so they do not overlap. |
| Is exactly two hours allowed under R2? | allowed | R2 states that the maximum duration is two hours, so a duration of exactly two hours is within the limit. |

**Which invalid or boundary case did the assistant leave out?**
The assistant did not explicitly cover the boundary case where one booking ends exactly when another booking begins. It also did not explicitly test a booking with exactly two hours duration. I added both decisions to the assumptions and added a separate acceptance criterion for exactly two hours.

---

## 6. Original AI output — use-case diagram (Part 4)

@startuml
left to right direction

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
    usecase "UC-01\nView availability" as UC01
    usecase "UC-02\nBook room" as UC02
    usecase "UC-03\nCancel booking" as UC03
    usecase "UC-04\nBlock or unblock room" as UC04
    usecase "UC-05\nReview usage" as UC05
    usecase "UC-06\nSend confirmation" as UC06
}

Student --> UC01
Student --> UC02
Student --> UC03

Administrator --> UC04
Administrator --> UC05

UC02 ..> UC06 : <<include>>

@enduml

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| Student -> View availability | Correct association because the Student needs to view available rooms. | Kept unchanged |
| Student -> Book room | Correct because the Student is the person who makes a room reservation. | Kept unchanged | 
| Student -> Cancel booking | Correct because the Student cancels their own booking. | Kept unchanged |
| Administrator -> Block or unblock room | Correct because the Administrator manages room availability status. | Kept unchanged |
| Administrator -> Review usage | Correct because the Administrator reviews room usage. | Kept unchanged |
| UC-02 -> UC-06 <<include>> | The diagram makes Send confirmation an included part of every booking, but UC-06 also covers confirmation after cancellation. The relationship therefore does not fully represent the stated use case. | Removed the <<include>> relationship. Send confirmation remains a separate use case.|
| Student -> Send confirmation | No direct actor association is needed because the system sends the confirmation; the Student receives it rather than triggering this system function. | No actor association added |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually trigger? Name them.
The assistant did not draw an unjustified actor–use-case association. The five actor associations are justified by the responsibilities of Student and Administrator. The incorrect relationship was between two use cases: UC-02 Book room and UC-06 Send confirmation.

**Did any screen, database or internal component appear as a use case or an actor?**
No. The diagram contains only the two specified actors and the six business use cases. No screens, databases, servers, or internal classes/components were included.

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them: nonne
- Stories with **no use case** they belong to: none
- Criteria that test **no rule** from section 1: none

**What does the largest gap tell you about the generated requirements?**
The largest gap is that UC-04 Block or unblock room and UC-05 Review usage have stories but no selected acceptance criteria. This shows that the generated requirements cover the main student booking flow more completely than the administrator functions, so additional criteria would be needed for full coverage. 

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

python3 tests/check_requirements.py
PASS   US-1  user-stories.md         no placeholders left
PASS   US-2  user-stories.md         6 stories, IDs US-01…US-06
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
PASS   US-7  user-stories.md         nothing from the out-of-scope list appears
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-01, US-02, US-03
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 13 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  5 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
23 PASS · 0 FAIL · 0 ERROR   (23 checks)
Shape is clean. This says nothing about whether the requirements are good.

python3 tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Elizat Nurdymbek
PASS   student.student_id                        24B031946
PASS   student.github                            elizat-nurdymbek
PASS   assistant.tool                            ChatGPT
PASS   assistant.model                           GPT-5.6 Luna
PASS   counts.user_stories                       6
PASS   counts.acceptance_criteria_sets           3
PASS   checker                                   23 PASS · 0 FAIL · 0 ERROR
NOTE   checker                                   you are claiming a clean run — it will be re-run at your commit, so make sure it is true
PASS   checker.commit                            616779a
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        UC-04, UC-05
PASS   traceability.stories_not_traced           []
PASS   review_findings                           5 findings
PASS   review_findings[1]                        US-02: booking story was revised to include all booking rule…
PASS   review_findings[2]                        AC-02: exactly two hours was added as an explicit allowed bo…
PASS   review_findings[3]                        UC-06: the unjustified include relationship was removed from…
PASS   review_findings[4]                        UC-04: no selected acceptance criteria directly test block o…
PASS   review_findings[5]                        UC-05: no selected acceptance criteria directly test review …
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
23 PASS · 0 FAIL · 0 ERROR · 1 note
Shape is fine. This says nothing about whether the work is good.

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | 23 | 0 | 0 |

Commit these numbers were produced at (`git rev-parse --short HEAD`): 616779a

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and explain costs you nothing.
None. The checker completed with 23 PASS, 0 FAIL, and 0 ERROR.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it has to be said.
No. Both required checks were run using Python.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the room. Which single one would you rewrite first, and why?

1. The most problematic part of the generated requirements was the use-case diagram, especially the relationship between UC-02 Book room and UC-06 Send confirmation. The original AI output used <<include>> from Book room to Send confirmation, although confirmation also applies to cancellation. I caught this by reviewing whether each relationship matched an actual user action, rather than relying only on the checker. The checker confirmed that the diagram structure was valid, but the review was necessary to identify the requirement issue.

2. The assistant was useful for generating the initial six to eight user stories and the acceptance criteria in a consistent format. Producing the Given/When/Then criteria for 13 cases, including invalid and boundary cases, would have taken me noticeably longer by hand. It also generated a complete PlantUML structure quickly.

3. If I were handing these requirements to an implementer, I would rewrite US-02 Book room first. It is the most rule-heavy requirement because it depends on future start time, the two-hour maximum, overlap handling, and blocked rooms. I would make these conditions especially explicit because misunderstandings there could affect the actual booking logic.