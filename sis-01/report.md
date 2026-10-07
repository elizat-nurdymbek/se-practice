# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.5 - Different application types

---

## 1. Scenario

**Question:** How do different application types require different engineering techniques, particularly in testing, security, reliability and system constraints?

**Users:** System A is a fictional university room-booking web application used by students and administrators. System B is a fictional mobile banking application used by customers and bank employees.

**Problem:** System A helps students find and reserve study rooms. System B allows customers to view account balances and make financial transfers.

**Constraints:** System A limits each booking to two hours and must prevent double-booking. System B requires transaction validation and strong authentication.

**Risk:** A failure in System A could cause booking conflicts and inconvenience. A failure in System B could expose personal data, enable unauthorized transactions or cause financial loss.

**Assumptions:** Both systems are fictional. Their technologies, user numbers, detailed data and performance targets are unspecified. The comparison focuses on the engineering priorities suggested by the stated constraints and risks.

## 2. Analysis

System A and System B are different application types with different risks, constraints and engineering priorities. The comparison shows that engineering techniques should depend mainly on the consequences of failure and the system constraints, rather than simply on whether an application is web or mobile.
For System A, the maximum two-hour booking time creates a clear validation requirement. Functional and boundary testing can check that bookings within the allowed limit are accepted and longer bookings are rejected. The no-double-booking constraint creates a more technical issue. If two users try to reserve the same room at nearly the same time, the system needs to maintain a consistent booking state. This means testing should consider concurrent requests, database consistency and integration between the application and its data storage. Transaction isolation is one general technique for controlling how concurrent transactions interact, although the fictional scenario does not specify PostgreSQL or any particular database technology.
Usability is also important because students need to find rooms and complete bookings efficiently. Availability and performance can be considered, especially if the system experiences periods of high demand. However, the scenario does not specify user numbers, uptime targets or actual peak periods, so these should be treated as engineering considerations rather than fixed requirements.
System B has potentially more serious consequences of failure in this fictional scenario. An incorrect financial transaction could cause financial loss, while a security failure could expose personal information or allow an unauthorized transaction. Therefore, authentication, authorization, transaction validation and security testing should receive greater emphasis. OWASP MASVS identifies authentication and authorization as security control areas for mobile applications. NIST guidance also discusses security requirements, vulnerabilities and testing methods for mobile applications.
Reliability and transaction correctness are also important for System B. For example, testing should consider invalid transactions, unauthorized requests and failures during transaction processing. Penetration testing can be a useful security technique, but it is not a stated mandatory requirement of this fictional system. Similarly, fraud monitoring may be appropriate in a real banking environment, but it is not specified in the scenario.
The main trade-off is between engineering effort and the consequences of failure. System A can place greater emphasis on usability, correct booking behavior and consistency, while System B needs stronger emphasis on security and transaction reliability because the fictional scenario assigns it higher-impact risks. This comparison should not be generalized to every room-booking or banking application.

## 3. Review

The review identified ten concerns in the initial AI-generated draft. I accepted feedback points 1, 2, 3, 4, 5, 6, 8 and 10 because they identified unsupported assumptions, vague engineering terminology or missing links between constraints and techniques. I qualified points 7 and 9. I rejected none.
First, the draft referred to financial compliance requirements that were not defined in the scenario. I treated this as a verification gap instead of presenting specific regulations as confirmed system requirements. The draft also assumed that room-booking demand would increase at the beginning of a semester. I changed this to a possible reason for peak-period testing, not an established fact.
Second, the original explanation of double-booking was too general. I connected the constraint to concurrent requests, consistent booking state and transaction isolation. PostgreSQL documentation supports the general concept of transaction isolation, but it does not mean that this fictional application must use PostgreSQL.
Third, I made the security discussion more specific. Instead of simply saying that banking needs a security-first approach, I connected the scenario to authentication, authorization, transaction validation and security testing. I used OWASP MASVS and NIST guidance to check general claims about mobile application security.
I qualified the suggestion of penetration testing. It can be a useful technique, but the scenario does not make it mandatory. I also qualified the claim that banking is always higher risk than room booking. In this particular fictional comparison, banking failures have potentially more serious consequences, but that conclusion should not be generalized to every application.
Finally, I treated fraud monitoring as a possible real-world consideration rather than a stated requirement. These changes helped separate scenario facts, assumptions, recommendations and claims requiring evidence.

