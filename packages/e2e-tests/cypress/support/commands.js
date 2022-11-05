Cypress.Commands.add(
  'og',
  { prevSubject: 'optional' },
  (subject, selector, suffix = '') => {
    if (subject) {
      return cy.wrap(subject).get(`[data-test="${selector}"]${suffix}`);
    }

    return cy.get(`[data-test="${selector}"]${suffix}`);
  }
);

Cypress.Commands.add('login', () => {
  cy.visit('/login');

  cy.og('email-text-field').type(Cypress.env('login_email'));
  cy.og('password-text-field').type(Cypress.env('login_password'));

  cy.intercept('/graphql').as('graphqlCalls');
  cy.intercept('https://notifications.automatisch.io/notifications.json').as(
    'notificationsCall'
  );
  cy.og('login-button').click();

  cy.wait(['@graphqlCalls', '@notificationsCall']);
});

Cypress.Commands.add('logout', () => {
  cy.og('profile-menu-button').click();

  cy.og('logout-item').click();
});

Cypress.Commands.add('ss', (name, opts = {}) => {
  return cy.screenshot(name, {
    overwrite: true,
    capture: 'viewport',
    ...opts,
  });
});

Cypress.Commands.add('clickOutside', () => {
  return cy.get('body').click(0, 0);
});
