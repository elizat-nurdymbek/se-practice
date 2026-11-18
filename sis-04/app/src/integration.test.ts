import { test, expect } from 'vitest';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import type { Room } from './rooms';

const CAT: Room[] = [
  { id: 'a', name: 'A', capacity: 8, equipment: ['projector'],
    blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b', name: 'B', capacity: 12, equipment: ['projector', 'whiteboard'],
    blocked: false, bookings: [] },
  { id: 'c', name: 'C', capacity: 20, equipment: ['projector'],
    blocked: true, bookings: [] },
  { id: 'd', name: 'D', capacity: 30, equipment: ['microphone'],
    blocked: false, bookings: [] },
];

test('I01 INT F5 F3: filterRooms then checkRoom gives a per-room result', () => {
  const shown = filterRooms(CAT, { attendees: 1, equipment: ['projector'] });
  const req = { start: 600, end: 660, now: 540 };
  // shown: a, b, c. a is booked 600-660, b is free, c is blocked.
  expect(shown.map(r => r.id)).toEqual(['a', 'b', 'c']);
  expect(shown.map(r => checkRoom(CAT, r.id, req))).toEqual([false, true, false]);
});