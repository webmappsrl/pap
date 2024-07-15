import {clearTestState, e2eLogin} from 'cypress/utils/test-utils';
import {environment} from 'projects/pap/src/environments/environment';

const apiPushNotifications = `${environment.api}/c/${environment.companyId}/pushnotification`;

before(() => {
  clearTestState();
  cy.visit(Cypress.env('baseurl'));
});

describe('pap-push-notifications: test correct behavior when user is not logged in', () => {
  it('should not show notifications button if not logged in', () => {
    cy.visit(Cypress.env('baseurl'));
    cy.get('.pap-header-button-notifications').should('not.exist');
  });
});

describe('pap-push-notifications: test correct behavior when user is logged in', () => {
  it('should show notifications button if logged in', () => {
    e2eLogin().then(() => {
      cy.intercept('GET', apiPushNotifications).as('getPushNotifications');
      cy.get('.pap-header-button-notifications').should('exist');
    });
  });

  it('should navigate to /push-notification after login', () => {
    cy.get('.pap-header-button-notifications').click();
    cy.url().should('include', '/push-notification');
  });

  it('should display the notifications correctly', () => {
    cy.get('.notification-content').should('have.length.greaterThan', 0);
  });
});

describe('pap-push-notifications: Test the correct behavior when I have no notifications', () => {
  before(() => {
    clearTestState();
    cy.visit(Cypress.env('baseurl'));
  });

  it('should show "Non ci sono notifiche da visualizzare" when there are no notifications', () => {
    e2eLogin().then(() => {
      cy.intercept('GET', apiPushNotifications, {
        body: [],
      }).as('getPushNotificationsEmpty');
      cy.get('.pap-header-button-notifications').click();
      cy.wait('@getPushNotificationsEmpty');
      cy.get('p').contains('Non ci sono notifiche da visualizzare').should('be.visible');
    });
  });
});

after(() => {
  clearTestState();
});
