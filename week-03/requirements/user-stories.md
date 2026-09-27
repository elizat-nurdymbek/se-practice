# User stories — Smart Campus study room booking

6 to 8 stories. Keep the shape exactly: ID, the As/I want/so that sentence, a priority, one
assumption. Roles are **Student** or **Administrator** only.

---

### US-01
**Story:** As a Student, I want to view available study rooms and time slots, so that I can choose a suitable room for my individual or group study.
**Priority:** High 
**Assumption:** Students can view the availability of rooms before making a booking.

### US-02
**Story:** As a Student, I want to book an available study room for a future time slot, so that I can reserve a room for my individual or group study.
**Priority:** High
**Assumption:** A booking must start in the future, may last exactly two hours, must not overlap another booking, and cannot be made for a blocked room. Bookings that touch at their start or end time are allowed.

### US-03
**Story:** As a Student, I want to cancel my booking, so that the room becomes available for other students when I no longer need it.
**Priority:** High
**Assumption:** A student can cancel a booking that they previously made.

### US-04
**Story:** As an Administrator, I want to block or unblock a study room, so that I can keep unavailable rooms from being booked and return usable rooms to service.
**Priority:** High
**Assumption:** Administrators can change the availability status of study rooms.

### US-05
**Story:** As an Administrator, I want to review study room usage over a period, so that I can understand how the rooms are being used.
**Priority:** Medium
**Assumption:** Usage information is available for the administrator to review.

### US-06
**Story:** As a Student, I want to receive a confirmation after booking or cancelling a room, so that I know whether my action was successfully completed.
**Priority:** Medium
**Assumption:** The system sends a confirmation when a booking or cancellation is completed.