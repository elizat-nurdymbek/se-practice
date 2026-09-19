# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name: Elizat Nurdymbek**
**Group: Monday 16:00-19:00**
**Date: 14.09.2026**

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | ChatGPT |
| Exact model name | GPT-5.6 Luna |
| Implementation language | Python |
| Date of the runs | 14.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

"n/a — used Python"

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

Write Python code to analyze student marks.

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass threshold, a rounding rule, an input method, an invented feature all count.

1. It decided to get marks using input() and comma-separated values.
2. It used 50 as the pass threshold.
3. It decided to ignore invalid marks instead of raising an error.
4. It made a normal program with printed results instead of a function that returns a dictionary.
5. It also printed the number of valid marks, although I did not ask for it.

**Questions it should have asked and did not:**

1. What input format should be used?
2. What should happen when marks are invalid or outside 0–100?

**Is the function named `analyze_marks` with the required signature?** no - it is not a function; it is a CLI script.

**First impression before testing** At first it looked like a simple working program, but after looking at it more carefully I saw that it was based on many assumptions.

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100; raise ValueError for an empty list, non-numeric values, or out-of-range values. Use no external libraries. Return code plus a short explanation.

**What B fixed compared to A:**

1. Now the AI knew that I needed a function called analyze_marks with a specific signature.
2. It also knew what to do with invalid marks and what values the function should return.

**What B still leaves open:**

1. It does not ask the AI to write tests.
2. It does not ask the AI to explain its assumptions or give an example.

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

Example: analyze_marks([40, 60, 80], 50) -> average 60, highest 80, lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list, text value, and marks below 0 or above 100. State any remaining assumptions before the code.

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | yes |
| decimals | yes |
| custom pass_mark | yes |
| empty list | yes |
| text value | yes |
| below 0 / above 100 | yes |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes

**Assumptions C stated explicitly before the code:**

1. marks is an iterable collection of numeric values.
2. Boolean values are rejected as marks.
3. pass_mark is numeric and should be between 0 and 100.
4. pass_rate is a percentage rounded to two decimal places.

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

You are a Python developer. Implement exactly this function:

analyze_marks(marks, pass_mark=50)

The function must return a dictionary with exactly these four keys:
"average", "highest", "lowest", "pass_rate".

Requirements:
1. marks must be a non-empty collection of numeric values.
2. Every mark must be between 0 and 100 inclusive.
3. If marks is empty, contains a non-numeric value, or contains a value below 0 or above 100, deliberately raise ValueError.
4. A mark passes when mark >= pass_mark.
5. pass_rate must be the percentage of marks that pass.
6. pass_rate must be rounded to 2 decimal places.
7. Do not round average, highest, or lowest unless required for the calculation.
8. Use no external libraries.
9. Do not add a CLI, input(), file handling, classes, or unrelated features.
10. Keep the function signature exactly as specified.
11. Return only the required dictionary from the function.

Worked example:
analyze_marks([40, 60, 80], 50) should return:
{"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67}

Include tests covering exactly these cases:
1. [40, 60, 80], 50 -> average 60, highest 80, lowest 40, pass_rate 66.67
2. [100], 50 -> all values 100
3. [49.5, 50], 50 -> average 49.75, highest 50, lowest 49.5, pass_rate 50.0
4. [] -> ValueError
5. [40, "60"] -> ValueError
6. [-1, 50, 101] -> ValueError

Before the code, briefly state any remaining assumptions. Then provide the Python code and a short explanation.

**What I deliberately added that A, B and C did not have:**

1. I clearly said what the AI should not add, because A added input() and other things I did not need.
2. I wrote the exact dictionary structure and the exact six cases I wanted to test.
3. I added a worked example and asked the AI to show assumptions before the code.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

For me, the biggest unclear part was the input and output format. The first prompt was so short that the AI chose its own way to solve the task. It made a CLI program instead of the function needed for the tests. In Prompt D I removed this ambiguity by giving the exact function signature, return dictionary and by saying not to use input() or a CLI.

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | PASS | PASS | PASS |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | PASS | PASS | PASS |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | PASS | PASS | PASS |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | PASS | PASS | PASS |
| | **Totals** | | 0/6 | 6/6 | 6/6 | 6/6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| A | 1-6 | The code called input() during import, so the harness could not load the function and the run was interrupted with KeyboardInterrupt |

### Pasted terminal output — all four runs

**Prompt A**

Enter student marks separated by commas: ^CTraceback (most recent call last): File "/Users/nurdymbekelizat/se-practice/week-02/tests/test_analyze_marks.py", line 165, in <module> main() ~~~~^^ File "/Users/nurdymbekelizat/se-practice/week-02/tests/test_analyze_marks.py", line 134, in main fn = load_function(target) File ".../week-02/tests/test_analyze_marks.py", line 58, in load_function spec.loader.exec_module(module) File ".../week-02/code/prompt_a.py", line 1, in <module> marks = input("Enter student marks separated by commas: ").split(",") KeyboardInterrupt

**Prompt B**

========================================================================
analyze_marks harness — week-02/code/prompt_b.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: Marks list cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: All marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: Marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_b.py)
========================================================================

