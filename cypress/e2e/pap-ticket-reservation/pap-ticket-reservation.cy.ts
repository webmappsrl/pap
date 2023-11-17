import {
  FormMockup,
  e2eLogin,
  testImagePicker,
  testGoToThirdStep,
  testLocation,
  testRecapTicketForm,
  testTicketFormStep,
  testValidZone,
  testAlertTitle,
} from 'cypress/utils/test-utils';
import {homeButtons, servicesButtons} from 'projects/pap/src/app/features/home/home.model';
import {ticketReservationForm} from 'projects/pap/src/app/shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

const servicesButton = homeButtons.find(button => button.label === 'Servizi');
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
    if (servicesButton && ticketReservationButton) {
      cy.contains(servicesButton.label).click();
      cy.contains(ticketReservationButton.text).should('be.visible').click();
    } else {
      cy.log(`${ticketReservationButton!.text} button not found in homeButtons.`);
    }
  });

  it('should display the correct ticket type, label and status back button should be hidden', () => {
    testTicketFormStep(ticketReservationForm, 0);
  });
});

describe('pap-ticket-reservation: test the correct behaviour of form at second step', () => {
  it('should display the correct ticket type, ticket label, status next button should be disabled and a label with "Questo campo è obbligatorio" if no trash type selected', () => {
    testTicketFormStep(ticketReservationForm, 1);
  });
});

describe('pap-ticket-reservation: test the correct behaviour of form at third step', () => {
  it('should go to third step with a trash type selected', () => {
    testGoToThirdStep(formMockup);
  });

  it('should display the correct ticket type and label for the third step with a disabled next button and an error message', () => {
    testTicketFormStep(ticketReservationForm, 2, true, true);
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
    testTicketFormStep(ticketReservationForm, 3);
  });

  it('should open action sheet when image picker button is clicked', () => {
    testImagePicker();
  });
});

describe('pap-ticket-reservation: test the correct behaviour of form at fifth step', () => {
  it('should go to fifth step', () => {
    cy.get('.pap-status-next-button').click();
  });

  it('should display the correct ticket type, ticket label', () => {
    testTicketFormStep(ticketReservationForm, 4);
  });

  it('should write a text into text area and go to recap', () => {
    cy.get('ion-textarea').type(formMockup.Note as string);
    cy.get('.pap-status-next-button').click();
  });
  it('should write a text into text area and go to recap', () => {
    cy.get('input').should('be.visible').type(formMockup.Telefono);
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
    testAlertTitle(ticketReservationForm);
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
