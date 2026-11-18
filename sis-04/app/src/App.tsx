import { useState } from 'react';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import { ROOMS } from './rooms';

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};
const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

const ALL_EQUIPMENT = Array.from(new Set(ROOMS.flatMap(r => r.equipment))).sort();

export default function App() {
  const [attendees, setAttendees] = useState('1');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomId, setRoomId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [checked, setChecked] = useState(false);

  const filtered = filterRooms(ROOMS, { attendees: Number(attendees) || 0, equipment });
  const room = filtered.find(r => r.id === roomId) ?? filtered[0] ?? null;

  function toggleEquipment(item: string) {
    setEquipment(prev => (prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]));
  }

  let error = '';
  let result: boolean | null = null;
  if (checked && room) {
    if (!start || !now || (!end && !endOfDay)) {
      error = 'Fill in the current time, the start and the end.';
    } else {
      const s = toMinutes(start);
      const e = endOfDay ? 1440 : toMinutes(end);
      if (!(s < e)) {
        error = 'The end time must be after the start time.';
      } else {
        result = checkRoom(ROOMS, room.id, { start: s, end: e, now: toMinutes(now) });
      }
    }
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>

      <h2>Find a room</h2>
      <div className="row">
        <label>Attendees
          <input type="number" min={1} value={attendees} onChange={e => setAttendees(e.target.value)} />
        </label>
        <fieldset className="equipment">
          <legend>Required equipment</legend>
          {ALL_EQUIPMENT.map(item => (
            <label key={item} className="inline">
              <input type="checkbox" checked={equipment.includes(item)} onChange={() => toggleEquipment(item)} /> {item}
            </label>
          ))}
        </fieldset>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">No rooms match: try fewer attendees or less equipment.</p>
      ) : (
        <>
          <p className="matches">
            {filtered.length} matching room(s): {filtered.map(r => r.name).join(', ')}
          </p>
          <div className="row">
            <label>Room
              <select value={room?.id} onChange={e => setRoomId(e.target.value)}>
                {filtered.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.capacity} seats){r.blocked ? ' - blocked' : ''}
                  </option>
                ))}
              </select>
            </label>
            <label>Current time<input type="time" value={now} onChange={e => setNow(e.target.value)} /></label>
            <label>Start<input type="time" value={start} onChange={e => setStart(e.target.value)} /></label>
            <label>End<input type="time" value={end} disabled={endOfDay} onChange={e => setEnd(e.target.value)} /></label>
            <label className="inline"><input type="checkbox" checked={endOfDay} onChange={e => setEndOfDay(e.target.checked)} /> Ends at 24:00</label>
          </div>
          <button onClick={() => setChecked(true)}>Check availability</button>
          {error && <p className="error">{error}</p>}
          {result !== null && (
            <p className={`result ${result ? 'available' : 'unavailable'}`}>{result ? 'Available' : 'Unavailable'}</p>
          )}
          {room && (
            <>
              <h2>Room details</h2>
              <p>{room.name}: {room.capacity} seats, {room.equipment.join(', ') || 'no equipment'}{room.blocked ? ' (blocked)' : ''}</p>
              <h2>Existing bookings</h2>
              <ul>{room.bookings.length ? room.bookings.map((b, i) => <li key={i}>{fmt(b.start)}–{fmt(b.end)}</li>) : <li>none</li>}</ul>
            </>
          )}
        </>
      )}
    </main>
  );
}