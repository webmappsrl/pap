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
  cy.wait(1000);
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
      cy.contains(ticketButton.label).click();
      cy.url().should('include', ticketButton.url);
      cy.get('.pap-reports-item').first().click();
      cy.get('pap-reports-detail').should('exist');
      cy.wait('@ticketsCall').then(interception => {
        const ticketsData = interception?.response?.body.data;
        const ticketData = interception?.response?.body.data[0];
        const ticketTypeTranslation = translateTicketType(ticketsData[0].ticket_type);
        const formattedDate = formatDateUsingPapDatePipe(ticketData.created_at, 'MM/dd/yyyy');
        cy.log(ticketTypeTranslation);
        cy.get('ion-card-title').contains(`Ticket ${ticketTypeTranslation}`).should('exist');
        cy.get('.pap-form-recap-note').contains(ticketData.location_address).should('exist');
        cy.get('.pap-form-recap-note').contains(formattedDate).should('exist');
        if (ticketData.image) {
          cy.get('img').should('have.attr', 'src', ticketData.image);
        } else {
          cy.log('Field image does not exist.');
        }
        if (ticketData.note) {
          cy.get('.pap-form-recap-note').contains(ticketData.note).should('exist');
        } else {
          cy.log('Field note does not exist..');
        }
        if (ticketData.phone) {
          cy.get('.pap-form-recap-note').contains(ticketData.phone).should('exist');
        } else {
          cy.log('Field phone does not exist.');
        }
      });
    } else {
      throw new Error('Button not found.');
    }
  });

  it('should match ticket trash type name correctly', function () {
    cy.get('.pap-reports-detail-list').each($el => {
      const itemName = $el.text().trim();
      cy.log(`Checking for: ${itemName}`);
      expect(this['trashTypesData'].some((trashType: TrashBookRow) => trashType.name === itemName))
        .to.be.true;
    });
  });

  it('should match ticket trash type color correctly', function () {
    cy.get('.pap-reports-detail-list ion-icon').each($icon => {
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

  it('should have the correct environment color for the ion-card', () => {
    const lightColorRegex = /--ion-color-light: (\#\w+);/;
    const match = environment.config.resources.variables.match(lightColorRegex);
    const environmentLightColorRegex = match ? match[1] : null;
    if (environmentLightColorRegex) {
      cy.get('ion-card').should(
        'have.css',
        'background-color',
        hexToRgb(environmentLightColorRegex),
      );
    } else {
      throw new Error('Color not found in environment variables.');
    }
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
