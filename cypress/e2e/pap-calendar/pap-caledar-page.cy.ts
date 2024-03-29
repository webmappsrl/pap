import {TrashBookType} from './../../../projects/pap/src/app/features/trash-book/trash-book-model';
import {homeButtons} from 'projects/pap/src/app/features/home/home.model';
import {environment} from 'projects/pap/src/environments/environment';
import {Address} from 'cluster';
import {
  clearTestState,
  e2eLogin,
  formatDateUsingPapDatePipe,
  navigateToPageAndVerifyUrl,
  verifyPapDateComponents,
} from 'cypress/utils/test-utils';

const calendarsButton = homeButtons.find(button => button.label === 'Calendari');
const apiCalendar = `${environment.api}/c/${environment.companyId}/calendar`;

before(() => {
  clearTestState();
  cy.visit(Cypress.env('baseurl'));
  e2eLogin();
});

beforeEach(() => {
  cy.intercept('GET', apiCalendar).as('calendarCall');
});

describe('pap-calendar-page: test the correct behaviour of page', () => {
  it('should navigate to the calendar page and make a successful GET request to the calendar API', () => {
    if (calendarsButton) {
      navigateToPageAndVerifyUrl(calendarsButton.label, calendarsButton.url);
      cy.wait('@calendarCall').its('response.statusCode').should('eq', 200); //success status code
    } else {
      throw new Error('Button not found.');
    }
  });

  it('should attempt to open an external link when pap-calendar-infobutton is clicked', () => {
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get('.pap-calendar-infobutton').click();
    cy.get('@windowOpen').should('be.called');
  });

  it('should load the addresses correctly in the ion-popover and and must load the data into ion-list correctly', () => {
    cy.wait('@calendarCall').then(interception => {
      setTimeout(() => {
        const apiData = interception?.response?.body.data;
        const apiAddresses = apiData.map((d: Address) => d.address);
        const calendarObject = apiData[0].calendar;
        const apiDate = Object.keys(calendarObject)[0];
        const formattedWeekDay = formatDateUsingPapDatePipe(apiDate, 'EEEE');
        const apiStartTime = calendarObject[apiDate][0].start_time;
        const apiStopTime = calendarObject[apiDate][0].stop_time;
        const trashTypesNames = apiData[0].calendar[apiDate][0].trash_types.map(
          (trashType: TrashBookType) => trashType.name['it'],
        );
        const trashTypesColors = apiData[0].calendar[apiDate][0].trash_types.map(
          (trashType: TrashBookType) => trashType.color,
        );
        const addressZoneLabel = apiData[0]?.address?.zone?.label;
        const addressUserTypeLabel = apiData[0]?.address?.user_type?.label?.it;

        cy.get('pap-address-selector').click();
        apiAddresses.forEach((addressObj: Address) => {
          cy.log(addressObj.address);
          cy.get(
            'ion-popover > ion-list > ion-item > ion-grid > ion-row > ion-col > ion-label',
          ).should('include.text', addressObj.address);
        });
        cy.get('ion-popover > ion-list > ion-item > ion-grid > ion-row > ion-col > ion-label')
          .first()
          .click();
        verifyPapDateComponents(apiDate);
        cy.get('.pap-calendar-weekday').contains(formattedWeekDay).should('exist');
        cy.get('.pap-calendar-time').contains(apiStartTime).should('exist');
        cy.get('.pap-calendar-time').contains(apiStopTime).should('exist');
        trashTypesNames.forEach((trashName: string) => {
          cy.get('.pap-trashlist-details-label').contains(trashName).should('exist');
        });
        cy.get('.pap-calendar-current-zone-label').should('include.text', addressZoneLabel);
        cy.get('ion-badge').should('include.text', addressUserTypeLabel);

        cy.get('.pap-calendar-trashlist').first().click();
        cy.get('pap-trash-book-type').should('exist');
        cy.get('ion-button.modal').click();
        cy.get('pap-calendar-page').should('exist');
        cy.url().should('include', '/calendar');
      });
    }, 500);
  });
});

after(() => {
  clearTestState();
});
