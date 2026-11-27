export type Interval = { start: number; end: number };

export type ReasonCode =
  | 'invalid_time'
  | 'past_time'
  | 'too_long'
  | 'room_blocked'
  | 'overlap'
  | 'available';

type Request = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
};

export function availabilityReason({ start, end, now, blocked, bookings }: Request): ReasonCode {
  if (!(0 <= start && start < end && end <= 1440)) return 'invalid_time';
  if (!(start > now)) return 'past_time';
  if (end - start > 120) return 'too_long';
  if (blocked) return 'room_blocked';
  for (const b of bookings) {
    if (start < b.end && end > b.start) return 'overlap';
  }
  return 'available';
}

export function canBook(request: Request): boolean {
  return availabilityReason(request) === 'available';
}

export function evaluateRequest({ start, end, now, blocked, bookings }: Request):
  | { status: 'invalid'; message: string }
  | { status: 'available' }
  | { status: 'unavailable' } {
  if (!(start < end)) {
    return { status: 'invalid', message: 'The end time must be after the start time.' };
  }
  return canBook({ start, end, now, blocked, bookings })
    ? { status: 'available' }
    : { status: 'unavailable' };
}