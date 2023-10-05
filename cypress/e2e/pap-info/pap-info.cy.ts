import {environment} from 'projects/pap/src/environments/environment';

const companyInfo = environment.config.resources.company_page;

beforeEach(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.wait(1000);
  cy.visit('/info');
});

describe('pap-info: test the correct behaviour of page', () => {
  it('should display the correct company info', () => {
    cy.get('.pap-info-body').invoke('html').should('equal', companyInfo);
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