## 4. Conclusion

Both systems require software engineering techniques for testing, security and reliability, but the priorities are different because their constraints and consequences of failure are different. System A should focus on correct booking rules, usability, validation and preventing inconsistent room allocation. Its two-hour limit supports boundary testing, while its no-double-booking rule creates a need to consider concurrent requests and data consistency.
System B requires greater emphasis on authentication, authorization, security testing and reliable transaction processing because failures could have more serious consequences in the fictional scenario. However, specific regulations, database technologies, availability targets and detailed security requirements cannot be assumed without additional evidence.
The comparison therefore shows that application type alone does not determine engineering techniques. Risk, constraints and consequences of failure are more useful factors when deciding where engineering effort should be concentrated.

## 5. Reflection

Using AI for this task helped me generate and then critically review engineering ideas, but it also showed me that an AI-generated explanation can make reasonable assumptions sound like facts. The most useful part of the process was the review stage because it identified claims such as financial compliance and beginning-of-semester demand that were not actually specified in my scenario.
I also learned that technical terms need to be connected to a specific engineering problem. For example, saying that a room-booking system needs security or that a banking system needs stress testing is less useful than explaining what should actually be tested. The double-booking example helped me understand that a simple functional requirement can also create a concurrency and consistency problem.
The source verification stage was also important. I checked claims about mobile application security and transaction isolation instead of accepting the AI's explanation automatically. I learned that a source can support a general engineering principle without proving that the same technology or requirement must be used in my fictional system.

## 6. References

- OWASP Foundation. Mobile Application Security Verification Standard (MASVS). Control Groups; MASVS-AUTH: Authentication and Authorization. Accessed 6 October 2026.
https://mas.owasp.org/MASVS/
https://mas.owasp.org/MASVS/07-MASVS-AUTH/
- PostgreSQL Global Development Group. PostgreSQL 16 Documentation. Section 13.2, “Transaction Isolation.” Accessed 6 October 2026.
https://www.postgresql.org/docs/16/transaction-iso.html
- National Institute of Standards and Technology (NIST). Guidance for Secure Authorization of Mobile Applications in a Corporate Environment. Published 19 March 2015. Accessed 6 October 2026.
https://www.nist.gov/publications/guidance-secure-authorization-mobile-applications-corporate-environment
https://csrc.nist.gov/pubs/itlb/2015/03/guidance-for-secure-authorization-of-mobile-applic/final

## 7. Appendix A — Initial outline

1. Application type and domain: We compare a university room-booking web application (System A) and a mobile banking application (System B) because they have very different risk profiles, data criticality, and reliability requirements.
2. Users and problems: In System A, students and administrators solve the problem of finding and reserving available study rooms. In System B, customers and bank employees deal with securely viewing balances and making financial transfers.
3. System constraints: For the booking system, there is a strict maximum of two hours per booking slot and double-booking of one room should not be allowed. For mobile banking, transaction validation, strong authentication, and applicable financial requirements are important constraints.
4. System failure risks: A booking failure could cause scheduling conflicts and inconvenience. A banking failure could lead to personal-data exposure, unauthorized transfers, financial loss, and legal consequences.
5. Engineering priorities and methods: System A should focus on usable UI/UX, integration testing, and availability during peak periods such as the beginning of a semester. System B requires a security-first approach, strong authentication, transaction consistency, stress testing, fraud monitoring, and security testing such as penetration testing.

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** ChatGPT
- **Model:** GPT-5.6 Luna
- **Date:** 2026-10-06
- **Purpose:** Generate an initial analysis of Topic 1.5.

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic 1.5 — Different application types: compare two application types and the engineering techniques they need. Check whether AI gives useful distinctions about risk, testing and system constraints for a first-year-level university assignment.

