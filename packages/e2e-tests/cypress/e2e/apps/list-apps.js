/// <reference types="cypress" />

describe('Apps page', () => {
  before(() => {
    cy.login();

    cy.og('apps-page-drawer-link').click();
  });

  after(() => {
    cy.logout();
  });

  it('displays applications', () => {
    cy.og('apps-loader').should('not.exist');
    cy.og('app-row').should('have.length.least', 1);

    cy.ss('Applications');
  });

  context('can add connection', () => {
    before(() => {
      cy.og('add-connection-button').click();
    });

    it('lists applications', () => {
      cy.og('app-list-item').should('have.length.above', 1);
    });

    it('searches an application', () => {
      cy.og('search-for-app-text-field').type('Slack');
      cy.og('app-list-item').should('have.length', 1);
    });

    it('goes to app page to create a connection', () => {
      cy.og('app-list-item').first().click();

      cy.location('pathname').should('equal', '/app/slack/connections/add');

      cy.og('add-app-connection-dialog').should('be.visible');
    });

    it('closes the dialog on backdrop click', () => {
      cy.clickOutside();

      cy.location('pathname').should('equal', '/app/slack/connections');
      cy.og('add-app-connection-dialog').should('not.exist');
    });
  });
});
