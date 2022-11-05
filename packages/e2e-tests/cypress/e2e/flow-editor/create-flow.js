/// <reference types="cypress" />

describe('Flow editor page', () => {
  before(() => {
    cy.login();
  });

  after(() => {
    cy.logout();
  });

  it('create flow', () => {
    cy.og('create-flow-button').click({ force: true });
  });

  it('has two steps by default', () => {
    cy.og('flow-step').should('have.length', 2);
  });

  context('edit flow', () => {
    context('arrange Scheduler trigger', () => {
      context('choose app and event substep', () => {
        it('choose application', () => {
          cy.og('choose-app-autocomplete').click();

          cy.get('li[role="option"]:contains("Scheduler")').click();
        });

        it('choose an event', () => {
          cy.og('choose-event-autocomplete').should('be.visible').click();

          cy.get('li[role="option"]:contains("Every hour")').click();
        });

        it('continue to next step', () => {
          cy.og('flow-substep-continue-button').click();
        });

        it('collapses the substep', () => {
          cy.og('choose-app-autocomplete').should('not.be.visible');
          cy.og('choose-event-autocomplete').should('not.be.visible');
        });
      });

      context('set up a trigger', () => {
        it('choose "yes" in "trigger on weekends?"', () => {
          cy.og('parameters.triggersOnWeekend-autocomplete')
            .should('be.visible')
            .click();

          cy.get('li[role="option"]:contains("Yes")').click();
        });

        it('continue to next step', () => {
          cy.og('flow-substep-continue-button').click();
        });

        it('collapses the substep', () => {
          cy.og('parameters.triggersOnWeekend-autocomplete').should(
            'not.exist'
          );
        });
      });

      context('test trigger', () => {
        it('show sample output', () => {
          cy.og('flow-test-substep-output').should('not.exist');

          cy.og('flow-substep-continue-button').click();

          cy.og('flow-test-substep-output').should('be.visible');

          cy.ss('Scheduler trigger test output');

          cy.og('flow-substep-continue-button').click();
        });
      });
    });

    context('arrange Slack action', () => {
      context('choose app and event substep', () => {
        it('choose application', () => {
          cy.og('choose-app-autocomplete').click();

          cy.get('li[role="option"]:contains("Slack")').click();
        });

        it('choose an event', () => {
          cy.og('choose-event-autocomplete').should('be.visible').click();

          cy.get(
            'li[role="option"]:contains("Send a message to channel")'
          ).click();
        });

        it('continue to next step', () => {
          cy.og('flow-substep-continue-button').click();
        });

        it('collapses the substep', () => {
          cy.og('choose-app-autocomplete').should('not.be.visible');
          cy.og('choose-event-autocomplete').should('not.be.visible');
        });
      });

      context('choose connection', () => {
        it('choose connection', () => {
          cy.og('choose-connection-autocomplete').click();

          cy.get('li[role="option"]').first().click();
        });

        it('continue to next step', () => {
          cy.og('flow-substep-continue-button').click();
        });

        it('collapses the substep', () => {
          cy.og('choose-connection-autocomplete').should('not.be.visible');
        });
      });

      context('set up action', () => {
        it('choose channel', () => {
          cy.og('parameters.channel-autocomplete').click();

          cy.get('li[role="option"]').last().click();
        });

        it('arrange message text', () => {
          cy.og('power-input', ' [contenteditable]')
            .click()
            .type(
              `Hello from e2e tests! Here is the first suggested variable's value; `
            );

          cy.og('power-input-suggestion-group')
            .first()
            .og('power-input-suggestion-item')
            .first()
            .click();

          cy.clickOutside();

          cy.ss('Slack action message text');
        });

        it('continue to next step', () => {
          cy.og('flow-substep-continue-button').click();
        });

        it('collapses the substep', () => {
          cy.og('power-input', ' [contenteditable]').should('not.exist');
        });
      });

      context('test trigger', () => {
        it('show sample output', () => {
          cy.og('flow-test-substep-output').should('not.exist');

          cy.og('flow-substep-continue-button').click();

          cy.og('flow-test-substep-output').should('be.visible');

          cy.ss('Slack action test output');

          cy.og('flow-substep-continue-button').click();
        });
      });
    });
  });

  context('publish and unpublish', () => {
    it('publish flow', () => {
      cy.og('unpublish-flow-button').should('not.exist');

      cy.og('publish-flow-button').should('be.visible').click();

      cy.og('publish-flow-button').should('not.exist');
    });

    it('shows read-only sticky snackbar', () => {
      cy.og('flow-cannot-edit-info-snackbar').should('be.visible');

      cy.ss('Published flow');
    });

    it('unpublish from snackbar', () => {
      cy.og('unpublish-flow-from-snackbar').click();

      cy.og('flow-cannot-edit-info-snackbar').should('not.exist');
    });

    it('publish once again', () => {
      cy.og('publish-flow-button').should('be.visible').click();

      cy.og('publish-flow-button').should('not.exist');
    });

    it('unpublish from layout top bar', () => {
      cy.og('unpublish-flow-button').should('be.visible').click();

      cy.og('unpublish-flow-button').should('not.exist');

      cy.ss('Unpublished flow');
    });
  });

  context('in layout', () => {
    it('can go back to flows page', () => {
      cy.og('editor-go-back-button').click();

      cy.location('pathname').should('equal', '/flows');
    });
  });
});
