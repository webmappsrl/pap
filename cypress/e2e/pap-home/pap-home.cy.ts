import {hexToRgb} from 'cypress/utils/test-utils';
import {homeButtons, noLoggedButtons} from 'projects/pap/src/app/features/home/home.model';
import {environment} from 'projects/pap/src/environments/environment';

const filteredHomeButtons = homeButtons.filter(btn => btn.hideInHome == null);
const apiLogin = `${environment.api}/login`;

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.wait(1000);
  cy.visit('/');
});

describe('pap-home: test the correct presences of home buttons', () => {
  it('should display correct number of buttons', () => {
    cy.get('.pap-home-button').should('have.length', filteredHomeButtons.length);
  });

  it('should display correct label of buttons', () => {
    filteredHomeButtons.forEach((btn, index) => {
      cy.get('.pap-home-button-label').eq(index).should('have.text', btn.label);
    });
  });

  it('should have the correct environment color for the buttons & labels', () => {
    const primaryColorRegex = /--ion-color-primary: (\#\w+);/;
    const match = environment.config.resources.variables.match(primaryColorRegex);
    const environmentPrimaryColor = match ? match[1] : null;
    if (environmentPrimaryColor) {
      filteredHomeButtons.forEach((btn, index) => {
        cy.get('.pap-home-button-label').eq(index).should('have.text', btn.label);
        cy.get('.pap-home-button-label').should(
          'have.css',
          'color',
          hexToRgb(environmentPrimaryColor),
        );
        cy.get('.pap-home-button-image').should(
          'have.css',
          'color',
          hexToRgb(environmentPrimaryColor),
        );
      });
    } else {
      throw new Error('Color not found in environment variables.');
    }
  });
});

describe('pap-home: test no logged user', () => {
  it('should display the correct alert .pap-alert-login when .pap-header-button is clicked', () => {
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert-login button').should('have.length', noLoggedButtons.length);
    noLoggedButtons.forEach((button, index) => {
      cy.get('.pap-alert-login button').eq(index).should('have.text', button.text);
    });
    cy.get('.alert-button-role-cancel').click();
    cy.get('.pap-alert-login').should('not.exist');
  });

  it('should navigate to /sign-in when sign in button is clicked', () => {
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert-login .alert-button-role-sign-in').click();
    cy.url().should('include', '/sign-in');
    cy.go('back');
  });

  it('should navigate to /sign-up when sign up button is clicked', () => {
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert-login .alert-button-role-sign-up').click();
    cy.url().should('include', '/sign-up');
    cy.go('back');
  });

  it('should attempt to open an external link when forgot password button is clicked', () => {
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert-login .alert-button-role-forgot-password').click();
    cy.get('@windowOpen').should('be.called');
  });
});

describe.only('pap-home: test logged user', () => {
  before(() => {
    cy.intercept('POST', apiLogin).as('loginRequest');
  });

  it('should login successfully using provided credentials, navigate correctly path when button is clicked and logout successfully ', () => {
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert-login .alert-button-role-sign-in').click();
    cy.url().should('include', '/sign-in');
    cy.get('form [formControlName="email"]').type(Cypress.env('email'));
    cy.get('form [formControlName="password"]').type(Cypress.env('password'));
    cy.get('ion-button[type="submit"]').click();
    cy.wait('@loginRequest').its('response.body').should('have.property', 'success', true);
    filteredHomeButtons.forEach((btn, index) => {
      if (btn.label === 'Servizi') {
        return;
      }
      cy.get('.pap-home-button-label').eq(index).click();
      cy.url().should('include', btn.url);
      cy.go('back');
    });
    cy.wait(1000);
    cy.get('.pap-header-button').click();
    cy.wait(1000);
    cy.get('ion-button[fill="outline"][shape="round"]').contains('Log out').click();
    //first alert
    cy.get('.pap-alert .pap-alert-btn-ok').click();
    cy.wait(1000);
    //second alert
    cy.get('.pap-alert .pap-alert-btn-ok').click();
    cy.url().should('include', '/home');
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
