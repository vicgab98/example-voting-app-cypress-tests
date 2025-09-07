 # Test Plan: Example Voting App

**Author:** Victor Gabriel
**Date:** 06/09/2025

---

## 1. Introdução
### 1.1. Project Overview

The project chosen for this challenge is the **"Example Voting App"**, an official Docker demonstration application. It was selected because it represents a modern and realistic microservices architecture, composed of five independent services (voting frontend, results frontend, worker, message queue, and database).

This architectural complexity, despite the interface's simplicity, offers an excellent opportunity to demonstrate a full range of testing skills, including integration testing, resilience, and business rule validation, which go beyond conventional UI tests.


### 1.2. Testing Objectives

This document describes the test plan for the "Example Voting App". The objective is to validate the functionality, resilience, and usability of the application, which is composed of a microservices architecture distributed in Docker containers.

The testing strategy ranges from basic UI checks to complex Chaos Engineering scenarios to ensure system robustness.

## 2. Escopo do Teste
## 2. Test Scope

### 2.1. In Scope

*   **Smoke Tests:** Validation that the main services are up and accessible.
*   **Functional Tests:** Verification of the main voting and results visualization flow.
*   **UI/Responsiveness Tests:** Analysis of the interface's adaptation to different screen sizes.
*   **Integration and Resilience Tests:** Simulation of failures in specific services (`worker`, `db`) to test the system's recovery capability and data integrity.

### 2.2. Out of Scope

*   Load and Performance Tests.
*   In-depth Security Tests (e.g., SQL injection, XSS).
*   Compatibility tests on legacy browsers.

## 3. Estratégia de Teste
## 3. Test Strategy

The approach will be divided into two phases:

1.  **Exploratory Manual Testing:** Execution of all test cases described in this plan to identify bugs and unexpected behaviors. All findings will be documented in the `BUGS.md` file.
2.  **Test Automation:** Implementation of automation scripts with Cypress for critical scenarios, including resilience tests, using the `cy.task()` functionality to interact with Docker containers.

## 4. Casos de Teste
### 4.1. Requisitos do Ambiente de Teste
## 4. Test Cases
### 4.1. Test Environment Requirements

*   **Hardware:** Computer with at least 8GB of RAM.
*   **Software:**
    *   Operating System: Windows, macOS, or Linux.
    *   Docker and Docker Compose.
    *   Modern web browser (Google Chrome, Firefox).
    *   Node.js (to run Cypress automation).
    *   Git for version control.

### 4.2. Avaliação de Risco e Priorização
### 4.2. Risk Assessment and Prioritization

| Risk                                                | Likelihood | Impact   | Test Priority | Associated Test Cases |
| --------------------------------------------------- | ---------- | -------- | ------------- | --------------------- |
| Loss of votes if the `worker` fails                 | Medium     | Critical | **High**      | `IT-01`               |
| Unavailability of the results page if the `db` fails | High       | High     | **High**      | `IT-02`               |
| Violation of the "single vote" rule                 | Low        | Medium   | **Medium**    | `IT-04`               |
| Layout issues on small screens (Responsiveness)     | High       | Medium   | **Medium**    | `UI-01`               |
| Data loss after a full system restart               | Low        | Critical | **High**      | `IT-03`               |

### 4.3. Procedimento de Relatório de Defeitos
### 4.3. Defect Reporting Procedure

All defects found during the testing phase must be documented in the `BUGS.md` file. Each bug report must follow the standard template defined in the document, including a clear title, steps to reproduce, expected vs. actual results, evidence (screenshots), and a severity/priority classification with justification.

### 4.4. Casos de Teste Detalhados
### 4.4. Detailed Test Cases

#### 4.4.1. Smoke Tests

---

#### **ID:** `ST-01` (Formato BDD)
*   **Title:** Access the voting page.
*   **Feature:** Application Accessibility
*   **Scenario:** The voting page should be accessible and functional

    **Given** the application is running
    **When** a user accesses the URL `http://localhost:8080`
    **Then** the page should load with the title "Cats vs Dogs!" and the two vote buttons should be displayed.

---

#### **ID:** `ST-02` (Formato BDD)
*   **Title:** Access the results page.
*   **Feature:** Application Accessibility
*   **Scenario:** The results page should be accessible and functional

    **Given** the application is running
    **When** a user accesses the URL `http://localhost:8081`
    **Then** the page should load with the title "Cats vs Dogs -- Results" and the results chart should be displayed.

#### 4.4.2. Functional Tests

---

#### **ID:** `FT-01` (Formato BDD)
*   **Title:** Vote and verify the result.
*   **Feature:** Voting Flow
*   **Scenario:** A vote should be correctly computed and displayed

    **Given** the application is running and there are no votes cast
    **When** a user accesses the voting page and clicks the "Cats" button
    **And** accesses the results page
    **Then** the results page should display "Cats" with 100% of the votes and "Dogs" with 0%.

