import { test, expect } from 'vitest';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const CAT: Room[] = [
  { id: 'a', name: 'A', capacity: 8, equipment: ['projector'],
    blocked: false, bookings: [] },
  { id: 'b', name: 'B', capacity: 12, equipment: ['projector', 'whiteboard'],
    blocked: false, bookings: [] },
  { id: 'c', name: 'C', capacity: 20, equipment: ['projector', 'whiteboard', 'computers'],
    blocked: true, bookings: [] },
  { id: 'd', name: 'D', capacity: 30, equipment: ['microphone'],
    blocked: false, bookings: [] },
];
const ids = (rs: Room[]) => rs.map(r => r.id);

test('L01 F1 B5: capacity exactly equal to attendees is included', () => {
  expect(ids(filterRooms(CAT, { attendees: 8, equipment: [] }))).toContain('a');
});

test('L02 F1 B6: capacity one below attendees is excluded', () => {
  expect(ids(filterRooms(CAT, { attendees: 9, equipment: [] }))).toEqual(['b', 'c', 'd']);
});

test('L03 F1: a larger room is included', () => {
  expect(ids(filterRooms(CAT, { attendees: 25, equipment: [] }))).toEqual(['d']);
});

test('L04 F2: the room must have ALL selected items, not any', () => {
  expect(ids(filterRooms(CAT, { attendees: 1, equipment: ['projector', 'whiteboard'] }))).toEqual(['b', 'c']);
});

test('L05 F2: one selected item keeps every room that has it', () => {
  expect(ids(filterRooms(CAT, { attendees: 1, equipment: ['projector'] }))).toEqual(['a', 'b', 'c']);
});

test('L06 F1 F2: capacity and equipment apply together', () => {
  expect(ids(filterRooms(CAT, { attendees: 15, equipment: ['whiteboard'] }))).toEqual(['c']);
});

test('L07 F4: no matching room gives an empty list', () => {
  expect(filterRooms(CAT, { attendees: 100, equipment: [] })).toEqual([]);
});

test('L08 F4: equipment nobody has gives an empty list', () => {
  expect(filterRooms(CAT, { attendees: 1, equipment: ['projector', 'microphone'] })).toEqual([]);
});

test('L09 AC5: filtering does not change the catalog', () => {
  const before = JSON.stringify(CAT);
  filterRooms(CAT, { attendees: 9, equipment: ['projector'] });
  expect(JSON.stringify(CAT)).toBe(before);
});