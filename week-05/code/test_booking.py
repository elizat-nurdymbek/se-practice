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


if __name__ == "__main__":
    unittest.main()
