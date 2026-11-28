# AI Usage Disclosure — Week 11

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude | Claude Sonnet 5.5 | the feature: mock adapter, explain.ts, the button (Task 3) | app/src/booking.ts, app/src/explain.ts, app/src/App.tsx, app/src/explain.test.ts (I copied its code into my project) |
| ChatGPT | GPT-6 | the three prompts compared (Task 4) | none — a fresh chat per prompt |
| ChatGPT | GPT-6 | read-only agentic review (Task 6) | none — "Do not edit files" |
| Claude | Claude Sonnet 5.5 | the two fixes (Task 7) | app/src/explain.ts, app/src/explain.test.ts |

**Every file the assistant changed in Task 3 was reviewed by me before I accepted it (§4.2):** yes 

**No API key, token or provider call is anywhere in `app/src/`:** yes

**The review in Task 6 ran in a mode where the assistant could not edit, and `git status` showed no change afterwards:** yes

**I labelled every finding in §7.3 after verifying it myself:** yes

**I used another assistant as well (to explain an error, to draft text in lab-report.md, …):** yes 
Claude (the same chat as Task 3) also wrote drafts of text for lab-report.md: the prompt comparison (§5.3), the findings table (§7.3). I checked the facts against my own runs and changed the text where it was not true. Claude also helped me read the failed test output and fix the broken isValidExplanation. The reflection in §10 is written in my own words.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain how explainAvailability handles a timeout and a contradicting answer, without the
assistant:** yes

**Anything I accepted from the AI without fully understanding it:** none 
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Elizat Nurdymbek
Date: 2026-11-28
