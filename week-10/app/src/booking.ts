export type Interval = { start: number; end: number };

export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}

export function evaluateRequest({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): { status: 'invalid'; message: string } | { status: 'available' } | { status: 'unavailable' } {
  if (!(start < end)) {
    return { status: 'invalid', message: 'The end time must be after the start time.' };
  }
  return canBook({ start, end, now, blocked, bookings })
    ? { status: 'available' }
    : { status: 'unavailable' };
}
