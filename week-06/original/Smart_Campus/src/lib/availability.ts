export type Room = {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
};

export type Booking = {
  id: string;
  roomId: string;
  start: number; // minutes since midnight
  end: number; // minutes since midnight
  bookedBy: string;
};

export type AvailabilityDecision = {
  available: boolean;
  reason: string;
};

const MAX_DURATION = 120;
const MINUTES_PER_DAY = 1440;

function overlaps(a: Booking, start: number, end: number): boolean {
  // Touching endpoints are allowed, so strictly-less comparison.
  return a.start < end && start < a.end;
}

export function evaluateAvailability(
  room: Room | undefined,
  bookings: Booking[],
  start: number,
  end: number,
  currentTime: number
): AvailabilityDecision {
  if (!room) {
    return { available: false, reason: 'Select a room to check availability.' };
  }

  // AC1: valid interval and start after current time.
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end > MINUTES_PER_DAY ||
    start >= end
  ) {
    return {
      available: false,
      reason: 'Enter a valid interval (0 ≤ start < end ≤ 1440).',
    };
  }
  if (start <= currentTime) {
    return {
      available: false,
      reason: 'Start time must be later than the current time.',
    };
  }

  // AC2: max 120 minutes.
  if (end - start > MAX_DURATION) {
    return {
      available: false,
      reason: `Bookings cannot exceed ${MAX_DURATION} minutes.`,
    };
  }

  // AC3: room blocked.
  if (room.blocked) {
    return {
      available: false,
      reason: 'This room is currently blocked and cannot be booked.',
    };
  }

  // AC4: overlap with existing bookings.
  const conflict = bookings
    .filter((b) => b.roomId === room.id)
    .find((b) => overlaps(b, start, end));

  if (conflict) {
    return {
      available: false,
      reason: `Overlaps an existing booking (${formatTime(conflict.start)}–${formatTime(conflict.end)}).`,
    };
  }

  return {
    available: true,
    reason: `Available from ${formatTime(start)} to ${formatTime(end)}.`,
  };
}

export function formatTime(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(m / 60);
  const min = m % 60;
  const period = h < 12 ? 'AM' : 'PM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${displayH}:${min.toString().padStart(2, '0')} ${period}`;
}
