# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a
finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there
is nothing.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | AC-01, AC-02, AC-03, AC-04 | No |
| UC-02 Book room | US-02 | AC-01, AC-02, AC-03, AC-04, AC-05 | No |
| UC-03 Cancel booking | US-03 | AC-01, AC-02, AC-03, AC-04 | No |
| UC-04 Block or unblock room | US-04 | none | Yes — no selected criteria directly test this use case |
| UC-05 Review usage | US-05 | none | Yes — no selected criteria directly test this use case |
| UC-06 Send confirmation | US-06 | AC-01 (US-02), AC-02 (US-03) | No — confirmation behavior is also tested by booking and cancellation criteria |

**Stories that belong to no use case:** none

**What the gaps tell you:** 
UC-04 and UC-05 are represented by stories but do not have selected acceptance criteria because criteria were written only for US-01, US-02, and US-03. These use cases would need their own acceptance criteria in a later iteration for full test coverage.