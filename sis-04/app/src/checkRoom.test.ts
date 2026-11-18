import { test, expect } from 'vitest';
import { checkRoom } from './booking';
import type { Room } from './rooms';

const CAT: Room[] = [
  { id: 'a', name: 'A', capacity: 8, equipment: ['projector'],
    blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b', name: 'B', capacity: 12, equipment: ['projector', 'whiteboard'],
    blocked: false, bookings: [] },
  { id: 'c', name: 'C', capacity: 20, equipment: ['projector'],
    blocked: true, bookings: [] },
  { id: 'd', name: 'D', capacity: 30, equipment: [],
    blocked: false, bookings: [{ start: 720, end: 780 }] },
];
const NOW = 540; // 09:00

test('C01 F5: the same time gives a different result in another room', () => {
  const req = { start: 600, end: 660, now: NOW };
  expect(checkRoom(CAT, 'a', req)).toBe(false); // overlaps A's own booking 600-660
  expect(checkRoom(CAT, 'b', req)).toBe(true);  // B has no bookings
});

test('C02 F3: a blocked room is never available, although the slot is valid', () => {
  expect(checkRoom(CAT, 'c', { start: 600, end: 660, now: NOW })).toBe(false);
});

test('C03: an unknown room id is not available', () => {
  expect(checkRoom(CAT, 'zzz', { start: 600, end: 660, now: NOW })).toBe(false);
});

test('C04 F5 AC4: only the chosen room bookings count, not another room', () => {
  // 600-660 is booked in A, but D is free then; 720-780 is booked in D, but A is free then
  expect(checkRoom(CAT, 'd', { start: 600, end: 660, now: NOW })).toBe(true);
  expect(checkRoom(CAT, 'a', { start: 720, end: 780, now: NOW })).toBe(true);
  expect(checkRoom(CAT, 'd', { start: 720, end: 780, now: NOW })).toBe(false);
});

test('C05 AC5: checking a room does not change the catalog', () => {
  const before = JSON.stringify(CAT);
  checkRoom(CAT, 'a', { start: 700, end: 760, now: NOW });
  checkRoom(CAT, 'a', { start: 600, end: 660, now: NOW });
  expect(JSON.stringify(CAT)).toBe(before);
});