---

#### **ID:** `FT-02` (Formato BDD)
*   **Title:** Results interface update.
*   **Feature:** Results Visualization
*   **Scenario:** The results page should reflect new votes without manual interaction

    **Given** the results page (`:8081`) is open and visible
    **When** a user votes on the voting page (`:8080`)
    **Then** the results page should automatically update the vote totals within a few seconds.

---

#### **ID:** `FT-03` (Formato BDD)
*   **Title:** Votes should not accumulate for the same user.
*   **Feature:** Business Rule - Voting
*   **Scenario:** Changing a vote should update the existing vote, not add a new one.

    **Given** a user has already voted for "Cats"
    **And** the current result is "1 vote" for "Cats"
    **When** the same user, in the same session, tries to vote for "Dogs"
    **Then** the final result should be updated to "0 votes" for "Cats" and "1 vote" for "Dogs".
    **And** the total number of votes cast in the system should remain 1.

#### 4.4.3. UI and Responsiveness Tests

---

#### **ID:** `UI-01` (Formato BDD)
*   **Title:** Interface responsiveness on small screens.
*   **Feature:** Interface Responsiveness
*   **Scenario:** Voting page layout on small screens

    **Given** the application is running
    **When** a user accesses the voting page (`:8080`) on a small-screen device
    **Then** the page elements should be visible, readable, and the vote buttons should not overlap.

#### 4.4.4. Integration and Resilience Tests (Chaos Engineering)

---

#### **ID:** `IT-01` (Formato BDD)
*   **Title:** Resilience to temporary "Worker" failure.
*   **Feature:** Voting System Resilience
*   **Scenario:** Votes should be processed after the 'worker' service recovers

    **Given** the voting system is 100% functional
    **And** a user has voted for "Cats" and the result is confirmed
    **When** the `worker` service is stopped
    **And** the same user changes their vote to "Dogs"
    **Then** the results page should not update immediately
    **And** the result for "Dogs" should remain "0 votes"

    **When** the `worker` service is restarted
    **And** we wait 10 seconds for the queue to be processed
    **Then** the results page should be updated to reflect the most recent vote, resulting in `Cats: 0 votes` and `Dogs: 1 vote`.

---

#### **ID:** `IT-02` (Formato BDD)
*   **Title:** System behavior on Database failure.
*   **Feature:** Voting System Resilience
*   **Scenario:** The system should handle database unavailability gracefully

    **Given** the application is running and has votes registered
    **When** the `db` service is stopped
    **Then** the results page (`:8081`) should display a graceful error message, without crashing the application
    **And** the voting page (`:8080`) should remain functional
    **And** the `worker` logs should show database connection failures.

    **When** the `db` service is restarted
    **And** we wait for the system to recover
    **Then** the results page should become functional again and display the votes correctly.

---

#### **ID:** `IT-03` (Formato BDD)
*   **Title:** Data persistence after a full restart.
*   **Feature:** Data Integrity
*   **Scenario:** Votes should be maintained after a full system restart

    **Given** that **different users** have cast a total of 5 votes for "Cats" and 2 for "Dogs"
    **When** the application is completely stopped and removed (using `docker compose down`)
    **And** the application is started again (using `docker compose up -d`)
    **Then** the results page should display `Cats: 5 votes` and `Dogs: 2 votes`.

---

#### **ID:** `IT-04` (Formato BDD)
*   **Title:** Validate the single vote per browser restriction.
*   **Feature:** Business Rule - Voting
*   **Scenario:** A user can only vote once per browser session

    **Given** a user accesses the voting page
    **When** they vote for "Cats"
    **And** try to vote for "Dogs" in the same session
    **Then** the result should remain with the vote for "Cats".

    **When** the user clears their browser cookies
    **And** votes for "Dogs" again
    **Then** the result should be updated to reflect the vote for "Dogs".

---

#### **ID:** `IT-05` (Formato BDD)
*   **Title:** Resilience to message queue failure.
*   **Feature:** Voting System Resilience
*   **Scenario:** The system should handle Redis service unavailability

    **Given** the application is running
    **When** the `redis` service is stopped
    **Then** the voting page (`:8080`) should display a graceful error or become unavailable.
    **And** the results page (`:8081`) should continue to display the last valid data.

    **When** the `redis` service is restarted
    **Then** the voting page should become functional again.

---

#### **ID:** `IT-06` (Formato BDD)
*   **Title:** State inconsistency when voting in different tabs.
*   **Feature:** Business Rule - Voting
*   **Scenario:** The user interface should consistently reflect the last registered vote

    **Given** a user opens the voting page in two browser tabs (Tab 1 and Tab 2)
    **When** the user votes for "Cats" in Tab 1
    **And** the user votes for "Dogs" in Tab 2
    **Then** the final result on the results page should be "1 vote" for "Dogs".
    **And** Tab 1, upon being reloaded, should reflect that the current vote is for "Dogs".

---
---