My scenario is System A is a fictional university room-booking web application used by students and university administrators; System B is a fictional mobile banking application used by bank customers and employees. System A addresses finding and reserving available study rooms; System B addresses securely viewing balances and making financial transfers. Constraints: System A has a maximum booking time of two hours and must prevent double-booking; System B requires transaction validation and strong user authentication. Risk: failures in System A could cause booking conflicts and inconvenience; failures in System B could expose personal data, enable unauthorized transfers, cause financial loss, or create legal consequences. My initial ideas are 1. Application type and domain: We compare a university room-booking web application (System A) and a mobile banking application (System B) because they have very different risk profiles, data criticality and reliability requirements. 2. Users and problems: In System A, students and administrators solve the problem of finding and reserving available study rooms. In System B, customers and bank employees solve the problem of securely viewing balances and making financial transfers. 3. System constraints: For the booking system, there is a strict maximum of two hours per booking slot and double-booking of one room should not be allowed. For mobile banking, transaction validation, two-factor authentication and compliance with financial regulations such as PCI-DSS and AML are important constraints. 4. System failure risks: A booking failure could cause scheduling conflicts and inconvenience. A banking failure could lead to personal-data exposure, unauthorized transfers, financial loss and legal consequences. 5. Engineering priorities and methods: System A should focus on simple UI/UX, basic integration testing and availability during peak periods such as the beginning of a semester. System B requires a security-first approach, including encryption and authentication, high transaction consistency, stress testing, continuous fraud monitoring and penetration testing. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
### Different Application Types: Room Booking and Mobile Banking

System A and System B are two different application types with different engineering priorities. System A is a university room-booking web application used by students and university administrators. System B is a mobile banking application used by bank customers and employees. The main difference is the level and type of risk: a failure in the booking system mainly causes inconvenience, while a banking failure can have serious security, financial, and legal consequences.

**Facts from the scenario.** System A allows students to find and reserve available study rooms. It has a maximum booking time of two hours and must prevent double-booking of the same room. System B allows customers to view account balances and make financial transfers. It requires transaction validation, strong user authentication, and compliance with applicable financial requirements. The scenario also states that the examples are fictional and created for this assignment.

The systems therefore need different engineering techniques. For System A, usability and availability are important because students need to find rooms and make bookings efficiently. Functional and integration testing should check that bookings are created correctly, the two-hour limit is enforced, and two users cannot successfully book the same room at the same time. Availability testing is also useful during busy periods, such as the beginning of a semester. Security is still necessary because the system contains user and booking information, but the consequences of failure are generally lower than in banking.

System B requires a stronger security-first approach. Authentication and authorization should be tested carefully to prevent unauthorized access or transactions. Transaction validation and consistency are important so that financial operations are processed correctly. Security testing, including vulnerability assessment and penetration testing where appropriate, can help identify weaknesses. Reliability and stress testing are also important because failures during financial transactions could have much greater consequences.

**Assumptions.** This comparison assumes that System A is a web-based system accessed through a browser and that System B is connected to banking services capable of processing real financial transactions. It also assumes that System A has periods of higher demand at the beginning of semesters. These details are reasonable for the comparison but are not explicitly stated in the scenario.

There are also trade-offs. Increasing security and testing in System B can require more development time, resources, and complexity. However, these costs are justified by the potential impact of security or transaction failures. System A can place more emphasis on usability and convenience, but it still needs sufficient testing to maintain reliable room allocation.

**Claims to verify.** Before submitting, I should verify what specific financial regulations and security requirements apply to mobile banking in the intended jurisdiction. I should also verify whether penetration testing, fraud monitoring, or particular authentication methods are explicitly required by the course material. These should not be presented as requirements of the fictional system unless they are supported by the assignment materials or reliable sources.

