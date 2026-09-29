# Approved stories — Smart Campus study room booking

> **Replace this file's stories with your own Week 03 stories, as revised after review**
> (`week-03/requirements/user-stories.md`), keeping their IDs. If you did not complete Week 03, or
> your set was rejected in review, keep the reference set below and say so in `lab-report.md` §1.
> Either way, the IDs here are the ones your consistency table (§7) must use.

**Source of this set:** <my week-03 stories, revised>

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## Reference set

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to view available study rooms and time slots, so that I can choose a suitable room for my individual or group study. | - |
| US-02 | As a Student, I want to book an available study room for a future time slot, so that I can reserve a room for my individual or group study. | R1, R2, R3 |
| US-03 | As a Student, I want to cancel my booking, so that the room becomes available for other students when I no longer need it. | - |
| US-04 | As an Administrator, I want to block or unblock a study room, so that I can keep unavailable rooms from being booked and return usable rooms to service. | R3 |
| US-05 | As an Administrator, I want to review study room usage over a period, so that I can understand how the rooms are being used. | - |
| US-06 | As a Student, I want to receive a confirmation after booking or cancelling a room, so that I know whether my action was successfully completed. | R4 |

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists, notifications other than the booking confirmation, user registration.