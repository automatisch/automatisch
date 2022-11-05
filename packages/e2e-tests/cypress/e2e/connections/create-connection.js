/// <reference types="cypress" />

describe('Connections page', () => {
  before(() => {
    cy.login();

    cy.og('apps-page-drawer-link').click();
  });

  after(() => {
    cy.logout();
  });

  it('opens via applications page', () => {
    cy.og('apps-loader').should('not.exist');

    cy.og('app-row').contains('Slack').click();

    cy.og('app-connection-row').should('be.visible');

    cy.ss('Slack connections before creating a connection');
  });

  context('can add connection', () => {
    it('has a button to open add connection dialog', () => {
      cy.og('add-connection-button').scrollIntoView().should('be.visible');
    });

    it('add connection button takes user to add connection page', () => {
      cy.og('add-connection-button').click({ force: true });

      cy.location('pathname').should('equal', '/app/slack/connections/add');
    });

    it('shows add connection dialog to create a new connection', () => {
      cy.get('input[name="accessToken"]').type(Cypress.env('slack_user_token'));

      cy.og('create-connection-button').click();

      cy.og('create-connection-button').should('not.exist');

      cy.ss('Slack connections after creating a connection');
    });
  });
});
