# AI Prompt Log
## Initial Prompt

Build a small program that processes a list of student marks and prints:
average, highest, lowest, and pass rate.

## Rocket Questions

1. How will marks be entered into the app?
2. Who is this tool for?

## My Answers

1. Paste a list of marks (Drop in a comma-separated or line-by-line list)
2. A teacher or lecturer

## Rocket's Rewritten Prompt

A clean web-based tool for teachers to process student marks by pasting in a list. The app instantly calculates and displays the class average, highest mark, lowest mark, and pass rate — giving a clear summary of performance at a glance.
Building with Next.js and TypeScript.

## What Rocket Added

- A web-based tool for teachers.
- Marks can be pasted as a comma-separated or line-by-line list.
- KPI cards for average, highest, lowest, and pass rate.
- Median and standard deviation.
- A grade distribution bar chart.
- A configurable pass threshold slider.
- Skipped-entry warnings.
- A sortable marks table.
- Next.js and TypeScript.

## Case A

Input:
85, 23, 45, 90, 92

Output:
Total students: 5
3 passed · 2 failed
Class average: 67.0%
Pass rate: 60.0%
Students failed: 2
Highest mark: 92
Lowest mark: 23
Median mark: 85
Std. deviation: 27.9

Result:
PASS

## Case B

Input:
88, 47, -5, 101, abc, 73, 50, , 100

Output:
3 entries could not be parsed and were skipped.
Only numbers between 0–100 are accepted.
Skipped: "-5", "101", "abc"

Result:
PASS

## Case C

Input:
10, 20, 30

Output:
Total students: 3
0 passed · 3 failed
Class average: 20.0%
Pass rate: 0.0%
Students failed: 3
Highest mark: 30
Lowest mark: 10
Median mark: 20
Std. deviation: 8.2

Result:
PASS

## Case D

Input:
abc, , xyz

Output:
No valid numbers found. Check your format and try again.

Result:
PASS

## Follow-up Prompt
The class average status is incorrect when the average is exactly equal to the pass mark. Please fix the logic so that an average equal to the pass mark is not described as "Above pass mark". Keep the existing pass/fail calculation and other outputs unchanged.

## Result
The program now correctly shows "At pass mark (50)" when the class average is exactly 50.

Did the fix work?
Yes

Did it break anything else?
No