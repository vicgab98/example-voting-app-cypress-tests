/// <reference types="cypress" />

describe('Tests for the Voting Page (localhost:8080)', () => {

  beforeEach(() => {
    // Visits the voting page before each test
    cy.visit('/'); // Uses the baseUrl defined in cypress.config.js
  });

  it('ST-01: Should load the page with the correct title and vote buttons', () => {
    // Checks if the page title is correct
    cy.title().should('eq', 'Cats vs Dogs!');
    
    // Checks if the "Cats" and "Dogs" vote buttons are visible
    cy.get('button#a').should('be.visible');
    cy.get('button#b').should('be.visible');
  });

  it('FT-01 (Part 1): Should allow voting and confirm the selection on the interface', () => {
    // Clicks the "Cats" button
    cy.get('button#a').click();

    // Checks if the voting interface has been updated to show the "Cats" choice
    cy.get('#choice').should('contain.text', 'Cats');

    // Clicks the "Dogs" button
    cy.get('button#b').click();

    // Checks if the voting interface has been updated to show the "Dogs" choice
    cy.get('#choice').should('contain.text', 'Dogs');
  });
});