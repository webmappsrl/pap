import {
  FormMockup,
  e2eLogin,
  testLocation,
  testRecapTicketForm,
  testValidZone,
} from 'cypress/utils/test-utils';
import {homeButtons, servicesButtons} from 'projects/pap/src/app/features/home/home.model';
import {Feature} from 'projects/pap/src/app/shared/form/location/location.model';
import {ticketReservationForm} from 'projects/pap/src/app/shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

const serviziButton = homeButtons.find(button => button.label === 'Servizi');
const ticketReservationButton = servicesButtons.find(
  button => button.text === 'Prenota un servizio',
);
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;
const apiZonesGeoJson = `${environment.api}/c/${environment.companyId}/zones.geojson`;
let apiZonesGeoJsonData: any = null;
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
  cy.intercept('GET', apiZonesGeoJson).as('apiZonesGeoJsonCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@trashTypesCall').then(interception => {
    const trashTypesData = interception?.response?.body;
    cy.wrap(trashTypesData).as('trashTypesData');
    cy.log(trashTypesData);
  });
  cy.wait('@apiZonesGeoJsonCall').then(interception => {
    apiZonesGeoJsonData = interception?.response?.body;
    cy.wrap(apiZonesGeoJsonData).as('apiZonesGeoJsonData');
    cy.log(apiZonesGeoJsonData);
  });
  e2eLogin();
});

describe('pap-ticket-reservation: test the correct behaviour of form at first step', () => {
  it('should open the action sheet when the "Servizi" and click button "Prenota un servizio"', () => {
    if (serviziButton && ticketReservationButton) {
      cy.contains(serviziButton.label).click();
      cy.contains(ticketReservationButton.text).click();
    } else {
      throw new Error('Servizi button not found in homeButtons.');
    }
  });

  it('should display the correct ticket type, label and status back button should be hidden', () => {
    cy.get('.pap-form-first-step').should('include.text', ticketReservationForm.label);
    const expectedLabelText = ticketReservationForm.step[0].label;
    cy.get('.pap-form-label-first-step').should('include.text', expectedLabelText);
    cy.get('.pap-status-back-button').should('be.hidden');
  });
});

describe('pap-ticket-reservation: test the correct behaviour of form at second step', () => {
  it('should display the correct ticket type, ticket label, status next button should be disabled and a label with "Questo campo è obbligatorio" if no trash type selected', () => {
    cy.get('.pap-status-next-button').click();
    cy.get('.pap-form-content').should('include.text', ticketReservationForm.label);
    const expectedLabelText = ticketReservationForm.step[1].label;
    cy.get('.pap-form-label').should('include.text', expectedLabelText);
    cy.get('.pap-status-next-button').should('not.be.enabled');
    cy.get('pap-error-form-handler ion-list ion-label').should(
      'include.text',
      'Questo campo è obbligatorio',
    );
  });
});

describe('pap-ticket-reservation: test the correct behaviour of form at third step', () => {
  it('should go to third step with a trash type selected', () => {
    cy.get('pap-form-select ion-list ion-item')
      .first()
      .then(btn => {
        formMockup.Servizio = btn.text();
      });
    cy.get('pap-form-select ion-list ion-item').first().click();
    cy.get('.pap-status-next-button').click();
  });

  it('should display the correct ticket type, ticket label, status next button should be disabled and a label with "Questo campo è obbligatorio" if no location selected', () => {
    cy.get('.pap-form-content').should('include.text', ticketReservationForm.label);
    const expectedLabelText = ticketReservationForm.step[2].label;
    cy.get('.pap-form-label').should('include.text', expectedLabelText);
    cy.get('.pap-status-next-button').should('not.be.enabled');
    cy.get('pap-error-form-handler ion-list ion-label').should(
      'include.text',
      'Questo campo è obbligatorio',
    );
  });

  it('should click on a random position on the pap-map and verify address', () =>
    testLocation(formMockup));

  it('should have a label that matches one of the apiZonesGeoJson labels', () =>
    testValidZone(apiZonesGeoJsonData));
});

describe('pap-ticket-reservation: test the correct behaviour of form at fourth step', () => {
  it('should go to fourth step with a location selected', () => {
    cy.get('.pap-status-next-button').click();
  });

  it('should display the correct ticket type, ticket label', () => {
    cy.get('.pap-form-content').should('include.text', ticketReservationForm.label);
    const expectedLabelText = ticketReservationForm.step[3].label;
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

describe('pap-ticket-reservation: test the correct behaviour of form at fifth step', () => {
  it('should go to fifth step', () => {
    cy.get('.pap-status-next-button').click();
  });

  it('should display the correct ticket type, ticket label', () => {
    cy.get('.pap-form-content').should('include.text', ticketReservationForm.label);
    const expectedLabelText = ticketReservationForm.step[4].label;
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

describe('pap-ticket-reservation: test the correct behaviour of form at recap step', () => {
  it('should display the recap title', () => {
    cy.get('.pap-form-recap-title').should('include.text', 'Riepilogo');
  });
  it('test values inside a recap ticket form', () => testRecapTicketForm(formMockup));
});

describe('pap-ticket-reservation: test the correct behaviour of button "annulla" in status', () => {
  it('should display ion-alert correctly', () => {
    cy.get('.pap-status-cancel-icon').should('exist').click();
    cy.get('ion-alert').should('exist');
  });

  it('should display alert title correctly', () => {
    const alertTitle =
      ticketReservationForm && ticketReservationForm.label
        ? `Vuoi annullare ${ticketReservationForm.label}?`
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
