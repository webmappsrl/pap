import {
  e2eLogin,
  formatDateUsingPapDatePipe,
  hexToRgb,
  translateTicketType,
} from 'cypress/utils/test-utils';
import {homeButtons} from 'projects/pap/src/app/features/home/home.model';
import {TrashBookRow} from 'projects/pap/src/app/features/trash-book/trash-book-model';
import {environment} from 'projects/pap/src/environments/environment';

const apiTickets = `${environment.api}/c/${environment.companyId}/tickets`;
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;
const ticketButton = homeButtons.find(button => button.label === 'I miei ticket');
let trashTypesData: any;

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.intercept('GET', apiTrashTypes).as('trashTypesCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@trashTypesCall').then(interception => {
    trashTypesData = interception?.response?.body;
    cy.wrap(trashTypesData).as('trashTypesData');
  });
  e2eLogin();
});

beforeEach(() => {
  cy.intercept('GET', apiTickets).as('ticketsCall');
});

describe('pap-reports: test the correct behaviour of page', () => {
  it('should navigate to the reports page, load tickets date, name and verify trash type names correctly', () => {
    if (ticketButton) {
      cy.contains(ticketButton.label).click();
      cy.url().should('include', ticketButton.url);
      cy.wait('@ticketsCall').then(interception => {
        const ticketsData = interception?.response?.body.data;
        if (ticketsData.length > 0) {
          const firstReportDate = ticketsData[0].created_at;
          const formattedDay = formatDateUsingPapDatePipe(firstReportDate, 'd');
          const formattedMonth = formatDateUsingPapDatePipe(firstReportDate, 'MMMM');
          const ticketTypeTranslation = translateTicketType(ticketsData[0].ticket_type);
          cy.get('.pap-date-day').contains(formattedDay).should('exist');
          cy.get('.pap-date-month').contains(formattedMonth).should('exist');
          cy.get('.pap-reports-label-info').contains(ticketTypeTranslation).should('exist');
          cy.get('.pap-reports-name').each($el => {
            const itemName = $el.text().trim();
            cy.log(`Checking for: ${itemName}`);
            expect(
              ticketsData.some((ticket: any) => {
                const trashType = trashTypesData.find(
                  (type: any) => type.id === ticket.trash_type_id,
                );
                return trashType && trashType.name === itemName;
              }),
            ).to.be.true;
          });
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
  cy.clearCookies();
  cy.clearLocalStorage();
});