Overall, both applications require testing, security, and reliability, but the engineering priorities differ because their risks, data, and consequences of failure are different.
```

### B2 — Critique (Prompt B)

- **Tool:** ChatGPT
- **Model:** GPT-5.6 Luna
- **Date:** 2026-10-06
- **Purpose:** Critically review the initial draft.

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: 1.5 — Different application types: compare two application types and the engineering techniques they need. Check whether AI gives useful distinctions about risk, testing and system constraints. Scenario: System A is a fictional university room-booking web application used by students and university administrators; System B is a fictional mobile banking application used by bank customers and employees. System A addresses finding and reserving available study rooms; System B addresses securely viewing balances and making financial transfers. Constraints: System A has a maximum booking time of two hours and must prevent double-booking; System B requires transaction validation and strong user authentication. Risk: failures in System A could cause booking conflicts and inconvenience; failures in System B could expose personal data, enable unauthorized transfers, cause financial loss, or create legal consequences. Draft: Different Application Types: Room Booking and Mobile Banking. System A and System B are two different application types with different engineering priorities. System A is a university room-booking web application used by students and university administrators. System B is a mobile banking application used by bank customers and employees. The main difference is the level and type of risk: a failure in the booking system mainly causes inconvenience, while a banking failure can have serious security, financial, and legal consequences.

**Facts from the scenario.** System A allows students to find and reserve available study rooms. It has a maximum booking time of two hours and must prevent double-booking of the same room. System B allows customers to view account balances and make financial transfers. It requires transaction validation, strong user authentication, and compliance with applicable financial requirements. The scenario also states that the examples are fictional and created for this assignment.

The systems therefore need different engineering techniques. For System A, usability and availability are important because students need to find rooms and make bookings efficiently. Functional and integration testing should check that bookings are created correctly, the two-hour limit is enforced, and two users cannot successfully book the same room at the same time. Availability testing is also useful during busy periods, such as the beginning of a semester. Security is still necessary because the system contains user and booking information, but the consequences of failure are generally lower than in banking.

System B requires a stronger security-first approach. Authentication and authorization should be tested carefully to prevent unauthorized access or transactions. Transaction validation and consistency are important so that financial operations are processed correctly. Security testing, including vulnerability assessment and penetration testing where appropriate, can help identify weaknesses. Reliability and stress testing are also important because failures during financial transactions could have much greater consequences.

**Assumptions.** This comparison assumes that System A is a web-based system accessed through a browser and that System B is connected to banking services capable of processing real financial transactions. It also assumes that System A has periods of higher demand at the beginning of semesters. These details are reasonable for the comparison but are not explicitly stated in the scenario.

There are also trade-offs. Increasing security and testing in System B can require more development time, resources, and complexity. However, these costs are justified by the potential impact of security or transaction failures. System A can place more emphasis on usability and convenience, but it still needs sufficient testing to maintain reliable room allocation.

**Claims to verify.** Before submitting, I should verify what specific financial regulations and security requirements apply to mobile banking in the intended jurisdiction. I should also verify whether penetration testing, fraud monitoring, or particular authentication methods are explicitly required by the course material. These should not be presented as requirements of the fictional system unless they are supported by the assignment materials or reliable sources.

Overall, both applications require testing, security, and reliability, but the engineering priorities differ because their risks, data, and consequences of failure are different.
```

**Response:**

