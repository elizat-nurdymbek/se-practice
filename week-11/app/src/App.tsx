import { availabilityReason, evaluateRequest } from './booking';
import { explainAvailability, mockAdapter } from './explain';
import type { ExplainAdapter, ExplainInput, ExplainResult } from './explain';
import { useRef, useState } from 'react';

type Interval = { start: number; end: number };
type Room = { id: string; name: string; blocked: boolean; bookings: Interval[] };

const ROOMS: Room[] = [
  { id: 'a101', name: 'Room A-101', blocked: false, bookings: [{ start: 600, end: 660 }] },
  { id: 'b204', name: 'Room B-204', blocked: false, bookings: [] },
];

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

// Used by the "Simulate API failure" checkbox.
const failingAdapter: ExplainAdapter = async () => {
  throw new Error('Simulated API failure');
};

export default function App() {
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [blocked, setBlocked] = useState(false);
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  // The checked request, saved at the moment of the check, so the explanation
  // always matches the status on screen even if the inputs are edited later.
  const [decided, setDecided] = useState<ExplainInput | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [explainResult, setExplainResult] = useState<ExplainResult | null>(null);
  const [explaining, setExplaining] = useState(false);
  const explainRun = useRef(0);

  const room = ROOMS.find(r => r.id === roomId)!;

  function check() {
    explainRun.current += 1; // ignore any explanation still in progress
    setExplainResult(null);
    setExplaining(false);
    setDecided(null);
    setResult(null);
    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in the current time, the start and the end.');
      return;
    }
    const s = toMinutes(start);
    const e = endOfDay ? 1440 : toMinutes(end);
    const n = toMinutes(now);
    const request = { start: s, end: e, now: n, blocked, bookings: room.bookings };

    const decision = evaluateRequest(request);

    if (decision.status === 'invalid') {
      setError(decision.message);
      setResult(null);
    } else {
      setError('');
      const reasonCode = availabilityReason(request); // from the deterministic code
      const isAvailable = decision.status === 'available';
      setResult(isAvailable);
      setDecided({ roomLabel: room.name, start: fmt(s), end: fmt(e), isAvailable, reasonCode });
    }
  }

  async function explain() {
    if (!decided) return;
    const run = ++explainRun.current;
    setExplaining(true);
    const out = await explainAvailability(decided, simulateFailure ? failingAdapter : mockAdapter);
    if (run !== explainRun.current) return; // a newer check happened
    setExplainResult(out);
    setExplaining(false);
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <div className="row">
        <label>Room
          <select value={roomId} onChange={e => setRoomId(e.target.value)}>
            {ROOMS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </label>
        <label>Current time<input type="time" value={now} onChange={e => setNow(e.target.value)} /></label>
        <label>Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
        <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => setEnd(e.target.value)} /></label>
        <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => setEndOfDay(e.target.checked)} /> Ends at 24:00</label>
        <label className="inline"><input type="checkbox" checked={blocked} onChange={e => setBlocked(e.target.checked)} /> Room blocked</label>
      </div>
      <button onClick={check}>Check availability</button>
      {error && <p className="error">{error}</p>}
      {result !== null && (
        <p className={`result ${result ? 'available' : 'unavailable'}`}>{result ? 'Available' : 'Unavailable'}</p>
      )}

      {decided && (
        <section aria-label="Explanation" style={{ marginTop: '1rem' }}>
          <div className="row">
            <button onClick={explain} disabled={explaining}>Explain availability</button>
            <label className="inline">
              <input type="checkbox" checked={simulateFailure} onChange={e => setSimulateFailure(e.target.checked)} /> Simulate API failure
            </label>
          </div>
          {explaining && <p>Explaining…</p>}
          {explainResult?.kind === 'rejected' && <p className="error">{explainResult.message}</p>}
          {explainResult?.kind === 'explained' && (
            <div style={{ border: '1px dashed #888', borderRadius: 6, padding: '0.5rem 0.75rem', marginTop: '0.5rem' }}>
              <small>
                {explainResult.source === 'model'
                  ? 'Generated explanation (mock), not a booking decision'
                  : 'Fallback explanation (generated by fixed rules, the model did not answer), not a booking decision'}
              </small>
              <p style={{ margin: '0.25rem 0 0' }}>{explainResult.explanation}</p>
            </div>
          )}
        </section>
      )}

      <h2>Existing bookings</h2>
      <ul>{room.bookings.length ? room.bookings.map((b, i) => <li key={i}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
    </main>
  );
}