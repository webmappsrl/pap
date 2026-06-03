import {clearTestState} from 'cypress/utils/test-utils';
import {environment} from 'projects/pap/src/environments/environment';

const mockLoginResponse = {
  success: true,
  data: {
    token: 'mock-no-address-token',
    email_verified_at: '2024-01-01T00:00:00.000Z',
    user: {
      id: 99,
      name: 'Test No Address',
      email: 'no_address@webmapp.it',
      email_verified_at: '2024-01-01T00:00:00.000Z',
      fiscal_code: 'WBMWMP98R03G702M',
      addresses: null,
      roles: [],
    },
  },
};

before(() => {
  clearTestState();
  cy.intercept('POST', `${environment.api}/login`, {body: mockLoginResponse}).as('loginRequest');
  cy.visit(Cypress.env('baseurl'));
  cy.get('.pap-header-button-setting').click();
  cy.get('ion-alert').should('be.visible');
  cy.get('.alert-button-role-sign-in').click();
  cy.url().should('include', '/sign-in');
  cy.get('form [formControlName="email"]').type(Cypress.env('email_no_address'));
  cy.get('form [formControlName="password"]').type(Cypress.env('password'));
  cy.get('ion-button[type="submit"]').click();
  cy.wait('@loginRequest');
});

describe('pap-settings: test the correct behaviour of no address case', () => {
  it('should show an alert after login if there are no addresses', () => {
    cy.url().should('include', '/home');
    cy.get('ion-alert').should('be.visible');
  });

  it('should navigate to pap-location-modal correctly', () => {
    cy.get('.alert-button-role-ok', {timeout: 10000}).should('be.visible').click();
    cy.get('pap-location-modal').should('be.visible');
    cy.get('pap-map').should('be.visible');
  });
});

after(() => {
  clearTestState();
});
