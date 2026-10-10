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

    # AC4: Check for interval overlaps with existing bookings
    # Two half-open intervals [start, end) and [b_start, b_end) overlap iff
    # start < b_end and end > b_start.
    for b_start, b_end in existing:
        if start < b_end and end > b_start:
            return False

    # AC5: Return True only if all criteria (AC1-AC4) are satisfied
    return True