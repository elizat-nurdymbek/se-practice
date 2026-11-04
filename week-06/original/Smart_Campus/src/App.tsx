import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  DoorClosed,
  MapPin,
  Users,
  CalendarClock,
  RefreshCw,
} from 'lucide-react';
import {
  evaluateAvailability,
  formatTime,
  type Booking,
  type Room,
} from '@/lib/availability';
import { sampleBookings, sampleRooms, CURRENT_TIME } from '@/lib/sampleData';

function toMinutes(value: string): number {
  if (value === '') return NaN;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

export default function App() {
  const [bookings] = useState<Booking[]>(sampleBookings);
  const [rooms] = useState<Room[]>(sampleRooms);

  const [roomId, setRoomId] = useState<string>('');
  const [startInput, setStartInput] = useState<string>('');
  const [endInput, setEndInput] = useState<string>('');

  const start = toMinutes(startInput);
  const end = toMinutes(endInput);
  const hasInput = roomId !== '' && startInput !== '' && endInput !== '';
  const selectedRoom = rooms.find((r) => r.id === roomId);

  const decision = useMemo(() => {
    if (!hasInput) return null;
    return evaluateAvailability(
      selectedRoom,
      bookings,
      start,
      end,
      CURRENT_TIME
    );
  }, [hasInput, selectedRoom, bookings, start, end]);

  const roomBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.roomId === roomId)
        .sort((a, b) => a.start - b.start),
    [bookings, roomId]
  );

  const duration = hasInput && !Number.isNaN(start) && !Number.isNaN(end) ? end - start : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Smart Campus Room Availability
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Check whether a campus room is free for your requested time slot.
              </p>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
            <Clock className="h-4 w-4 text-emerald-600" />
            Current campus time: <span className="font-medium text-slate-900">{formatTime(CURRENT_TIME)}</span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input panel */}
          <section className="lg:col-span-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="text-lg font-semibold">Request a room</h2>
            <p className="mt-1 text-sm text-slate-500">
              Times are entered in minutes since midnight (0–1440). Max booking length is 120 minutes.
            </p>

            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="room" className="block text-sm font-medium text-slate-700">
                  Room
                </label>
                <select
                  id="room"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="mt-1.5 block w-full rounded-lg border-slate-300 bg-white px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a room…</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id} disabled={r.blocked}>
                      {r.name} — {r.building}{r.blocked ? ' (blocked)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="start" className="block text-sm font-medium text-slate-700">
                    Start (minutes)
                  </label>
                  <input
                    id="start"
                    type="number"
                    min={0}
                    max={1440}
                    value={startInput}
                    onChange={(e) => setStartInput(e.target.value)}
                    placeholder="e.g. 600"
                    className="mt-1.5 block w-full rounded-lg px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="end" className="block text-sm font-medium text-slate-700">
                    End (minutes)
                  </label>
                  <input
                    id="end"
                    type="number"
                    min={0}
                    max={1440}
                    value={endInput}
                    onChange={(e) => setEndInput(e.target.value)}
                    placeholder="e.g. 660"
                    className="mt-1.5 block w-full rounded-lg px-3 py-2 text-sm shadow-sm ring-1 ring-inset ring-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {duration !== null && (
                <p className="text-xs text-slate-500">
                  Duration: <span className="font-medium text-slate-700">{duration} min</span>
                  {duration > 120 && <span className="ml-2 text-rose-600">exceeds 120-minute limit</span>}
                  {duration <= 0 && <span className="ml-2 text-rose-600">end must be after start</span>}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setRoomId('');
                  setStartInput('');
                  setEndInput('');
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>

            {selectedRoom && (
              <div className="mt-6 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                  <InfoChip icon={<MapPin className="h-4 w-4" />} label="Building" value={selectedRoom.building} />
                  <InfoChip icon={<Users className="h-4 w-4" />} label="Capacity" value={`${selectedRoom.capacity}`} />
                  <InfoChip
                    icon={<DoorClosed className="h-4 w-4" />}
                    label="Status"
                    value={selectedRoom.blocked ? 'Blocked' : 'Open'}
                    tone={selectedRoom.blocked ? 'warn' : 'ok'}
                  />
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Existing bookings today
                  </h3>
                  {roomBookings.length === 0 ? (
                    <p className="mt-2 text-sm text-slate-500">No existing bookings.</p>
                  ) : (
                    <ul className="mt-2 space-y-1.5">
                      {roomBookings.map((b) => (
                        <li
                          key={b.id}
                          className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-sm ring-1 ring-slate-200"
                        >
                          <span className="font-medium text-slate-700">
                            {formatTime(b.start)} – {formatTime(b.end)}
                          </span>
                          <span className="text-slate-500">{b.bookedBy}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Decision panel */}
          <section className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
            <h2 className="text-lg font-semibold">Decision</h2>

            {!hasInput && (
              <div className="mt-4 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500 ring-1 ring-slate-200">
                Choose a room and enter a start and end time to see the availability result.
              </div>
            )}

            {decision && (
              <div
                className={`mt-4 rounded-xl p-5 ring-1 ${
                  decision.available
                    ? 'bg-emerald-50 ring-emerald-200'
                    : 'bg-rose-50 ring-rose-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {decision.available ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-rose-600" />
                  )}
                  <div>
                    <p
                      className={`text-lg font-semibold ${
                        decision.available ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {decision.available ? 'Available' : 'Unavailable'}
                    </p>
                    <p
                      className={`mt-0.5 text-sm ${
                        decision.available ? 'text-emerald-700/80' : 'text-rose-700/80'
                      }`}
                    >
                      {decision.reason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2 text-xs text-slate-500">
              <p className="font-semibold uppercase tracking-wide text-slate-400">Rules applied</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>0 ≤ start &lt; end ≤ 1440, start after current time.</li>
                <li>Booking length cannot exceed 120 minutes.</li>
                <li>Blocked rooms are always unavailable.</li>
                <li>Touching endpoints are allowed; overlaps are rejected.</li>
              </ul>
              <p className="pt-2 text-slate-400">Existing bookings are never modified by a check.</p>
            </div>
          </section>
        </div>

        <footer className="mt-8 text-center text-xs text-slate-400">
          Fictional sample data only. No bookings are actually saved.
        </footer>
      </div>
    </div>
  );
}

function InfoChip({
  icon,
  label,
  value,
  tone = 'neutral',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: 'neutral' | 'ok' | 'warn';
}) {
  const toneClass =
    tone === 'warn'
      ? 'text-rose-700'
      : tone === 'ok'
      ? 'text-emerald-700'
      : 'text-slate-700';
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon}
        {label}
      </span>
      <span className={`text-sm font-semibold ${toneClass}`}>{value}</span>
    </div>
  );
}
