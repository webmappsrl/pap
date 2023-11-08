import {
  e2eLogin,
  formatDateUsingPapDatePipe,
  getApiDateRange,
  hexToRgb,
} from 'cypress/utils/test-utils';
import {homeButtons, servicesButtons} from 'projects/pap/src/app/features/home/home.model';
import {TrashBookRow} from 'projects/pap/src/app/features/trash-book/trash-book-model';
import {reportTicketForm} from 'projects/pap/src/app/shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

const servicesButton = homeButtons.find(button => button.label === 'Servizi');
const reportTicketoButton = servicesButtons.find(
  button => button.text === 'Segnala mancato ritiro',
);
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;
const {startDate, stopDate} = getApiDateRange();
const apiCalendarWithDates = `${environment.api}/c/${environment.companyId}/calendar?start_date=${startDate}&stop_date=${stopDate}`;
let calendarData: any;

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
    cy.wait(3000); //TODO manage waiting without wait
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
      calendarData.data.forEach((item: any) => {
        const expectedAddress = item?.address?.address;
        if (expectedAddress) {
          cy.contains('ion-select-option', expectedAddress).should('exist');
        }
      });
    }
  });
});

describe('pap-report-ticket: test the correct behaviour of form at third step', () => {
  it('should go to third step with a trash type selected', () => {
    cy.get('.pap-calendar-trashlist').first().click();
    cy.get('.pap-status-next-button').click();
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
    cy.get('ion-textarea').type('this is a text for e2e test by Rubens');
    cy.get('.pap-status-checkmark-button').should('exist').click();
  });
});

describe('pap-report-ticket: test the correct behaviour of form at recap step', () => {
  it('should display the recap title', () => {
    cy.get('.pap-form-recap-title').should('include.text', 'Riepilogo');
  });

  it('should display sending button in status', () => {
    cy.get('.pap-status-sending-button').should('exist');
  });

  it('should display the text field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("text")')) {
        cy.get('ion-note[ngSwitchCase="text"]').should('not.be.empty');
      }
    });
  });

  it('should display the trash type field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("trash_type_id")')) {
        cy.get('ion-note[ngSwitchCase="trash_type_id"]').should('not.be.empty');
      }
    });
  });

  it('should display the building field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("building")')) {
        cy.get('ion-note[ngSwitchCase="building"]').should('not.be.empty');
      }
    });
  });

  it('should display the floor field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("floor")')) {
        cy.get('ion-note[ngSwitchCase="floor"]').should('not.be.empty');
      }
    });
  });

  it('should display the name field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("name")')) {
        cy.get('ion-note[ngSwitchCase="name"]').should('not.be.empty');
      }
    });
  });

  it('should display the surname field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("surname")')) {
        cy.get('ion-note[ngSwitchCase="surname"]').should('not.be.empty');
      }
    });
  });

  it('should display the image field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("image")')) {
        cy.get('img').should('be.visible');
      }
    });
  });

  it('should display the default message for not inserted values', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("messages.notInserted")')) {
        cy.get('ion-note.pap-form-recap-note[ngSwitchDefault]').should(
          'include.text',
          'messages.notInserted',
        );
      }
    });
  });
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
