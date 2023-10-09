import {TrashBookType} from './../../../projects/pap/src/app/features/trash-book/trash-book-model';
import {homeButtons} from 'projects/pap/src/app/features/home/home.model';
import {environment} from 'projects/pap/src/environments/environment';
import {Address} from 'cluster';
import {e2eLogin, formatDateUsingPapDatePipe, hexToRgb} from 'cypress/utils/test-utils';

const calendarsButton = homeButtons.find(button => button.label === 'Calendari');
const apiCalendar = `${environment.api}/c/${environment.companyId}/calendar`;

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.wait(1000);
  cy.visit(Cypress.env('baseurl'));
  e2eLogin();
});

beforeEach(() => {
  cy.intercept('GET', apiCalendar).as('calendarCall');
});

describe('pap-calendar-page: test the correct behaviour of page', () => {
  it('should navigate to the calendar page and make a successful GET request to the calendar API', () => {
    if (calendarsButton) {
      cy.contains(calendarsButton.label).click();
      cy.url().should('include', calendarsButton.url);
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

  it('should load the addresses correctly in the ion-select and and must load the data into ion-list correctly', () => {
    cy.wait('@calendarCall').then(interception => {
      const apiData = interception?.response?.body.data;
      const apiAddresses = apiData.map((d: Address) => d.address);
      const calendarObject = apiData[0].calendar;
      const apiDate = Object.keys(calendarObject)[0];
      const formattedDay = formatDateUsingPapDatePipe(apiDate, 'd');
      const formattedMonth = formatDateUsingPapDatePipe(apiDate, 'MMMM');
      const formattedWeekDay = formatDateUsingPapDatePipe(apiDate, 'EEEE');
      const apiStartTime = calendarObject[apiDate][0].start_time;
      const apiStopTime = calendarObject[apiDate][0].stop_time;
      const trashTypesNames = apiData[0].calendar[apiDate][0].trash_types.map(
        (trashType: TrashBookType) => trashType.name['it'],
      );
      const trashTypesColors = apiData[0].calendar[apiDate][0].trash_types.map(
        (trashType: TrashBookType) => trashType.color,
      );

      cy.get('ion-select').click();
      apiAddresses.forEach((addressObj: Address) => {
        cy.get('ion-select-option').should('include.text', addressObj.address);
      });

      cy.get('.alert-button-role-cancel').click();
      cy.get('.pap-calendar-day').contains(formattedDay).should('exist');
      cy.get('.pap-calendar-month').contains(formattedMonth).should('exist');
      cy.get('.pap-calendar-weekday').contains(formattedWeekDay).should('exist');
      cy.get('.pap-calendar-time').contains(apiStartTime).should('exist');
      cy.get('.pap-calendar-time').contains(apiStopTime).should('exist');
      trashTypesNames.forEach((trashName: string) => {
        cy.get('.pap-trashlist-details-label').contains(trashName).should('exist');
      });
      trashTypesColors.forEach((trashColorHex: string, index: number) => {
        const trashColorRgb = hexToRgb(trashColorHex);
        cy.get('.pap-calendar-event .trash-book-details-icon')
          .eq(index)
          .should('have.css', 'color', trashColorRgb);
      });

      cy.get('.pap-calendar-trashlist').first().click();
      cy.get('pap-trash-book-type').should('exist');
      cy.get('ion-button.modal').click();
      cy.get('pap-calendar-page').should('exist');
      cy.url().should('include', '/calendar');
    });
  });

  it('should have the correct environment color for the pap-calendar-infobutton', () => {
    const primaryColorRegex = /--ion-color-primary: (\#\w+);/;
    const match = environment.config.resources.variables.match(primaryColorRegex);
    const environmentPrimaryColor = match ? match[1] : null;
    if (environmentPrimaryColor) {
      cy.get('ion-button.pap-calendar-infobutton').should(
        'have.css',
        'border-color',
        hexToRgb(environmentPrimaryColor),
      );
    } else {
      throw new Error('Color not found in environment variables.');
    }
  });

  it('should have the correct environment color for the ion-button trash list', () => {
    const primaryColorRegex = /--ion-color-primary: (\#\w+);/;
    const match = environment.config.resources.variables.match(primaryColorRegex);
    const environmentPrimaryColor = match ? match[1] : null;
    if (environmentPrimaryColor) {
      cy.get('ion-button.pap-calendar-trashlist').should(
        'have.css',
        'border-color',
        hexToRgb(environmentPrimaryColor),
      );
    } else {
      throw new Error('Color not found in environment variables.');
    }
  });

  it('should have the correct environment color for weekday and time', () => {
    const mediumColorRegex = /--ion-color-medium: (\#\w+);/;
    const match = environment.config.resources.variables.match(mediumColorRegex);
    const environmentMediumColor = match ? match[1] : null;
    if (environmentMediumColor) {
      cy.get('div.pap-calendar-time').should('have.css', 'color', hexToRgb(environmentMediumColor));
      cy.get('div.pap-calendar-weekday').should(
        'have.css',
        'color',
        hexToRgb(environmentMediumColor),
      );
    } else {
      throw new Error('Color not found in environment variables.');
    }
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
