import unittest
from booking import can_book

NOW = 540
EXISTING = [(600, 660)]


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)

    def test_overlap_is_rejected(self):  # AC4
        self.assertIs(can_book(630, 690, NOW, False, EXISTING), False)

    def test_blocked_room_is_rejected(self):  # AC3
        self.assertIs(can_book(660, 720, NOW, True, EXISTING), False)

    def test_exactly_two_hours_is_allowed(self):  # AC2
        self.assertIs(can_book(720, 840, NOW, False, EXISTING), True)

    def test_over_two_hours_is_rejected(self):  # AC2
        self.assertIs(can_book(720, 841, NOW, False, EXISTING), False)

    def test_start_equal_to_now_is_rejected(self):  # AC1
        self.assertIs(can_book(540, 570, NOW, False, EXISTING), False)
    # zero-length and reversed times
    def test_zero_length_is_rejected(self):  # AC1: start < end
        self.assertIs(can_book(700, 700, NOW, False, []), False)

    def test_reversed_times_are_rejected(self):  # AC1: start < end
        self.assertIs(can_book(700, 680, NOW, False, []), False)

    # day bounds
    def test_end_after_midnight_is_rejected(self):  # AC1: end <= 1440 (duration is 41)
        self.assertIs(can_book(1400, 1441, NOW, False, []), False)

    def test_end_exactly_1440_is_allowed(self):  # AC1: end = 1440 is fine
        self.assertIs(can_book(1380, 1440, NOW, False, []), True)

    def test_negative_start_is_rejected(self):  # AC1: 0 <= start (also start > now)
        self.assertIs(can_book(-10, 30, 0, False, []), False)

    def test_start_one_minute_after_now_is_allowed(self):  # AC1: start > now
        self.assertIs(can_book(541, 600, NOW, False, EXISTING), True)

    # empty list and several bookings
    def test_empty_existing_is_allowed(self):  # AC4
        self.assertIs(can_book(600, 660, NOW, False, []), True)

    def test_gap_between_several_bookings_is_allowed(self):  # AC4
        existing = [(600, 660), (700, 760), (800, 860)]
        self.assertIs(can_book(660, 700, NOW, False, existing), True)

    def test_overlap_with_second_of_several_is_rejected(self):  # AC4
        existing = [(600, 660), (700, 760), (800, 860)]
        self.assertIs(can_book(750, 810, NOW, False, existing), False)

    # other overlap relationships
    def test_same_interval_is_rejected(self):  # AC4
        self.assertIs(can_book(600, 660, NOW, False, EXISTING), False)

    def test_new_inside_existing_is_rejected(self):  # AC4
        self.assertIs(can_book(610, 640, NOW, False, EXISTING), False)

    def test_new_contains_existing_is_rejected(self):  # AC4
        self.assertIs(can_book(590, 700, NOW, False, EXISTING), False)

    def test_overlap_at_start_side_is_rejected(self):  # AC4
        self.assertIs(can_book(570, 610, NOW, False, EXISTING), False)

    def test_one_minute_overlap_at_start_is_rejected(self):  # AC4
        self.assertIs(can_book(559, 601, NOW, False, EXISTING), False)

    def test_touching_start_is_allowed(self):  # AC4
        self.assertIs(can_book(570, 600, NOW, False, EXISTING), True)

    # unchanged input
    def test_existing_is_not_changed(self):  # AC5
        existing = [(700, 760), (600, 660)]
        copy = list(existing)
        can_book(660, 700, NOW, False, existing)
        self.assertEqual(existing, copy)
        
    # new edge case added in Part 4
    def test_one_minute_at_end_of_day_is_allowed(self):  # AC1
        self.assertIs(can_book(1439, 1440, 1438, False, []), True)

if __name__ == "__main__":
    unittest.main()
