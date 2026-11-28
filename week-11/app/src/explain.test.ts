import { describe, test, expect, vi } from 'vitest';
import { availabilityReason, canBook } from './booking';
import { explainAvailability, mockAdapter } from './explain';
import type { ExplainAdapter, ExplainInput } from './explain';

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

const NOW = 540; // 09:00
const BOOKINGS = [{ start: 600, end: 660 }]; // 10:00-11:00

// Builds the explain input only from the deterministic checker, like the page does.
function inputFor(start: number, end: number, blocked = false, roomLabel = 'Room A-101'): ExplainInput {
  const request = { start, end, now: NOW, blocked, bookings: BOOKINGS };
  return {
    roomLabel,
    start: fmt(start),
    end: fmt(end),
    isAvailable: canBook(request),
    reasonCode: availabilityReason(request),
  };
}

describe('explainAvailability', () => {
  test('E1 F2: available slot is explained as available', async () => {
    const input = inputFor(660, 720);
    expect(input.reasonCode).toBe('available');
    const out = await explainAvailability(input, mockAdapter);
    expect(out.kind).toBe('explained');
    if (out.kind === 'explained') {
      expect(out.source).toBe('model');
      expect(out.explanation).toMatch(/available/i);
      expect(out.explanation).not.toMatch(/not available/i);
    }
  });

  test('E2 F2: overlap is explained as unavailable and mentions the overlap', async () => {
    const input = inputFor(630, 690);
    expect(input.reasonCode).toBe('overlap');
    expect(input.isAvailable).toBe(false);
    const out = await explainAvailability(input, mockAdapter);
    expect(out.kind).toBe('explained');
    if (out.kind === 'explained') {
      expect(out.explanation).toMatch(/not available/i);
      expect(out.explanation).toMatch(/overlap/i);
    }
  });

  test('E3 F2: blocked room gives room_blocked', async () => {
    const input = inputFor(660, 720, true);
    expect(input.reasonCode).toBe('room_blocked');
    const out = await explainAvailability(input, mockAdapter);
    expect(out.kind).toBe('explained');
    if (out.kind === 'explained') expect(out.explanation).toMatch(/blocked/i);
  });

  test('E4 F2: invalid time (12:30-12:00) gives invalid_time', async () => {
    const input = inputFor(750, 720);
    expect(input.reasonCode).toBe('invalid_time');
    expect(input.isAvailable).toBe(false);
    const out = await explainAvailability(input, mockAdapter);
    expect(out.kind).toBe('explained');
  });

  test('E5 F2: past time (08:00-08:30 at 09:00) gives past_time', async () => {
    const input = inputFor(480, 510);
    expect(input.reasonCode).toBe('past_time');
    expect(input.isAvailable).toBe(false);
    const out = await explainAvailability(input, mockAdapter);
    expect(out.kind).toBe('explained');
  });

  test('E6 F3: a blank room label is rejected before the adapter is called', async () => {
    const adapter = vi.fn<ExplainAdapter>(async () => ({ explanation: 'ok' }));
    const out = await explainAvailability(inputFor(660, 720, false, '   '), adapter);
    expect(out.kind).toBe('rejected');
    expect(adapter).not.toHaveBeenCalled();
  });

  test('E7 F3: a 500-character room label is rejected', async () => {
    const adapter = vi.fn<ExplainAdapter>(async () => ({ explanation: 'ok' }));
    const out = await explainAvailability(inputFor(660, 720, false, 'x'.repeat(500)), adapter);
    expect(out.kind).toBe('rejected');
    expect(adapter).not.toHaveBeenCalled();
  });

  test('E8 F4: an adapter that never answers times out into the fallback', async () => {
    const neverAnswers: ExplainAdapter = () => new Promise(() => {});
    const started = Date.now();
    const out = await explainAvailability(inputFor(660, 720), neverAnswers, 50);
    expect(Date.now() - started).toBeLessThan(1000);
    expect(out.kind).toBe('explained');
    if (out.kind === 'explained') {
      expect(out.source).toBe('fallback');
      expect(out.explanation).toMatch(/available/i);
    }
  });

  test('E9 F4: an adapter that throws gives the fallback', async () => {
    const throwing: ExplainAdapter = async () => {
      throw new Error('Simulated API failure');
    };
    const input = inputFor(630, 690);
    const out = await explainAvailability(input, throwing, 500);
    expect(out.kind).toBe('explained');
    if (out.kind === 'explained') {
      expect(out.source).toBe('fallback');
      expect(out.explanation).toMatch(/not available/i);
      expect(out.explanation).toMatch(/overlap/i);
    }
  });

  test('F2: an answer that contradicts the decision is replaced by the fallback', async () => {
    const lying: ExplainAdapter = async () => ({ explanation: 'Great, this room is free for you.' });
    const input = inputFor(630, 690); // overlap, so unavailable
    const out = await explainAvailability(input, lying, 500);
    expect(out.kind === 'explained' && out.source).toBe('fallback');
  });

  test('F2: an answer with an invented time is replaced by the fallback', async () => {
    const inventing: ExplainAdapter = async () => ({ explanation: 'The room is available from 15:00 to 16:00.' });
    const out = await explainAvailability(inputFor(660, 720), inventing, 500);
    expect(out.kind === 'explained' && out.source).toBe('fallback');
  });

  test('F1: explaining never changes the decision', async () => {
    const request = { start: 630, end: 690, now: NOW, blocked: false, bookings: BOOKINGS };
    const before = canBook(request);
    await explainAvailability(inputFor(630, 690), mockAdapter);
    expect(canBook(request)).toBe(before);
    expect(BOOKINGS).toEqual([{ start: 600, end: 660 }]);
  });
  test('V1 F2: an invented time in am/pm format is replaced by the fallback', async () => {
    const inventing: ExplainAdapter = async () => ({
      explanation: 'The room is available from 11:00 to 12:00, and the next booking starts at 3pm.',
    });
    const out = await explainAvailability(inputFor(660, 720), inventing, 500);
    expect(out.kind === 'explained' && out.source).toBe('fallback');
  });
});