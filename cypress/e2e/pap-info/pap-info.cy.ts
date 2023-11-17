import {clearTestState} from 'cypress/utils/test-utils';
import {environment} from 'projects/pap/src/environments/environment';

const companyInfo = environment.config.resources.company_page;
const infoButton = environment.config.name;

before(() => {
  clearTestState();
  cy.visit(Cypress.env('baseurl'));
});

describe('pap-info: test the correct behaviour of page', () => {
  it('should display the correct company info', () => {
    cy.contains(infoButton).click();
    cy.get('.pap-info-body').invoke('html').should('equal', companyInfo);
  });
});

after(() => {
  clearTestState();
});
