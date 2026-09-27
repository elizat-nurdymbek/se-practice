# Acceptance criteria — three selected stories

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer is not.

- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because the two bookings do not overlap.
- **Duration:** a booking of exactly two hours is allowed under R2, because the maximum duration is two hours.
- A student can cancel only their own booking.
- A booking must start in the future.
- A blocked room cannot be booked.

---

## US-01 — View availability

### AC-01 - Show available rooms
- **Given** the student selects a future date and time
- **When** the student checks room availability
- **Then** the system shall display rooms that are available for the selected time.

### AC-02 — Show unavailable rooms
- **Given** a room already has a booking during the selected time
- **When** the student checks availability
- **Then** the system shall show that the room is unavailable.

### AC-03 — Show blocked rooms
- **Given** a room is blocked by an administrator
- **When** the student checks availability
- **Then** the system shall indicate that the room is blocked and cannot be booked.

### AC-04 — Reject past time
- **Given** the student selects a time in the past
- **When** the student checks availability
- **Then** the system shall reject the request and indicate that the selected time must be in the future.
---

## US-02 — Book room

### AC-05 — Successfully book an available room
- **Given** the student selects an available room and a future start time
- **When** the requested duration is no more than 2 hours and there is no overlapping booking
- **Then** the system shall create the booking and confirm it to the student.

### AC-06 — Allow exactly 2 hours
- **Given** the student selects an available room and a future start time
- **When** the requested booking duration is exactly 2 hours
- **Then** the system shall allow the booking.

### AC-07 — Reject booking in the past
- **Given** the student selects a time in the past
- **When** the student tries to book the room
- **Then** the system shall reject the booking and indicate that the booking must start in the future.

### AC-08 — Reject booking longer than 2 hours
- **Given** the student selects a future booking time
- **When** the requested duration is more than 2 hours
- **Then** the system shall reject the booking and indicate that the maximum duration is 2 hours.

### AC-09 — Reject overlapping or blocked booking
- **Given** the selected room is already booked during the requested time or is blocked by an administrator
- **When** the student tries to book the room
- **Then** the system shall reject the booking.

---

## US-03 — Cancel booking

### AC-10 — Successfully cancel a booking
- **Given** the student has an existing booking
- **When** the student selects the booking and chooses to cancel it
- **Then** the system shall cancel the booking and make the room available for that time.

## AC-11 — Confirm cancellation
- **Given** the student chooses to cancel an existing booking
- **When** the cancellation is completed
- **Then** the system shall confirm that the booking has been cancelled.

### AC-12 — Prevent cancellation of another student's booking
- **Given** the selected booking belongs to another student
- **When** the student tries to cancel it
- **Then** the system shall reject the action and not cancel the booking.

### AC-13 — Handle non-existing booking
- **Given** the selected booking no longer exists
- **When** the student tries to cancel it
- **Then** the system shall reject the action and not perform the cancellation.