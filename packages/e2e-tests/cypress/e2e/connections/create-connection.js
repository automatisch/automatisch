/// <reference types="cypress" />

describe('Connections page', () => {
  before(() => {
    cy.login();

    cy.og('apps-page-drawer-link').click();

    cy.visit('/app/deepl/connections');
  });

  after(() => {
    cy.logout();
  });

  it('shows connections if any', () => {
    cy.og('apps-loader').should('not.exist');

    cy.ss('DeepL connections before creating a connection');
  });

  context('can add connection', () => {
    it('has a button to open add connection dialog', () => {
      cy.scrollTo('top', { ensureScrollable: false });

      cy
        .og('add-connection-button')
        .should('be.visible');
    });

    it('add connection button takes user to add connection page', () => {
      cy.og('add-connection-button').click();

      cy.location('pathname').should('equal', '/app/deepl/connections/add');
    });

    it('shows add connection dialog to create a new connection', () => {
      cy.get('input[name="screenName"]').type('e2e-test connection!');
      cy.get('input[name="authenticationKey"]').type(Cypress.env('deepl_auth_key'));

      cy.og('create-connection-button').click();

      cy.og('create-connection-button').should('not.exist');

      cy.ss('DeepL connections after creating a connection');
    });
  });
});
