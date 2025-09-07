# Bug Report: Example Voting App

**Author:** Victor Gabriel
**Date:** 06/09/2025

---

## Introduction

This document centralizes all bugs and unexpected behaviors found during the execution of the Test Plan. Each bug is documented following the template below to ensure clarity, traceability, and ease of reproduction.

---

## Bug Report Template

```markdown
### BUG-XXX: [Bug Title]

*   **Associated Test Case ID:** (e.g., UI-01)
*   **Severity:** (Critical / High / Medium / Low)
*   **Priority:** (High / Medium / Low)
*   **Environment:**
    *   **OS:**
    *   **Browser:**
    *   **Application Version:** (Commit hash or version)

---

#### Description
(Detailed description of the issue.)

#### Steps to Reproduce
1.
2.
3.

#### Expected Result
(What should have happened.)

#### Actual Result
(What actually happened.)

---

#### Test Evidence

*(Paste screenshots here. In Markdown, you can use the `!Image description` syntax)*
```

---

## Bugs Found

### BUG-001: Overlapping elements on the voting page on mobile screens.

*   **Associated Test Case ID:** `UI-01`
*   **Severity:** Medium
*   **Priority:** Medium
*   **Environment:**
    *   **OS:** Windows 11
    *   **Browser:** Chrome v140.0.7339.81
    *   **Application Version:** Commit `main`

---

#### Description
When viewing the voting page on a small-screen device (e.g., iPhone 12 Pro), the "Cats" and "Dogs" vote buttons overlap, making user interaction difficult.

#### Steps to Reproduce
1.  Access the voting page at `http://localhost:8080`.
2.  Open the browser's developer tools (F12).
3.  Activate the device view mode.
4.  Select the "iPhone 12 Pro" profile.
5.  Observe the button layout.

#### Expected Result
The vote buttons should adjust to the screen size, perhaps by stacking vertically, without overlapping and with a clear clickable area.

#### Actual Result
The buttons remain side-by-side and overlap, making the interface confusing and difficult to use.

#### Test Evidence
*(Visual evidence, such as screenshots or GIFs, is typically attached here to demonstrate the bug.)*

---

### BUG-002: UI state inconsistency when voting in different browser tabs.

*   **Associated Test Case ID:** `IT-06`
*   **Severity:** Medium
*   **Priority:** Low
*   **Environment:**
    *   **OS:** Windows 11
    *   **Browser:** Chrome v140.0.7339.81
    *   **Application Version:** Commit `main`

---

#### Description
When a user votes for an option in one tab and then changes their vote in a second tab, the first tab continues to display an outdated interface state, showing the old vote choice, even though the actual vote in the system has been changed.

#### Steps to Reproduce
1.  Open the voting page (`:8080`) in a new tab (Tab 1).
2.  Open the voting page (`:8080`) in a second tab (Tab 2).
3.  In Tab 1, vote for "Cats". The interface in Tab 1 shows the vote for "Cats".
4.  In Tab 2, vote for "Dogs". The interface in Tab 2 shows the vote for "Dogs".
5.  Check the results page (`:8081`), which correctly shows 1 vote for "Dogs".
6.  Return to Tab 1.

#### Expected Result
Tab 1 should no longer display a voted state for "Cats". Ideally, it should reflect the current vote state ("Dogs") or, at a minimum, revert to the initial selection screen upon detecting a state change.

#### Actual Result
Tab 1 continues to display the message "You have already voted" with the "Cats" option selected, which is inconsistent with the actual vote state in the system.

#### Test Evidence
*(Visual evidence, such as screenshots or GIFs, is typically attached here to demonstrate the bug.)*

---

### BUG-003: Results page breaks with a 500 Error when the database is unavailable.

*   **Associated Test Case ID:** `IT-02`
*   **Severity:** High
*   **Priority:** High
*   **Environment:**
    *   **OS:** Windows 11
    *   **Browser:** Chrome v140.0.7339.81
    *   **Application Version:** Commit `main`

---

#### Description
When the database service (`db`) is stopped, the results page (`:8081`) stops working and displays an unhandled error page (500 Error), instead of a user-friendly message.

#### Steps to Reproduce
1.  With the application running, access the results page at `http://localhost:8081` and confirm that it works.
2.  In the terminal, run the command `docker compose stop db`.
3.  Refresh the results page.

#### Expected Result
The page should display a handled error message, informing the user that the results are temporarily unavailable and to try again later. The application should not "break".

#### Actual Result
The page displays a generic server error (Internal Server Error / 500 Error), which provides a poor user experience and exposes internal system details.

#### Test Evidence
*(Visual evidence, such as screenshots or GIFs, is typically attached here to demonstrate the bug.)*

---

### BUG-004: Votes accumulate instead of being updated when changing the option.

*   **Associated Test Case ID:** `FT-03`, `IT-01`, `IT-04`, `IT-06`
*   **Severity:** Critical
*   **Priority:** High
*   **Environment:**
    *   **OS:** Windows 11
    *   **Browser:** Chrome v140.0.7339.81
    *   **Application Version:** Commit `main`

---

#### Description
The application violates the "one vote per user" business rule. When attempting to change a vote (e.g., from "Cats" to "Dogs"), the system does not update the existing vote, but instead adds a new one. This results in the accumulation of votes for the same user, incorrectly inflating the total results.

#### Steps to Reproduce
1.  Access the voting page (`:8080`) and the results page (`:8081`).
2.  On the voting page, vote for "Cats".
3.  On the results page, verify that the score is `Cats: 1`, `Dogs: 0`.
4.  Return to the voting page and, in the same session, vote for "Dogs".

#### Expected Result
The vote should be updated. The final result on the results page should be `Cats: 0`, `Dogs: 1`. The total number of votes counted should remain 1.

#### Actual Result
A new vote is added. The final result on the results page becomes `Cats: 1`, `Dogs: 1`. The total number of votes counted incorrectly increases to 2.

#### Test Evidence
*(Visual evidence, such as screenshots or GIFs, is typically attached here to demonstrate the bug.)*