```text
Your draft is **mostly aligned with the chosen question and scenario**, but there are a few places where you move from scenario facts into assumptions or general software-engineering claims without enough qualification.

### 1. “Compliance with applicable financial requirements”

**Concern:** “Compliance with applicable financial requirements” is **not in your scenario**. Your scenario only says strong authentication and transaction validation. The draft later correctly identifies regulations as something to verify, but here it has already presented compliance as a system requirement.

**Why it matters:** The assignment specifically asks you to distinguish what AI says from what is actually supported. This is a good example of an AI-generated assumption being accidentally turned into a fact.

**How to check:** Look at the assignment handout/rubric. If it doesn't specify financial regulations, remove this from “Facts” or label it as an additional real-world consideration.

**Alternative interpretation:** The fictional banking system may deliberately be simplified to **only** require authentication and transaction validation. You don't need to introduce regulatory compliance to make the comparison.

---

### 2. “Usability and availability are important”

**Concern:** This is reasonable engineering reasoning, but “availability” is **not explicitly given as a constraint**.

**Why it matters:** You should distinguish between a requirement from the scenario and an engineering priority you inferred.

**How to check:** Ask: *Does the scenario say the system must be available at a particular uptime or during particular periods?* If not, present availability as a reasonable engineering consideration rather than a stated requirement.

**Alternative interpretation:** Because room booking is not safety-critical, usability might actually be more important than extremely high availability. A short outage could be inconvenient but not cause financial loss.

---

### 3. “Beginning of a semester”

**Concern:** The scenario never says that demand increases at the beginning of semesters.

**Why it matters:** This is a plausible assumption, but currently it looks like a fact.

**How to check:** Either support it with course material or explicitly keep it as an assumption.

**Counterexample:** Students might book rooms fairly evenly throughout the semester. Alternatively, demand could peak before exams rather than at the beginning of the semester.

---

### 4. “Two users cannot successfully book the same room at the same time”

**Concern:** This is basically correct, but it could be more precise technically.

**Why it matters:** The important engineering issue isn't merely whether the UI prevents two users from clicking “Book.” The system needs to maintain **consistent booking state when concurrent requests arrive**.

**How to check:** Check whether the course material discusses concurrency, transactions, database constraints, or race conditions.

**Counterexample:** Both users might see the room as available. The system still needs to ensure that only one booking succeeds when their requests reach the server nearly simultaneously.

---

### 5. “Security is still necessary because the system contains user and booking information”

**Concern:** Reasonable, but “contains user and booking information” is an inference about the implementation/data rather than something fully specified.

**Why it matters:** You shouldn't imply that the scenario explicitly says what personal information is stored.

**How to check:** Check the scenario for specified data types. If none are given, say that security is still relevant because users need controlled access to accounts and bookings.

**Alternative interpretation:** The fictional system might store only basic student IDs and booking information, making its security requirements different from a banking system that handles financial credentials and transactions.

---

### 6. “Banking requires a stronger security-first approach”

**Concern:** The conclusion is reasonable, but “security-first” is somewhat vague.

**Why it matters:** The question asks about **engineering techniques**, so it is stronger to connect the risk to concrete techniques.

**Alternative interpretation:** Banking isn't only a security problem. Transaction correctness, reliability, availability, auditability, and recovery are also critical.

---

### 7. “Penetration testing where appropriate”

**Concern:** This is a legitimate real-world security technique, but it isn't required by your fictional scenario.

**Why it matters:** You don't want the reader to think the assignment explicitly requires penetration testing.

**How to check:** Check the course material for its testing/security techniques. If penetration testing isn't mentioned, keep it as an example rather than a requirement.

**Alternative interpretation:** For a classroom fictional system, security testing might simply mean testing authentication, authorization, input validation, and transaction controls rather than conducting a full penetration test.

---

### 8. “Stress testing” for System B

**Concern:** This is reasonable, but the draft doesn't explain **what kind of stress or failure** you mean.

**Why it matters:** “Stress testing” can sound like a generic buzzword unless connected to the scenario.

**How to check:** Ask what happens if many users transfer money simultaneously, if a transaction request times out, or if the connection fails during a transaction.

**Counterexample:** A banking system could perform well under heavy load but still have a serious problem if a transaction is processed twice after a network retry. So **transaction consistency/recovery** may be more important than raw stress testing in some situations.

---

### 9. The risk comparison is slightly too simplified

**Concern:** The scenario does describe booking failures as lower-risk, but “mainly inconvenience” can be too broad.

**Why it matters:** A booking system could potentially cause more serious consequences depending on what it controls.

**Counterexample:** Imagine the room-booking system is used for examination rooms or accessibility-required facilities. A booking failure could create more than ordinary inconvenience.

For **your fictional scenario**, however, the intended comparison clearly makes banking the higher-impact system. So this isn't a major problem—just avoid making the statement sound universally true for all room-booking systems.

---

### 10. You could make the system constraints more explicit

The draft discusses the two-hour limit and double-booking, but the comparison could reason more explicitly about **why these constraints affect engineering**.

For example:

- **Two-hour maximum** → boundary/validation testing.
- **No double-booking** → concurrency, database consistency, integration testing.
- **Transaction validation** → input/business-rule validation and transaction correctness.
- **Strong authentication** → authentication and authorization/security testing.

The strongest core argument to preserve is: **both systems need good engineering, but their priorities differ because the consequences of failure differ—and those consequences determine where testing, security, reliability, and consistency receive more emphasis.
```

### B3 — Revision (Prompt C)

- **Tool:** ChatGPT
- **Model:** GPT-5.6 Luna
- **Date:** 2026-10-06
- **Purpose:** Revise the initial draft using accepted/qualified review decisions and verified source evidence.

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: Accepted feedback: 1, 2, 3, 4, 5, 6, 8 and 10. I accepted these because the review correctly identified unsupported assumptions, vague engineering terminology, and missing links between system constraints and engineering techniques. I will qualify feedback 7 because penetration testing is a useful security technique but is not a stated requirement of my fictional system. I will qualify feedback 9 because the booking system has lower-impact risks in my fictional scenario, but this should not be generalized to every room-booking system. I rejected no feedback. Verified evidence: OWASP Mobile Application Security Verification Standard (MASVS), Control Groups and MASVS-AUTH: Authentication and Authorization; accessed 6 October 2026. OWASP identifies authentication and authorization as security control areas for mobile applications and describes MASVS as a standard that can be used for security verification. PostgreSQL Documentation 16, Section 13.2 “Transaction Isolation”; accessed 6 October 2026. The documentation explains how concurrent transactions interact and describes transaction isolation, including Serializable isolation. NIST, “Guidance for Secure Authorization of Mobile Applications in the Corporate Environment”, published 19 March 2015; accessed 6 October 2026. NIST discusses mobile application security requirements, vulnerabilities and testing methods. These sources support general engineering principles, not specific mandatory requirements for my fictional systems. Draft: Different Application Types: Room Booking and Mobile Banking. System A and System B are two different application types with different engineering priorities. System A is a university room-booking web application used by students and university administrators. System B is a mobile banking application used by bank customers and employees. The main difference is the level and type of risk: a failure in the booking system mainly causes inconvenience, while a banking failure can have serious security, financial, and legal consequences.

