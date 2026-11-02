import type { Booking, Room } from './availability';

export const sampleRooms: Room[] = [
  { id: 'r1', name: 'Aurora Hall', building: 'North Wing', capacity: 40, blocked: false },
  { id: 'r2', name: 'Beacon Lab', building: 'Tech Block', capacity: 24, blocked: false },
  { id: 'r3', name: 'Cedar Studio', building: 'Arts Center', capacity: 16, blocked: true },
  { id: 'r4', name: 'Dynamo Lounge', building: 'East Quad', capacity: 8, blocked: false },
];

export const sampleBookings: Booking[] = [
  { id: 'b1', roomId: 'r1', start: 540, end: 600, bookedBy: 'Prof. Lin' }, // 9:00–10:00
  { id: 'b2', roomId: 'r1', start: 780, end: 840, bookedBy: 'Prof. Okafor' }, // 13:00–14:00
  { id: 'b3', roomId: 'r2', start: 600, end: 660, bookedBy: 'Dr. Reyes' }, // 10:00–11:00
  { id: 'b4', roomId: 'r4', start: 960, end: 1020, bookedBy: 'Student Council' }, // 16:00–17:00
];

// Simulated "now" in minutes since midnight. Kept fixed for reproducible checks.
export const CURRENT_TIME = 555; // 9:15 AM