**Prompt C**

{'average': 75.0, 'highest': 75, 'lowest': 75, 'pass_rate': 100.0}
{'average': 68.67, 'highest': 80.0, 'lowest': 55.5, 'pass_rate': 100.0}
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 33.33}
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.67}
marks cannot be empty
all marks must be numeric
marks must be between 0 and 100
marks must be between 0 and 100
========================================================================
analyze_marks harness — week-02/code/prompt_c.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.66666666666666
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: all marks must be numeric
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_c.py)
========================================================================

**Prompt D**

========================================================================
analyze_marks harness — week-02/code/prompt_d.py
tolerance for numeric comparison: 0.01
========================================================================
SIGNATURE: ok
------------------------------------------------------------------------
case 1  PASS   analyze_marks([40, 60, 80], 50)
          expect: average=60.0, highest=80, lowest=40, pass_rate=66.67
          got   : average=60.0, highest=80, lowest=40, pass_rate=66.67
------------------------------------------------------------------------
case 2  PASS   analyze_marks([100], 50)
          expect: average=100.0, highest=100, lowest=100, pass_rate=100.0
          got   : average=100.0, highest=100, lowest=100, pass_rate=100.0
------------------------------------------------------------------------
case 3  PASS   analyze_marks([49.5, 50], 50)
          expect: average=49.75, highest=50, lowest=49.5, pass_rate=50.0
          got   : average=49.75, highest=50, lowest=49.5, pass_rate=50.0
------------------------------------------------------------------------
case 4  PASS   analyze_marks([], 50)
          expect: ValueError
          got   : raised ValueError: marks cannot be empty
------------------------------------------------------------------------
case 5  PASS   analyze_marks([40, '60'], 50)
          expect: ValueError
          got   : raised ValueError: marks must contain only numeric values
------------------------------------------------------------------------
case 6  PASS   analyze_marks([-1, 50, 101], 50)
          expect: ValueError
          got   : raised ValueError: marks must be between 0 and 100
------------------------------------------------------------------------
RESULT  6 PASS · 0 FAIL · 0 ERROR   (week-02/code/prompt_d.py)
========================================================================

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 0 | 2 | 2 | 2 |
| Requirement coverage | 0 | 2 | 2 | 2 |
| Verifiability (tests) | 0 | 1 | 2 | 2 |
| Assumptions stated | 0 | 0 | 2 | 2 |
| Noise (2 = none) | 1 | 2 | 1 | 2 |
| **Total / 10** | 1 | 7 | 9 | 10 |

**Prompt length, in words:** A 7 · B 46 · C 87 · D 197

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

B over A: 6.5 words per point
C over B: 20.5 words per point
D over C: 110 words per point

For me, this shows that adding more words helped a lot at first, but later I had to add many more words to get only a small improvement.

## 8. Conclusion — 150–200 words

Prompt D got the highest score, 10/10. I would also use something close to D for a real coding task because it is much easier to understand what exactly I need from the AI. The biggest improvement came when I added the exact function signature and clear validation rules. Case 4 shows this well. With Prompt A, the program used input() and the harness could not even load the required function. With Prompt B, the function correctly raised ValueError for an empty list. So this was not only about getting a better answer, but about making the answer testable.
The main noise was in Prompt C. The AI added several assumptions and also printed its own tests before the harness output. These prints were not needed for my task. The biggest ambiguity I noticed was the input and output format. Prompt A did not say if I wanted a function or a normal program, so the AI chose a CLI. In Prompt D I solved this by giving the exact function name, signature, dictionary keys and test cases. After that, all six harness cases passed.

**Word count:**

Word count: 168

## 9. Two questions for the debrief

Written before class, answered in class.

1. How can I make a prompt more specific without making it unnecessarily long?
2. When is it better for AI to make an assumption, and when should it ask a clarification question?