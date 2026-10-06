# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.5 - Different application types

---

## 1. Scenario

**Question:** How do different application types require different engineering priorities, especially in risk, testing, security, reliability, and system constraints?

**Users:** System A is a university room-booking web application used by students and university administrators. System B is a mobile banking application used by bank customers and employees.

**Problem:** System A helps students find and reserve available rooms for studying. System B allows customers to securely view account balances and make financial transfers.

**Constraints:** System A has a maximum booking time of two hours and must prevent double-booking of the same room. System B requires transaction validation, strong user authentication, and compliance with applicable financial requirements.

**Risk:** A failure in System A could cause booking conflicts and inconvenience. A failure in System B could expose personal data, enable unauthorized transactions, cause financial loss, or create legal consequences.

**Assumptions:** The two systems are fictional examples created for this assignment. The university, its room-booking rules, and the banking application are fictional. The comparison focuses on typical engineering priorities rather than the requirements of a specific real bank or university.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

(write here)

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

(write here)

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

(write here)

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

(write here)

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- (write here)

## 7. Appendix A — Initial outline

1. Application type and domain: We compare a university room-booking web application (System A) and a mobile banking application (System B) because they have very different risk profiles, data criticality, and reliability requirements.
2. Users and problems: In System A, students and administrators solve the problem of finding and reserving available study rooms. In System B, customers and bank employees deal with securely viewing balances and making financial transfers.
3. System constraints: For the booking system, there is a strict maximum of two hours per booking slot and double-booking of one room should not be allowed. For mobile banking, transaction validation, strong authentication, and applicable financial requirements are important constraints.
4. System failure risks: A booking failure could cause scheduling conflicts and inconvenience. A banking failure could lead to personal-data exposure, unauthorized transfers, financial loss, and legal consequences.
5. Engineering priorities and methods: System A should focus on usable UI/UX, integration testing, and availability during peak periods such as the beginning of a semester. System B requires a security-first approach, strong authentication, transaction consistency, stress testing, fraud monitoring, and security testing such as penetration testing.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B2 — Critique (Prompt B)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** critical review of the draft

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

### B3 — Revision (Prompt C)

- **Tool:** (write here)
- **Model:** (write here)
- **Date:** (write here)
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
(paste here)
```

**Response:**

```text
(paste here)
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| (write here) | (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) | (write here) |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |
