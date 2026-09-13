# Week 01 — Manual vs AI: Comparison

**Name: Elizat Nurdymbek**
**Group:Monday 16:00-19:00**
**Date:07.09.2026**

---

## 1. Facts

| | Manual (Part 1) | Rocket (Part 2) |
| --- | --- | --- |
| Language / stack used | Python | Next.js + TypeScript|
| Time to first version that ran | 22 minutes | 7 minutes |
| Time to all 4 test cases passing | 34 minutes | 18 minutes |
| Number of attempts / prompts needed | 3 | Initial prompt + 2 questions + 1 follow-up|
| Lines of code you actually wrote | 28 | 0 |
| Did it handle invalid marks (case B)? | Yes | avg 71.6 · high 100 · low 47 · pass 80.0%; skipped -5, 101, abc |
| Did it handle an empty list (case D)? | Yes | Yes — showed a clear message |
| Did it use the ≥ 50 pass threshold? | Yes | Yes |
| Output format matches the spec? | Yes | Mostly yes, but Rocket added extra outputs/features |
| Can you explain every line of it? | Yes | No / not every line |

## 2. Test results

| Case | Input | Manual output | Rocket output | Spec says | Match? |
| --- | --- | --- | --- | --- | --- |
| A    | `85, 23, 45, 90, 92`                  | avg 67.00 · high 92 · low 23 · pass 60.0%  | avg 67.0 · high 92 · low 23 · pass 60.0%          | avg 67.00 · high 92 · low 23 · pass 60.0%  | **Yes** |
| B    | `88, 47, -5, 101, abc, 73, 50, , 100` | avg 71.60 · high 100 · low 47 · pass 80.0% | Skipped `-5`, `101`, `abc`; valid marks processed | avg 71.60 · high 100 · low 47 · pass 80.0% | **Yes** |
| C    | `10, 20, 30`                          | avg 20.00 · high 30 · low 10 · pass 0.0%   | avg 20.0 · high 30 · low 10 · pass 0.0%           | avg 20.00 · high 30 · low 10 · pass 0.0%   | **Yes** |
| D    | `abc, , xyz`                          | clear message, no crash                    | `No valid numbers found...`                       | clear message, no crash                    | **Yes** |


## 3. What the AI added that I never asked for

<!-- Tech stack, UI, extra features, a pass threshold it invented, styling, etc. -->
- It chose Next.js and TypeScript even though I did not specify a technology stack.
- It added median, standard deviation and a grade distribution chart.
- It added a configurable pass threshold slider, skipped-entry warnings and a sortable marks table.
- It also turned the simple program into a web-based tool for teachers.

## 4. What the AI got wrong or silently skipped

- At first, when the average was exactly equal to the pass mark, the app described it as "Above pass mark". This was incorrect because 50 should be treated as "At pass mark", not above it.
- I also noticed that Rocket added many features that were not part of the original task, so I had to check that the extra functionality did not change the required results.

## 5. The defect I asked Rocket to fix

**Prompt I used:**
The class average status is incorrect when the average is exactly equal to the pass mark. Please fix the logic so that an average equal to the pass mark is not described as "Above pass mark". Keep the existing pass/fail calculation and other outputs unchanged.

**Result:** fixed

**What this tells me:**
It shows that even when an AI-generated application looks correct, edge cases still need to be tested by a human. The AI was able to fix the problem after I gave it a specific prompt, but I had to find the problem first.

## 6. Reflection (200–300 words)

1. Which parts of the work did the AI genuinely speed up?

Rocket was much faster at creating the first working version of the application. It created the web interface, calculations and input handling without me having to write everything from the beginning. It also added useful features like skipped-entry warnings and a pass threshold slider.

2. Where did the AI cost you time, or give you something that looked right but was not?

The AI also created things that I did not ask for, such as median, standard deviation and a chart. This made the application more complicated than the original task. I also found a problem with the pass mark. When the average was exactly 50, it was described as "Above pass mark". I had to write another prompt to fix it and then test it again.

3. Which of these two artefacts would you be willing to put your name on, and why?

I would put my name on both, but for different reasons. The manual version is easier for me to understand because I wrote it myself. The Rocket version looks more like a real application and has more features, but I cannot explain every line of its code.

4. What must a human engineer still be responsible for after this experiment?

A human engineer still needs to understand the requirements, test the result, find edge cases and decide whether extra features are actually useful. AI can create something quickly, but it does not mean the result is automatically correct. The final responsibility for the software should still belong to the human.