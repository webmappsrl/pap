import {clearTestState, e2eLogin} from 'cypress/utils/test-utils';

before(() => {
  clearTestState();
  cy.visit(Cypress.env('baseurl'));
  e2eLogin('email_no_address');
});

describe('pap-settings: test the correct behaviour of no address case', () => {
  it('should show an alert after login if there are no addresses', () => {
    cy.url().should('include', '/home');
    cy.get('ion-alert').should('be.visible');
  });

  it('should navigate to pap-location-modal correctly', () => {
    cy.get('.alert-button-role-ok').should('be.visible').click();
    cy.get('pap-location-modal').should('be.visible');
    cy.get('pap-map').should('be.visible');
  });
});

after(() => {
  clearTestState();
});
