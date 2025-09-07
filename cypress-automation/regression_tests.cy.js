/// <reference types="cypress" />

describe('Regression Tests - Bugs Found', () => {
  
  it('BUG-003: Results page should not crash with a server error', () => {
    // This test automates the verification of BUG-003.
    // It intercepts the request to the results page and forces a 500 Error response,
    // simulating a backend failure (like the database being offline).
    // Currently, it is expected to FAIL, proving that the bug still exists.
    // When the bug is fixed, this test will PASS, ensuring it does not regress.

    // Intercepts the request to the results page and responds with a 500 status.
    cy.intercept('GET', 'http://localhost:8081/', {
      statusCode: 500,
      body: '<html><body><h1>Simulated Internal Error</h1></body></html>'
    }).as('getResultPage');

    // Tries to visit the page. The visit itself would fail by default in Cypress upon receiving a 500 error.
    // To validate the behavior, we disable the default failure.
    cy.visit('http://localhost:8081', { failOnStatusCode: false });

    // The ideal assertion (which will fail now) is to check if the page contains a friendly error message.
    // Since the page crashes, we will not find this message.
    cy.contains('Results temporarily unavailable.').should('be.visible');
  });

});