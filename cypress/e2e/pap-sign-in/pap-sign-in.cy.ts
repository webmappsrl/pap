import {environment} from 'projects/pap/src/environments/environment';

const apiLogin = `${environment.api}/login`;

describe('pap-sign-in: test the correct behaviour with wrong credentials', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(Cypress.env('baseurl'));
  });

  it('should navigate to /sign-in when sign in button is clicked', () => {
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert .alert-button-role-sign-in').click();
    cy.url().should('include', '/sign-in');
  });

  it('sign in button should be disabled without required fields', () => {
    cy.get('ion-card ion-button').should('exist', 'not.be.enabled');
  });

  it('should display error message with incorrect credentials', () => {
    cy.get('[formControlName="email"]').type('wrongemail@test.com');
    cy.get('[formControlName="password"]').type('wrongpassword');
    cy.get('ion-card ion-button[type="submit"]').click();
    cy.intercept('POST', apiLogin).as('loginRequest');
    cy.wait('@loginRequest').then(interception => {
      const apiMessage = interception?.response?.body.message;
      cy.get('ion-label[color="danger"]').should('have.text', apiMessage);
    });
  });

  it('should display an error message when trying to login with incorrect credentials', () => {
    cy.get('ion-card ion-button').click();
    cy.intercept('POST', apiLogin).as('loginRequest');
    cy.wait('@loginRequest').then(interception => {
      const apiMessage = interception?.response?.body.message;
      cy.get('ion-label[color="danger"]').should('have.text', apiMessage);
    });
  });
});

describe('pap-sign-in: test the correct behaviour with correct credentials', () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(Cypress.env('baseurl'));
    cy.intercept('POST', apiLogin).as('loginRequest');
  });

  it('should login successfully using correct credentials and not display an error message', () => {
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert .alert-button-role-sign-in').click();
    cy.url().should('include', '/sign-in');
    cy.get('form [formControlName="email"]').type(Cypress.env('email'));
    cy.get('form [formControlName="password"]').type(Cypress.env('password'));
    cy.get('ion-label[color="danger"]').should('not.exist');
    cy.get('ion-button[type="submit"]').click();
    cy.wait('@loginRequest').its('response.body').should('have.property', 'success', true);
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
