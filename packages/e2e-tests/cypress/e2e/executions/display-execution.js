/// <reference types="cypress" />

describe('Execution page', () => {
  before(() => {
    cy.login();

    cy.og('executions-page-drawer-link').click();
    cy.og('execution-row').first().click({ force: true });

    cy.location('pathname').should('match', /^\/executions\//);
  });

  after(() => {
    cy.logout();
  });

  it('displays data in by default', () => {
    cy.og('execution-step').should('have.length', 2);

    cy.ss('Execution - data in');
  });

  it('displays data out', () => {
    cy.og('data-out-tab').click({ multiple: true });

    cy.ss('Execution - data out');
  });

  it('does not display error', () => {
    cy.og('error-tab').should('not.exist');
  });
});
