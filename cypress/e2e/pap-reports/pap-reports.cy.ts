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

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.intercept('GET', apiTrashTypes).as('trashTypesCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@trashTypesCall').then(interception => {
    const trashTypesData = interception?.response?.body;
    cy.wrap(trashTypesData).as('trashTypesData');
  });
  e2eLogin();
});

beforeEach(() => {
  cy.intercept('GET', apiTickets).as('ticketsCall');
});

describe('pap-reports: test the correct behaviour of page', () => {
  it('should navigate to the reports page and load tickets date and name correctly', () => {
    if (ticketButton) {
      cy.contains(ticketButton.label).click();
      cy.url().should('include', ticketButton.url);
      cy.wait('@ticketsCall').then(interception => {
        const ticketsData = interception?.response?.body.data;
        const firstReportDate = ticketsData[0].created_at;
        const formattedDay = formatDateUsingPapDatePipe(firstReportDate, 'd');
        const formattedMonth = formatDateUsingPapDatePipe(firstReportDate, 'MMMM');
        cy.log(formattedDay, formattedMonth);
        const ticketTypeTranslation = translateTicketType(ticketsData[0].ticket_type);
        cy.log(ticketTypeTranslation);
        cy.get('.pap-reports-monthday').contains(formattedDay).should('exist');
        cy.get('.pap-reports-monthname').contains(formattedMonth).should('exist');
        cy.get('.pap-reports-label-info span')
          .contains(`Ticket ${ticketTypeTranslation}`)
          .should('exist');
      });
    } else {
      throw new Error('Button not found.');
    }
  });

  it('should match ticket trash type name correctly', function () {
    cy.get('.pap-reports-name').each($el => {
      const itemName = $el.text().trim();
      cy.log(`Checking for: ${itemName}`);
      expect(this['trashTypesData'].some((trashType: TrashBookRow) => trashType.name === itemName))
        .to.be.true;
    });
  });

  it('should match ticket trash type color correctly', function () {
    cy.get('.pap-reports-item ion-icon').each($icon => {
      const itemColor = $icon.css('color');
      const itemName = $icon.next().text().trim();
      cy.log(`Checking color for: ${itemName}`);
      const expectedColor = this['trashTypesData'].find(
        (trashType: TrashBookRow) => trashType.name === itemName,
      )?.color;
      if (expectedColor) {
        const rgbExpectedColor = hexToRgb(expectedColor);
        expect(itemColor).to.equal(rgbExpectedColor);
      }
    });
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