**Facts from the scenario.** System A allows students to find and reserve available study rooms. It has a maximum booking time of two hours and must prevent double-booking of the same room. System B allows customers to view account balances and make financial transfers. It requires transaction validation, strong user authentication, and compliance with applicable financial requirements. The scenario also states that the examples are fictional and created for this assignment.

The systems therefore need different engineering techniques. For System A, usability and availability are important because students need to find rooms and make bookings efficiently. Functional and integration testing should check that bookings are created correctly, the two-hour limit is enforced, and two users cannot successfully book the same room at the same time. Availability testing is also useful during busy periods, such as the beginning of a semester. Security is still necessary because the system contains user and booking information, but the consequences of failure are generally lower than in banking.

System B requires a stronger security-first approach. Authentication and authorization should be tested carefully to prevent unauthorized access or transactions. Transaction validation and consistency are important so that financial operations are processed correctly. Security testing, including vulnerability assessment and penetration testing where appropriate, can help identify weaknesses. Reliability and stress testing are also important because failures during financial transactions could have much greater consequences.

**Assumptions.** This comparison assumes that System A is a web-based system accessed through a browser and that System B is connected to banking services capable of processing real financial transactions. It also assumes that System A has periods of higher demand at the beginning of semesters. These details are reasonable for the comparison but are not explicitly stated in the scenario.

There are also trade-offs. Increasing security and testing in System B can require more development time, resources, and complexity. However, these costs are justified by the potential impact of security or transaction failures. System A can place more emphasis on usability and convenience, but it still needs sufficient testing to maintain reliable room allocation.

**Claims to verify.** Before submitting, I should verify what specific financial regulations and security requirements apply to mobile banking in the intended jurisdiction. I should also verify whether penetration testing, fraud monitoring, or particular authentication methods are explicitly required by the course material. These should not be presented as requirements of the fictional system unless they are supported by the assignment materials or reliable sources.

Overall, both applications require testing, security, and reliability, but the engineering priorities differ because their risks, data, and consequences of failure are different.

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
### Topic 1.5 — Different Application Types

System A and System B are two different application types with different risks, constraints and engineering priorities. System A is a fictional university room-booking web application used by students and administrators. System B is a fictional mobile banking application used by customers and bank employees. The comparison shows that engineering techniques should depend on the consequences of failure rather than simply on whether an application is web or mobile.

**System A: University room-booking web application.**
The stated constraints are that a booking can last a maximum of two hours and that the same room must not be double-booked. These constraints create a need for validation and reliable handling of concurrent booking requests. For example, database transaction isolation can help control how concurrent transactions interact. PostgreSQL documentation describes transaction isolation and Serializable isolation as mechanisms for controlling concurrent transactions. However, this does not mean that PostgreSQL or Serializable isolation is a mandatory requirement of this fictional system; the specific implementation has not been defined.

Testing should therefore include functional tests for booking rules and integration tests to check that the application and database work together correctly. Usability is also important because students need to find available rooms and make bookings efficiently. Availability during busy periods could be another engineering concern, but the scenario does not provide actual user numbers or performance requirements. Therefore, peak-period testing is a reasonable recommendation, not a stated system requirement.

**System B: Mobile banking application.**
The consequences of failure are potentially much more serious in this fictional scenario. An error could expose personal data, allow an unauthorized transaction or cause financial loss. The stated constraints include transaction validation, strong authentication and applicable financial requirements. OWASP MASVS identifies authentication and authorization as security control areas for mobile applications, supporting the use of security verification as an engineering concern. NIST also discusses mobile application security requirements, vulnerabilities and testing methods.

