import {
  clearTestState,
  e2eLogin,
  formatDateUsingPapDatePipe,
  navigateToPageAndVerifyUrl,
  translateTicketType,
} from 'cypress/utils/test-utils';
import {homeButtons} from 'projects/pap/src/app/features/home/home.model';
import {environment} from 'projects/pap/src/environments/environment';

const apiTickets = `${environment.api}/c/${environment.companyId}/tickets`;
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;
const ticketButton = homeButtons.find(button => button.label === 'I miei ticket');

before(() => {
  clearTestState();
  cy.intercept('GET', apiTrashTypes).as('trashTypesCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@trashTypesCall').then(interception => {
    const trashTypesData = interception?.response?.body;
    cy.wrap(trashTypesData).as('trashTypesData');
    cy.log(trashTypesData);
  });
  e2eLogin();
});

beforeEach(() => {
  cy.intercept('GET', apiTickets).as('ticketsCall');
});
describe('pap-reports-detail: test the correct behaviour of page', () => {
  it('should navigate to the reports detail page and load ticket data correctly', () => {
    if (ticketButton) {
      navigateToPageAndVerifyUrl(ticketButton.label, ticketButton.url);
      cy.wait('@ticketsCall').then(interception => {
        const ticketsData = interception?.response?.body.data;
        const ticketData = interception?.response?.body.data[0];
        if (ticketsData.length > 0) {
          cy.get('.pap-reports-item').first().click();
          cy.get('pap-reports-detail').should('exist');
          const ticketTypeTranslation = translateTicketType(ticketsData[0].ticket_type);
          const formattedDate = formatDateUsingPapDatePipe(ticketData.created_at, 'dd/MM/yyyy');
          cy.log(ticketTypeTranslation);
          cy.get('.pap-reports-detail-ticket-type').contains(ticketTypeTranslation);
          if (ticketData.location_address) {
            cy.get('.pap-form-recap-location-address')
              .contains(ticketData.location_address)
              .should('exist');
          } else {
            cy.log('Field image does not exist.');
          }
          if (formattedDate) {
            cy.log(formattedDate);

            cy.get('.pap-form-recap-created-at').should('exist').and('not.be.empty');
          } else {
            cy.log('Field image does not exist.');
          }
          if (ticketData.image) {
            cy.get('img').should('have.attr', 'src', ticketData.image);
          } else {
            cy.log('Field image does not exist.');
          }
          if (ticketData.note) {
            cy.get('.pap-form-recap-note')
              .contains(ticketData.note)
              .should('exist')
              .and('not.be.empty');
          } else {
            cy.log('Field note does not exist.');
          }
          if (ticketData.phone) {
            cy.get('.pap-form-recap-phone')
              .contains(ticketData.phone)
              .should('exist')
              .and('not.be.empty');
          } else {
            cy.log('Field phone does not exist.');
          }
        } else {
          cy.log('No tickets');
        }
      });
    } else {
      throw new Error('Button not found.');
    }
  });
});

after(() => {
  clearTestState();
});
