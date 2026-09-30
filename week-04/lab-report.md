# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Elizat Nurdymbek |
| Group | Monday 16:00 - 19:00 |
| AI assistant | ChatGPT |
| Exact model | GPT-5.6 Luna |
| Renderer | PlantUML web server |
| Behaviour diagram | sequence |
| Stories used | my week-03 stories |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** 
- Student and Administrator are authenticated before using restricted actions.
- Room availability and booking validation are handled inside the booking logic.
- Students can cancel only their own active bookings.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | UC_Cancel -> UC_Confirm | The <<include>> relationship connects cancellation to confirmation, but R4 only requires confirmation after a successful booking. | R4, US-06 | Removed the confirmation include from Cancel booking. |
| 2 | UC_Confirm | Confirmation was modeled as a separate use case, although it is an outcome of a successful booking rather than a separate user goal. | R4, US-02 | Removed the separate confirmation use case and represented confirmation as an outcome of Book room. |
| 3 | Use-case names | The original names included story IDs such as US-01: and were less concise than the required user goals. | Task 1 requirements | Renamed the use cases to View availability, Book room, Cancel booking, Block/unblock room, and Review usage. |
| 4 | Room availability assumption | The AI grouped R2 and R3 as general room availability checks, although R2 specifically concerns overlapping active bookings. | R2, R3 | Made R2 and R3 explicit in the behaviour model and kept the use-case diagram focused on user goals. |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one student makes 0..* bookings | each booking belongs to exactly 1 student | 1 / 0..* |
| Room — Booking | one room has 0..* bookings over time | each booking is for exactly 1 room | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: A note on Booking states that active bookings for the same room cannot overlap. Touching bookings are allowed.
- R1: A note on Booking states that the start time must be in the future and duration must be greater than 0 and at most 2 hours.
- R3: A note on Room states that a blocked room cannot accept a new booking.

### 4.3 Assumptions

- A1: Each booking belongs to exactly one Student and one Room.
- A2: A Student can have zero or many bookings.
- A3: A Room can have zero or many bookings over time.
- A4: Blocking a room prevents new bookings but does not cancel existing bookings.
- A5: Students can cancel only their own bookings.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Administrator class | The original diagram added Administrator as a domain class, although it was not required for the core booking domain model. | Task 2 requirements, US-04, US-05 | Removed Administrator from the revised domain class diagram. |
| 2 | Administrator — Room | The original many-to-many association was not required and was not justified by the booking domain requirements. | US-04, R3 | Removed the association. |
| 3 | Booking | The original diagram used durationHours without explicitly representing the booking end time. | R1, R2 | Added endTime: DateTime. |
| 4 | Booking | R2 was not stated as the required note on Booking. | R2	| Added an R2 note directly on Booking. |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence — it clearly shows the order of validation, availability checks, booking creation, and confirmation.

