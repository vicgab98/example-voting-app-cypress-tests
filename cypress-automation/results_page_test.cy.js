/// <reference types="cypress" />

describe('Tests for the Results Page (localhost:8081)', () => {

  const resultUrl = 'http://localhost:8081';

  beforeEach(() => {
    // Before each test, we ensure that both applications are accessible.
    // This is a good practice to avoid failures due to environment unavailability.
    cy.request('/').its('status').should('eq', 200); // Checks the baseUrl
    cy.request(resultUrl).its('status').should('eq', 200);
  });

  it('ST-02: Should load the page with the correct title and the results area', () => {
    cy.visit(resultUrl);
    // Correction: The actual page title is "Result" in singular.
    cy.title().should('eq', 'Cats vs Dogs -- Result');
    cy.get('#result').should('be.visible');
  });

  it('FT-01 (Part 2): Should reflect a new vote on the results page', () => {
    // Step 1: Vote on the voting page to generate a result
    cy.visit('/'); // Uses the baseUrl to visit the voting page
    cy.get('button#a').click(); // Votes for 'Cats' on the :8080 origin

    // Step 2: Use cy.origin() to interact with the results page on a different origin (:8081)
    cy.origin(resultUrl, () => {
      cy.visit('/'); // Visits the root of the new origin

      // Correction: Validate the percentage instead of a fixed text.
      // This makes the test more robust and aligned with the UI.
      // Selector correction: The percentage is inside 'div.choice.cats', not inside '#result'.
      cy.get('div.choice.cats > div.stat').should(($stat) => {
        // Extracts the text (e.g., "50%") and removes the "%" character
        const percentageText = $stat.text().replace('%', '');
        // Converts the text to a number
        const percentage = parseFloat(percentageText);
        // The assertion checks if the percentage is a number and is greater than 0
        expect(percentage).to.be.a('number').and.to.be.gt(0);
      });
    });
  });
});