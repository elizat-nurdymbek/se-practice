export type Interval = { start: number; end: number }; // minutes after midnight, 600 = 10:00

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Interval[];
};

export const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', capacity: 8, equipment: ['projector'],
    blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', capacity: 12, equipment: ['projector', 'whiteboard'],
    blocked: false, bookings: [] },
  { id: 'c305', name: 'Lab C-305', capacity: 20, equipment: ['projector', 'whiteboard', 'computers'],
    blocked: true, bookings: [] },
  { id: 'd110', name: 'Seminar D-110', capacity: 30, equipment: ['projector', 'microphone'],
    blocked: false, bookings: [{ start: 720, end: 780 }, { start: 840, end: 900 }] },
  { id: 'e001', name: 'Hall E-001', capacity: 60, equipment: ['microphone', 'whiteboard'],
    blocked: false, bookings: [{ start: 540, end: 660 }] },
];