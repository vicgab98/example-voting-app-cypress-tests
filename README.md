# Voting App - QA 

This repository serves as a comprehensive Quality Assurance portfolio, demonstrating a full range of testing skills applied to a real-world microservices application.

## Overview

The project consists of two main components:
1.  The **Example Voting App**, a Dockerized microservices application.
2.  A **Cypress Test Automation Suite**, developed to validate the application's functionality, resilience, and business rules.

## Project Structure

The repository is organized into two main directories:

*   `./example-voting-app/`: Contains the source code for the application under test.
    *   **Note:** This application is based on the official Docker Example Voting App. It has been used here as the subject for the testing and analysis activities.

*   `./cypress-automation/`: Contains the complete Cypress test automation suite, including end-to-end tests, regression tests, and helper scripts.

## QA Documentation

All test planning and defect management artifacts are located within the application's directory. This documentation is the core of the QA analysis performed.

*   📄 **Test Plan:** For a detailed overview of the testing strategy, scope, risk analysis, and detailed test cases, please see the **`TEST_PLAN.md`**.

*   🐞 **Bug Reports:** All bugs and defects found during the testing phase are documented in the **`BUGS.md`**.

## How to Run

### 1. Running the Application

To start the application, you need Docker and Docker Compose installed.

```bash
# 1. Navigate to the application directory
cd example-voting-app

# 2. Start all services using Docker Compose
docker compose up -d
```
The voting app will be available at `http://localhost:8080` and the results at `http://localhost:8081`.

### 2. Running the Cypress Tests

To run the automated tests, you need Node.js and npm installed.

```bash
# 1. Navigate to the automation directory
cd cypress-automation

# 2. Open the Cypress Test Runner
npx cypress open
```
