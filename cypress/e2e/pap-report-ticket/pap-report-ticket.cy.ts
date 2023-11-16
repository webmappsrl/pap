import {
  FormMockup,
  e2eLogin,
  getApiDateRange,
  testGoToThirdStep,
  testRecapTicketForm,
} from 'cypress/utils/test-utils';
import {homeButtons, servicesButtons} from 'projects/pap/src/app/features/home/home.model';
import {reportTicketForm} from 'projects/pap/src/app/shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

const servicesButton = homeButtons.find(button => button.label === 'Servizi');
const reportTicketoButton = servicesButtons.find(
  button => button.text === 'Segnala mancato ritiro',
);
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;
const {startDate, stopDate} = getApiDateRange();
const apiCalendarWithDates = `${environment.api}/c/${environment.companyId}/calendar?start_date=${startDate}&stop_date=${stopDate}`;
let calendarData: any = null;
let formMockup: FormMockup = {
  Telefono: '356273894',
  Note: 'this is a text note',
  Servizio: '',
  Immagine: '',
  Indirizzo: {
    city: '',
    address: '',
  },
};

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.intercept('GET', apiTrashTypes).as('trashTypesCall');
  cy.intercept('GET', apiCalendarWithDates).as('calendarWithDatesCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@trashTypesCall').then(interception => {
    cy.wrap(interception?.response?.body).as('trashTypesData');
  });

  e2eLogin();
});

describe('pap-report-ticket: test the correct behaviour of form at first step', () => {
  it('should navigate correctly to report failure to collect', function () {
    if (servicesButton && reportTicketoButton) {
      cy.log(apiCalendarWithDates);
      cy.contains(servicesButton.label).click();
      cy.contains(reportTicketoButton.text).click();
      cy.wait('@calendarWithDatesCall').then(xhr => {
        calendarData = xhr?.response?.body;
        cy.wrap(calendarData).as('calendarData');
      });
    } else {
      throw new Error('Services button not found in homeButtons.');
    }
  });

  it('should display the correct ticket type, label and status back button should be hidden', () => {
    cy.get('.pap-form-first-step').should('include.text', reportTicketForm.label);
    const expectedLabelText = reportTicketForm.step[0].label;
    cy.get('.pap-form-label-first-step').should('include.text', expectedLabelText);
    cy.get('.pap-status-back-button').should('be.hidden');
  });
});

describe('pap-report-ticket: test the correct behaviour of form at second step', () => {
  it('should display the correct ticket type, ticket label, status next button should be disabled and a label with this field is required if no trash type selected', () => {
    cy.get('.pap-status-next-button').should('be.visible').click();
    cy.get('.pap-form-content').should('include.text', reportTicketForm.label);
    const expectedLabelText = reportTicketForm.step[1].label;
    cy.get('.pap-form-label').should('include.text', expectedLabelText);
    cy.get('.pap-status-next-button').should('not.be.enabled');
    cy.get('pap-error-form-handler ion-list ion-label').should(
      'include.text',
      'Questo campo è obbligatorio',
    );
  });

  it('should verify all addresses from the API response', function () {
    if (calendarData && Array.isArray(calendarData.data)) {
      cy.get('.pap-calendar-address-button-label').should('be.visible').click();
      calendarData.data.forEach((item: any, index: number) => {
        cy.get('.pap-popover-address')
          .eq(index)
          .invoke('text')
          .then(text => {
            expect(text).include(item.address.address);
          });
      });
      cy.get('.pap-popover-address').eq(0).should('be.visible').click();
    }
  });
});

describe('pap-report-ticket: test the correct behaviour of form at third step', () => {
  it('should go to third step with a trash type selected', () => {
    testGoToThirdStep(formMockup);
  });

  it('should display the correct ticket type, ticket label', () => {
    cy.get('.pap-form-content').should('include.text', reportTicketForm.label);
    const expectedLabelText = reportTicketForm.step[2].label;
    cy.get('.pap-form-label').should('include.text', expectedLabelText);
    cy.get('pap-error-form-handler ion-list ion-label').should('not.exist');
  });

  it('should open action sheet when image picker button is clicked', () => {
    cy.get('pap-form-image-picker ion-button').click();
    cy.get('ion-action-sheet').should('exist');
    cy.get('.action-sheet-group-cancel').click();
    cy.get('ion-action-sheet').should('not.exist');
  });
});

describe('pap-report-ticket: test the correct behaviour of form at fourth step', () => {
  it('should go to fourth step', () => {
    cy.get('.pap-status-next-button').click();
  });

  it('should display the correct ticket type, ticket label', () => {
    cy.get('.pap-form-content').should('include.text', reportTicketForm.label);
    const expectedLabelText = reportTicketForm.step[3].label;
    cy.get('.pap-form-label').should('include.text', expectedLabelText);
    cy.get('pap-error-form-handler ion-list ion-label').should('not.exist');
  });

  it('should write a text into text area and go to recap', () => {
    cy.get('ion-textarea').type(formMockup.Note as string);
    cy.get('.pap-status-next-button').click();
  });
  it('should write a text into text area and go to recap', () => {
    cy.get('ion-input').should('be.visible').type(formMockup.Telefono);
    cy.get('.pap-status-checkmark-button').should('exist').click();
  });
});
describe('pap-abandonment-ticket: test the correct behaviour of form at recap step', () => {
  it('should display sending button in status', () => {
    cy.get('.pap-status-sending-button').should('exist');
  });
  it('test values inside a recap ticket form', () => testRecapTicketForm(formMockup));
});

describe('pap-report-ticket: test the correct behaviour of cancel button in status', () => {
  it('should display ion-alert correctly', () => {
    cy.get('.pap-status-cancel-icon').should('exist').click();
    cy.get('ion-alert').should('exist');
  });

  it('should display alert title correctly', () => {
    const alertTitle =
      reportTicketForm && reportTicketForm.label
        ? `Vuoi annullare ${reportTicketForm.label}?`
        : 'Vuoi annullare?';
    cy.get('.alert-title').should('have.text', alertTitle);
    cy.get('ion-alert').should('exist');
  });

  it('should have 2 buttons inside the alert-button-group', () => {
    cy.get('.alert-button-group button').should('have.length', 2);
  });

  it('should click on the "Ok" button and navigate to /home', () => {
    cy.get('ion-alert .alert-button-group button').contains('Ok').click();
    cy.url().should('include', '/home');
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
