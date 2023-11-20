import {clearTestState, e2eLogin} from 'cypress/utils/test-utils';

before(() => {
  clearTestState();
  cy.visit(Cypress.env('baseurl'));
  e2eLogin('email_no_address');
});

describe('pap-settings: test the correct behaviour of firstStep tab', () => {
  it('should show an alert after login if there are no addresses', () => {
    cy.url().should('include', '/home');
    cy.get('ion-alert').should('be.visible');
  });

  it('', () => {
    cy.get('.alert-button-role-ok').should('be.visible').click();
  });
});

after(() => {
  clearTestState();
});
