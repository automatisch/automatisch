/// <reference types="cypress" />

describe('Executions page', () => {
  before(() => {
    cy.login();

    cy.og('executions-page-drawer-link').click();
  });

  after(() => {
    cy.logout();
  });

  it('displays executions', () => {
    cy.og('executions-loader').should('not.exist');
    cy.og('execution-row').should('exist');

    cy.ss('Executions');
  });
});