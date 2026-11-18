# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| ChatGPT | GPT-6 | 2026-11-19 | codebase analysis (Task 1) | none (answer used in report.md §3) |
| ChatGPT | GPT-6 | 2026-11-19 | improvement plan | none (adapted in report.md §3.2) |
| Claude | Claude Sonnet 5.5 | 2026-11-19 | step-by-step plan, context message for ChatGPT, report drafts | checkRoom.test.ts, booking.ts |
| Claude | Claude Sonnet 5.5 | 2026-11-19 | feature extension (Task 2) | app/src/rooms.ts, app/src/filter.ts, app/src/App.tsx, app/src/index.css |
| Claude | Claude Sonnet 5.5 | 2026-11-19 | refactoring (Task 3) | app/src/rooms.ts, app/src/booking.ts, app/src/App.tsx, app/src/booking.test.ts (import only) |
| Claude | Claude Sonnet 5.5 | 2026-11-19 | tests (Task 4) | app/src/checkRoom.test.ts, app/src/filter.test.ts, app/src/integration.test.ts |

**The assistant wrote, or helped write, tests in `app/`:** yes
AI helped me prepare test examples for checkRoom() and filterRooms(). I checked the expected values against the assignment requirements, including capacity, selected equipment, blocked rooms and booking availability. I also checked that the original canBook() behavior stayed unchanged.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**
none

Signed: Elizat Nurdymbek
Date: 2026-11-19