Therefore, System B should place greater emphasis on security, authentication, authorization and reliable transaction processing. Security testing, including penetration testing, is a useful technique, but penetration testing is **not stated as a mandatory requirement** in this fictional scenario. Similarly, fraud monitoring may be appropriate for a real banking system, but it is an additional assumption rather than a specified feature here.

The main trade-off is between engineering effort and the consequences of failure. System A can reasonably prioritize usability, correct booking behaviour and availability, while System B needs stronger security and transaction reliability because its potential impact is higher. However, this does not mean every room-booking system has low-impact risks or every banking application has exactly the same requirements.

**Facts, assumptions and verification gaps.**
The systems, users and stated constraints are facts within the fictional scenario. Recommendations such as peak-load testing, penetration testing and fraud monitoring are engineering suggestions. The actual database technology, expected number of users, availability targets, applicable financial regulations and detailed security requirements are not specified and should be verified before making stronger claims.

### What I changed and why

| Change | Why |
|---|---|
| Changed “web vs mobile” into a comparison of risk, constraints and consequences | Application type alone does not determine engineering priorities. |
| Qualified the two-hour booking and double-booking rules | These are explicit scenario constraints, so they should drive the engineering discussion. |
| Added concurrency/transaction isolation carefully | PostgreSQL supports the principle, but the scenario does not require PostgreSQL specifically. |
| Kept peak-period testing as a recommendation | There is no evidence for actual peak loads or performance requirements. |
| Strengthened the banking security/authentication discussion | This is supported by the OWASP MASVS and NIST sources supplied. |
| Qualified penetration testing | It is useful, but not a stated requirement of the fictional system. |
| Removed/qualified fraud monitoring | It is plausible for real banking, but the scenario does not specify it. |
| Added the trade-off between engineering effort and consequences of failure | This directly answers the engineering-techniques comparison. |
| Added an explicit facts vs assumptions vs gaps distinction | This avoids unsupported claims. |
| Avoided saying System A is universally “low risk” | The comparison is limited to the fictional scenario. |
```

## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Mobile banking applications need concrete security controls and security testing, including authentication and authorization | OWASP Mobile Application Security Verification Standard (MASVS), “Control Groups” and “MASVS-AUTH: Authentication and Authorization”. https://mas.owasp.org/MASVS/ ; accessed 6 October 2026. | OWASP identifies authentication and authorization as a dedicated MASVS control group and describes MASVS as a standard that can be used by security testers to verify mobile application security. | qualify |
| Preventing double-booking can require handling concurrent transactions consistently, not only checking the booking button in the user interface. | PostgreSQL Documentation 16, Section 13.2 “Transaction Isolation”. https://www.postgresql.org/docs/16/transaction-iso.html ; accessed 6 October 2026. | The documentation explains how concurrent transactions interact and describes transaction isolation, including Serializable isolation, which guarantees an effect equivalent to running concurrent transactions one at a time. | keep |
| Security testing of mobile applications can include systematic verification of security controls rather than only checking whether login works. | NIST, Guidance for Secure Authorization of Mobile Applications in a Corporate Environment. https://www.nist.gov/publications/guidance-secure-authorization-mobile-applications-corporate-environment; accessed 6 October 2026. | NIST describes mobile application security vetting, development of security requirements, identification of vulnerabilities and testing methods used to detect them. | keep |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| “compliance with applicable financial requirements” | Financial regulations are treated as a verification gap rather than a stated requirement. | Specific regulations were not provided in the fictional scenario. |
| “availability testing is useful during busy periods, such as the beginning of a semester” | Peak-period testing is presented as a recommendation if the system experiences high demand. | Beginning-of-semester demand was an unsupported assumption.|
| “two users cannot successfully book the same room at the same time” | The double-booking constraint is connected to concurrent requests, transaction handling and consistency. | This gives a more technically precise explanation of the engineering problem. |
| “System B requires a stronger security-first approach” | System B receives greater emphasis on authentication, authorization, security testing and transaction reliability. | “Security-first” was too vague and did not directly identify engineering techniques. |
| “penetration testing” as a requirement | Penetration testing is described as a useful technique but not a mandatory requirement. | The fictional scenario does not specify penetration testing. |
| “fraud monitoring” as a requirement | Fraud monitoring is described as a possible real-world consideration and an additional assumption. | It was not specified in the scenario or verified as a requirement. |