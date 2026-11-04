import { describe, expect, it } from 'vitest';
import { canBook, type Interval } from './booking';

describe('canBook() unit tests', () => {
  // Fixed current time for every test: 09:00
  const NOW = 540;

  // Fresh default fixture for every test: one booking 10:00–11:00
  const makeBookings = (): Interval[] => [{ start: 600, end: 660 }];

  // ---------------------------------------------------------------------------
  // AC1: 0 <= start < end <= 1440 and start is after now
  // ---------------------------------------------------------------------------
  describe('AC1: Time Interval Validity', () => {
    it('T02 AC1: returns false when start equals now', () => {
      expect(
        canBook({ start: 540, end: 570, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });

    it('T03 AC1: returns false for zero duration (start === end)', () => {
      expect(
        canBook({ start: 720, end: 720, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });

    it('T04 AC1: returns false when start is later than end (reversed)', () => {
      expect(
        canBook({ start: 750, end: 720, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });

    it('T05 AC1: returns false when end is past the end of the day (1441)', () => {
      expect(
        canBook({ start: 1380, end: 1441, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });

    it('X1 AC1: returns true when end is exactly 1440 (24:00)', () => {
      expect(
        canBook({ start: 1380, end: 1440, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(true);
    });

    it('X3 AC1: a negative start is rejected (now = -10 so only 0 <= start can fail)', () => {
      expect(
        canBook({ start: -1, end: 60, now: -10, blocked: false, bookings: [] })
      ).toBe(false);
    });

    it('X4 AC1: a booking starting one minute after now is accepted', () => {
      expect(
        canBook({ start: 541, end: 542, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // AC2: a booking longer than 120 minutes is rejected
  // ---------------------------------------------------------------------------
  describe('AC2: Maximum Duration Limit', () => {
    it('T06 AC2: returns true for exactly 120 minutes', () => {
      expect(
        canBook({ start: 720, end: 840, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(true);
    });

    it('T07 AC2: returns false for 121 minutes', () => {
      expect(
        canBook({ start: 720, end: 841, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // AC3: a blocked room is rejected
  // ---------------------------------------------------------------------------
  describe('AC3: Blocked Room', () => {
    it('T13 AC3: returns false when the room is blocked, although the slot is valid', () => {
      expect(
        canBook({ start: 660, end: 720, now: NOW, blocked: true, bookings: makeBookings() })
      ).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // AC4: overlap with an existing booking is rejected; touching is allowed
  // ---------------------------------------------------------------------------
  describe('AC4: Existing Bookings Overlap', () => {
    it('T01 AC4: returns true when touching the existing booking after (660–720)', () => {
      expect(
        canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(true);
    });

    it('T08 AC4: returns true when touching the existing booking before (570–600)', () => {
      expect(
        canBook({ start: 570, end: 600, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(true);
    });

    it('T09 AC4: returns false for a partial overlap (630–690)', () => {
      expect(
        canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });

    it('T10 AC4: returns false when the request contains the existing booking (570–690)', () => {
      expect(
        canBook({ start: 570, end: 690, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });

    it('T11 AC4: returns false when the request is inside the existing booking (615–645)', () => {
      expect(
        canBook({ start: 615, end: 645, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });

    it('T12 AC4: returns false for an identical interval (600–660)', () => {
      expect(
        canBook({ start: 600, end: 660, now: NOW, blocked: false, bookings: makeBookings() })
      ).toBe(false);
    });

    it('T14 AC4: returns true when there are no existing bookings', () => {
      expect(
        canBook({ start: 630, end: 690, now: NOW, blocked: false, bookings: [] })
      ).toBe(true);
    });

    it('X2 AC4: returns true when the request touches two bookings and overlaps neither', () => {
      const bookings: Interval[] = [
        { start: 600, end: 660 },
        { start: 720, end: 780 },
      ];
      expect(
        canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings })
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // AC5: checking availability does not change the existing booking data
  // ---------------------------------------------------------------------------
  describe('AC5: Data Preservation', () => {
    it('AC5: an Available request leaves the existing bookings unchanged', () => {
      const bookings = makeBookings();
      const before = structuredClone(bookings);

      const decision = canBook({ start: 720, end: 780, now: NOW, blocked: false, bookings });

      expect(decision).toBe(true);
      expect(bookings).toEqual(before);
    });
  });
});