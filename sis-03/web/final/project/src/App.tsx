import { useState, useMemo, useRef } from 'react';
import {
  DoorOpen,
  Clock,
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  LockOpen,
  Search,
  Building2,
} from 'lucide-react';

type Booking = {
  start: string;
  end: string;
  label: string;
};

type Result =
  | { kind: 'available' }
  | { kind: 'unavailable'; reasons: string[] }
  | null;

const ROOM_NAME = 'Room A-101';
const CURRENT_TIME = '09:00';
const CURRENT_MIN = toMinutes(CURRENT_TIME);

const EXISTING_BOOKINGS: Booking[] = [
  { start: '10:00', end: '11:00', label: 'Faculty Meeting' },
  { start: '11:40', end: '12:40', label: 'Student Council' },
];

const MAX_DURATION_MIN = 120;
const LATEST_END = toMinutes('24:00'); // 1440

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function isValidTimeFormat(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export default function App() {
  const [blocked, setBlocked] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [endAtMidnight, setEndAtMidnight] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [showErrors, setShowErrors] = useState(false);
  const startRef = useRef<HTMLInputElement>(null);

  const errors = useMemo<string[]>(() => {
    const errs: string[] = [];
    const startValid = isValidTimeFormat(startTime);
    const endValid = endAtMidnight || isValidTimeFormat(endTime);

    if (!startTime) errs.push('Start time is required.');
    else if (!startValid) errs.push('Start time must be in 24-hour HH:MM format (e.g. 09:30).');

    if (!endAtMidnight) {
      if (!endTime) errs.push('End time is required.');
      else if (!isValidTimeFormat(endTime)) errs.push('End time must be in 24-hour HH:MM format (e.g. 11:00).');
    }

    if (startValid && endValid) {
      const s = toMinutes(startTime);
      const e = endAtMidnight ? LATEST_END : toMinutes(endTime);
      if (s >= e) errs.push('Start time must be earlier than end time.');
      if (e > LATEST_END) errs.push('End time cannot be later than 24:00.');
      if (s <= CURRENT_MIN) errs.push(`Start time must be strictly after the current time (${CURRENT_TIME}).`);
    }
    return errs;
  }, [startTime, endTime, endAtMidnight]);

  const durationMin = useMemo(() => {
    if (!isValidTimeFormat(startTime)) return null;
    const s = toMinutes(startTime);
    const e = endAtMidnight ? LATEST_END : (isValidTimeFormat(endTime) ? toMinutes(endTime) : null);
    if (e === null || s >= e) return null;
    return e - s;
  }, [startTime, endTime, endAtMidnight]);

  function handleCheck() {
    if (errors.length > 0 || durationMin === null) {
      setShowErrors(true);
      setResult(null);
      startRef.current?.focus();
      return;
    }

    if (durationMin > MAX_DURATION_MIN) {
      setResult({
        kind: 'unavailable',
        reasons: [`Duration is ${durationMin} minutes, which exceeds the 120-minute maximum.`],
      });
      return;
    }

    if (blocked) {
      setResult({
        kind: 'unavailable',
        reasons: ['This room is currently blocked and cannot be booked.'],
      });
      return;
    }

    const s = toMinutes(startTime);
    const e = endAtMidnight ? LATEST_END : toMinutes(endTime);
    const overlaps = EXISTING_BOOKINGS.filter((b) => {
      const bs = toMinutes(b.start);
      const be = toMinutes(b.end);
      return s < be && e > bs; // touching endpoints are not overlaps
    });

    if (overlaps.length > 0) {
      setResult({
        kind: 'unavailable',
        reasons: overlaps.map(
          (b) => `Overlaps existing booking "${b.label}" (${b.start}–${b.end}).`
        ),
      });
      return;
    }

    setResult({ kind: 'available' });
  }

  function handleReset() {
    setStartTime('');
    setEndTime('');
    setEndAtMidnight(false);
    setResult(null);
    setShowErrors(false);
    startRef.current?.focus();
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 text-slate-800">
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
            <Building2 className="h-4 w-4" />
            Smart Campus
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Room Availability Checker
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Check whether a time slot is available for {ROOM_NAME}. No bookings are created.
          </p>
        </header>

        {/* Room info card */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
                <DoorOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{ROOM_NAME}</h2>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                  <Clock className="h-3.5 w-3.5" />
                  Current time: <span className="font-medium text-slate-700">{CURRENT_TIME}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              Existing bookings today
            </div>
            <ul className="space-y-2">
              {EXISTING_BOOKINGS.map((b) => (
                <li
                  key={b.label}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-medium text-slate-700">{b.label}</span>
                  <span className="tabular-nums text-slate-500">
                    {b.start} – {b.end}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Checker form card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {/* Block toggle */}
          <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2.5">
              {blocked ? (
                <Lock className="h-5 w-5 text-rose-500" />
              ) : (
                <LockOpen className="h-5 w-5 text-emerald-500" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-800">Room is blocked</p>
                <p className="text-xs text-slate-500">
                  When on, every request is unavailable.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={blocked}
              aria-label="Toggle room blocked"
              onClick={() => setBlocked((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 ${
                blocked ? 'bg-rose-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                  blocked ? 'translate-x-5' : 'translate-x-0.5'
                } mt-0.5`}
              />
            </button>
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start-time" className="mb-1.5 block text-sm font-medium text-slate-700">
                Start time
              </label>
              <input
                ref={startRef}
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setResult(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm tabular-nums text-slate-800 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="09:30"
              />
            </div>
            <div>
              <label htmlFor="end-time" className="mb-1.5 block text-sm font-medium text-slate-700">
                End time
              </label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                disabled={endAtMidnight}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setResult(null);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm tabular-nums text-slate-800 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="11:00"
              />
              <label className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={endAtMidnight}
                  onChange={(e) => {
                    setEndAtMidnight(e.target.checked);
                    setResult(null);
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                />
                End at midnight (24:00)
              </label>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-400">
            24-hour format, to the minute. End time may go up to 24:00. Maximum duration is 120 minutes.
          </p>

          {/* Validation messages */}
          {showErrors && errors.length > 0 && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                Please fix the following:
              </div>
              <ul className="ml-6 list-disc space-y-0.5 text-sm text-amber-700">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Duration hint */}
          {durationMin !== null && errors.length === 0 && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              Requested duration: <span className="font-medium tabular-nums">{durationMin} minutes</span>
              {durationMin > MAX_DURATION_MIN && (
                <span className="ml-1 font-medium text-rose-600">
                  (exceeds the 120-minute limit)
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={handleCheck}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              <Search className="h-4 w-4" />
              Check availability
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Result */}
        {result && (
          <section className="mt-6 animate-[fadeIn_0.2s_ease-out]">
            {result.kind === 'available' ? (
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-semibold text-emerald-800">Available</h3>
                  <p className="mt-0.5 text-sm text-emerald-700">
                    {ROOM_NAME} is available from{' '}
                    <span className="font-medium tabular-nums">{startTime}</span> to{' '}
                    <span className="font-medium tabular-nums">{endAtMidnight ? '24:00' : endTime}</span>. No existing
                    bookings overlap this time slot.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
                <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-rose-600" />
                <div>
                  <h3 className="text-lg font-semibold text-rose-800">Unavailable</h3>
                  <ul className="mt-1 ml-4 list-disc space-y-0.5 text-sm text-rose-700">
                    {result.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Footer note */}
        <footer className="mt-8 text-center text-xs text-slate-400">
          This tool only checks availability. It does not create or confirm any booking.
        </footer>
      </div>
    </div>
  );
}
