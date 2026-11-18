# Smart Campus Room Availability Checker

React + TypeScript + Vite + Vitest. Fictional data only, fixed current time, no backend.

## Setup
    npm install

## Run
    npm run dev        # http://localhost:5173

## Test
    npx vitest run
    npx tsc --noEmit

## Structure
- `src/rooms.ts`: `Room` type and the `ROOMS` catalog (5 fictional rooms)
- `src/booking.ts`: `canBook` (AC1-AC5) and `checkRoom`
- `src/filter.ts`: `filterRooms` (F1, F2)
- `src/App.tsx`: the page; imports the rules, holds no rules or room data