**Design components added beyond the domain model:** BookingService — validates booking rules and coordinates the reservation process; BookingRepository — checks room/booking data and saves a new booking.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | R1 validation | The original diagram showed R1 validation, but the validation result was not clearly connected to the reservation flow. | R1, US-02 | Made R1 validation an explicit step before room checks and saving. |
| 2 | R2 and R3 alternative | The original diagram combined blocked-room and overlapping-booking cases into one alternative. | R2, R3, US-02 | Made the R2 overlap check and R3 blocked-room check explicit separate steps. |
| 3 | Booking creation | The original failure branch did not explicitly show that no booking is saved when the room is unavailable. | R2, R3 | Kept save booking only in the successful created branch and returned rejection in unavailable. |
| 4 | Alternative guards | The original used descriptive guards such as R1 Validation Fails and Room is Blocked... instead of the required concise sequence guards. | Task 3 requirements | Revised the flow to use alt created and else unavailable without square brackets. |
| 5 | R4 confirmation | The original correctly showed confirmation after creation, but the revised diagram makes the R4 outcome directly visible. | R4, US-02, US-06 | Kept confirmation only after successful booking creation and labelled it (R4). |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | bookRoom() in the sequence diagram does not include studentId | The AI identified a mismatch between the sequence message and the Student–Booking relationship. | Accepted | The booking must be associated with the student who makes it. I will add studentId to the booking request. |
| 2 | BookingRepository checks whether the room is blocked | The AI said that room blocking belongs to Room, so the repository responsibility may be unclear. | Accepted | R3 concerns the room state. I will make the sequence flow clearer by checking the room status separately before checking booking overlap. |
| 3 | US-06 confirmation is not fully represented | The AI noted that US-06 mentions confirmation after booking or cancellation. | Rejected | R4 specifically requires confirmation after a successful booking. I kept confirmation as a booking outcome instead of adding an unnecessary separate use case. |
| 4 | Add an Administrator class to the domain model | The AI suggested adding Administrator because the actor performs US-04 and US-05. | Rejected | Administrator is an actor in the use-case model, but the class diagram is a domain model. The task does not require an Administrator domain class, and the checker specifically requires the core classes Student, Room, and Booking without requiring Administrator. |
| 5 | Add a Confirmation class | The AI suggested a separate class for US-06/R4. | Rejected | Confirmation is an outcome of a successful booking, not a required domain entity. Adding a class would make the model more complex without a requirement for a separate confirmation object. |
| 6 | Add separate sequence flows for US-03, US-04 and US-05 | The AI suggested modeling cancellation, room blocking, and usage review in the sequence diagram. | Rejected | Task 3 asks for one behaviour diagram for Book room. The sequence diagram is intentionally focused on US-02 and its rules R1–R4. The other use cases are traced in the consistency table rather than added to this behaviour diagram. |
| 7 | Blocking a room does not cancel existing bookings | The AI identified this as an assumption that should remain consistent. | Accepted as an assumption | This is the assumption A2 from the approved stories. R3 only states that a blocked room cannot accept a new booking, so existing bookings are not cancelled by this rule. |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book room | Booking.startTime, Booking.endTime | validate time constraints (R1) before booking creation |
| R2 | Book room | Booking, R2 note | check overlapping active bookings (R2) |
| R3 | Book room; Block/unblock room | Room.isBlocked | check room status (R3) before saving a booking |
| R4 | Book room | Booking | confirmation (R4) after booking is created |
| US-01 | View availability | Room | Room availability is viewed before booking |
| US-02 | Book room | Student, Booking, Room | bookRoom(...) -> validation -> availability checks -> save booking |
| US-03 | Cancel booking | Student, Booking | Booking.cancel() |
| US-04 | Block/unblock room | Room | Room.block() / Room.unblock() |
| US-05 | Review usage | Booking, Room | Usage information is based on room booking data |
| US-06 | Book room | Booking | confirmation (R4) after successful booking |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Use case | Included a separate Confirm Booking or Cancellation use case and connected it to both booking and cancellation. | Removed the confirmation use case and represented confirmation as an outcome of Book room. | R4 requires confirmation after a successful booking; confirmation is not a separate user goal. |
| 2 | Class | Included Administrator with personal attributes and a many-to-many Administrator — Room association; Booking used durationHours. | Removed Administrator and its association; changed Booking to use startTime and endTime; added R1, R2 and R3 notes. | The domain model focuses on the required booking entities. The revised attributes make the time constraint and overlap rule clearer. |
| 3 | Sequence | Used broad alternatives for R1, R2 and R3 and called isRoomAvailable(...) before creation. | Made R1 validation, R3 room-status checking, R2 overlap checking, booking saving and R4 confirmation explicit steps. | The revised flow makes rule validation and the successful booking path easier to trace. |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Command used:
python3 tests/check_models.py

Complete checker output:
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (5 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (2 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  3 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 5 assumption(s) declared
LR5  PASS  5 behaviour-diagram findings in §5
LR6  PASS  7 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```
```text
Command used:
python3 tests/check_models.py

Complete checker output:
Week 04 submission.yml — shape only, never quality   (submission.yml)

PASS   schema                                    1
PASS   week                                      04
PASS   student.name                              Elizat Nurdymbek
PASS   student.student_id                        24B031946
PASS   student.github                            elizat-nurdymbek
PASS   assistant.tool                            ChatGPT
PASS   assistant.model                           GPT-5.6 Luna
PASS   counts.behaviour_diagram                  sequence
PASS   counts.stories_source                     week-03
PASS   counts.use_cases                          5
PASS   counts.change_log_rows                    3
PASS   checker.pass                              37
PASS   checker.fail                              0
PASS   checker.error                             0
PASS   checker.total                             37 checks, as check_models.py runs
PASS   checker.commit                            92b3ff3
PASS   checker.kept_fails                        0 listed
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.blocking_a_booked_room        keep-bookings
PASS   traceability.use_cases_not_traced         []
PASS   traceability.rules_not_shown              []
PASS   review_findings                           3 findings, each naming an element
PASS   honesty.originals_unedited                yes
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
25 PASS · 0 FAIL · 0 ERROR   (25 fields)
SUMMARY pass=25 fail=0 error=0
The declaration can be read and graded. Your checker numbers are re-run at the commit you name.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The AI made the most important mistakes in the class and sequence diagrams. In the class diagram, it added an Administrator class and an Administrator — Room many-to-many association, although the approved domain model did not require this relationship. It also used durationHours instead of explicitly representing endTime, which made the time constraints less clear. In the sequence diagram, the original flow did not make the R2 overlap check and R3 blocked-room check sufficiently explicit before saving a booking. If nobody reviewed the sequence diagram, an incorrect booking flow could have reached implementation because the validation logic was not clearly separated from booking creation.

The critique also found useful issues, especially the missing studentId in the bookRoom() message and the unclear responsibility of BookingRepository for checking room status. However, some critique recommendations were not applicable. It suggested adding Administrator and Confirmation classes and creating sequence flows for all use cases. I rejected these changes because the class diagram is a domain model and the behaviour diagram is specifically for the Book room flow. This review showed me why AI-generated UML must be checked against the exact requirements rather than accepted automatically.