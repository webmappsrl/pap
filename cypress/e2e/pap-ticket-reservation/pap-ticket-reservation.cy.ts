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
import {TicketFormConf} from 'projects/pap/src/app/shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

const servicesButton = homeButtons.find(button => button.label === 'Servizi');
let reservationConfig: TicketFormConf;
const ticketReservationButton = servicesButtons.find(
  button => button.text === 'Prenota un servizio di ritiro',
);
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;
const apiTicketFormsConfig = `${environment.api}/c/${environment.companyId}/ticket-forms-config`;
const apiTicket = `${environment.api}/c/${environment.companyId}/ticket`;
const apiZonesGeoJson = `${environment.api}/c/${environment.companyId}/zones.geojson`;
// Config senza step location usata nel test del confirmation_message — evita dipendenza dal map Leaflet
const minimalReservationFixture = 'minimal-reservation-config.json';
const mockZonesGeoJson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [[[[9.5, 43.5], [11.0, 43.5], [11.0, 44.8], [9.5, 44.8], [9.5, 43.5]]]],
    },
    properties: {id: 1, label: 'Zona Test', comune: 'Massarosa', availableUserTypes: [], types: [], url: ''},
  }],
};
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
  cy.intercept('GET', apiTicketFormsConfig, {fixture: 'ticket-forms-config.json'}).as('ticketFormsConfigCall');
  cy.intercept('GET', apiZonesGeoJson, {body: mockZonesGeoJson}).as('apiZonesGeoJsonCall');
  cy.fixture('ticket-forms-config.json').then(data => {
    reservationConfig = data.data.reservation;
  });
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@trashTypesCall').then(interception => {
    const trashTypesData = interception?.response?.body;
    cy.wrap(trashTypesData).as('trashTypesData');
    cy.log(trashTypesData);
  });
  e2eLogin();
  // Zones are mocked with mockZonesGeoJson — set directly without relying on HTTP call
  apiZonesGeoJsonData = mockZonesGeoJson;
  cy.wrap(mockZonesGeoJson).as('apiZonesGeoJsonData');
});

describe('pap-ticket-reservation: test the correct behaviour of form at first step', () => {
  it('should open the action sheet when the "Servizi" and click button "Prenota un servizio di ritiro"', () => {
    if (servicesButton && ticketReservationButton) {
      cy.contains(servicesButton.label).click();
      cy.contains(ticketReservationButton.text).should('be.visible').click();
    } else {
      cy.log(`${ticketReservationButton!.text} button not found in homeButtons.`);
    }
  });

  it('should display the correct ticket type, label and status back button should be hidden', () => {
    testTicketFormStep(reservationConfig, 0);
  });
});

describe('pap-ticket-reservation: test the correct behaviour of form at second step', () => {
  it('should display the correct ticket type, ticket label, status next button should be disabled and a label with "Questo campo è obbligatorio" if no trash type selected', () => {
    testTicketFormStep(reservationConfig, 1);
  });
});

describe('pap-ticket-reservation: test the correct behaviour of form at third step', () => {
  it('should go to third step with a trash type selected', () => {
    testGoToThirdStep(formMockup);
  });

  it('should display the correct ticket type and label for the third step with a disabled next button and an error message', () => {
    testTicketFormStep(reservationConfig, 2, true, true);
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
    testTicketFormStep(reservationConfig, 3);
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
    testTicketFormStep(reservationConfig, 4);
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
    testAlertTitle(reservationConfig);
  });

  it('should have 2 buttons inside the alert-button-group', () => {
    cy.get('.alert-button-group button').should('have.length', 2);
  });

  it('should click on the "Ok" button and navigate to /home', () => {
    cy.get('ion-alert .alert-button-group button').contains('Ok').click();
    cy.url().should('include', '/home');
  });
});

describe('pap-ticket-reservation: success alert shows confirmation_message with <br> separator', () => {
  before(() => {
    // Ricarica la pagina per resettare lo store NgRx (ticketFormsConfigsLoaded → false)
    // così il nuovo intercept per minimalReservationConfig viene effettivamente usato
    cy.intercept('GET', apiTicketFormsConfig, {fixture: minimalReservationFixture}).as('ticketFormsConfigMinimal');
    cy.intercept('GET', apiTrashTypes, {fixture: 'trash-types.json'}).as('trashTypesForConfirmation');
    cy.intercept('GET', apiZonesGeoJson, {body: mockZonesGeoJson}).as('zonesForConfirmation');
    cy.visit(Cypress.env('baseurl'));
  });

  it('should show finalMessage and confirmation_message separated by <br> in success alert', () => {
    cy.fixture('trash-types.json').then((trashTypes: any) => {
      const types: any[] = Array.isArray(trashTypes) ? trashTypes : (trashTypes.data ?? []);
      const typeWithConfirmation = types.find(
        (t: any) => t.confirmation_message && t.showed_in?.reservation === true,
      );
      if (!typeWithConfirmation) {
        cy.log('Nessun trash type con confirmation_message nella fixture — test skippato');
        return;
      }

      const typeName: string =
        typeof typeWithConfirmation.name === 'string'
          ? typeWithConfirmation.name
          : (typeWithConfirmation.name?.it ?? '');

      cy.intercept('POST', apiTicket, {
        statusCode: 200,
        body: {data: {id: 9999, code: 'TEST-9999'}, message: 'ok', success: true},
      }).as('sendTicket');

      // Apri form prenotazione
      cy.contains(servicesButton!.label).click();
      cy.contains(ticketReservationButton!.text).should('be.visible').click();

      // Step 0 — intro label: vai avanti
      cy.get('.pap-status-next-button').click();

      // Step 1 — trash_type_id: seleziona il tipo con confirmation_message
      cy.get('.pap-calendar-trashlist').contains(typeName).click();
      cy.get('.pap-status-next-button').click();

      // Step 2 — note
      cy.get('ion-textarea').type('nota per test conferma');
      cy.get('.pap-status-next-button').click();

      // Step 3 — phone
      cy.get('input').should('be.visible').type('3334455667');
      cy.get('.pap-status-checkmark-button').click();

      // Recap — invia
      cy.get('.pap-status-sending-button').click();
      cy.wait('@sendTicket');

      // Verifica che l'alert contenga confirmation_message separato da <br>
      cy.get('ion-alert').should('be.visible');
      cy.get('ion-alert .alert-message').then($el => {
        const html = $el.html();
        expect(html).to.include(typeWithConfirmation.confirmation_message);
        expect(html).to.include('<br>');
      });
    });
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
