import {e2eLogin, hexToRgb} from 'cypress/utils/test-utils';
import {homeButtons, servicesButtons} from 'projects/pap/src/app/features/home/home.model';
import {TrashBookRow} from 'projects/pap/src/app/features/trash-book/trash-book-model';
import {Feature} from 'projects/pap/src/app/shared/form/location/location.model';
import {abandonmentTicketForm} from 'projects/pap/src/app/shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

const servicesButton = homeButtons.find(button => button.label === 'Servizi');
const abandonmentTicketButton = servicesButtons.find(button => button.text === 'Segnala abbandono');
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;
const apiZonesGeoJson = `${environment.api}/c/${environment.companyId}/zones.geojson`;

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
    const apiZonesGeoJsonData = interception?.response?.body;
    cy.wrap(apiZonesGeoJsonData).as('apiZonesGeoJsonData');
    cy.log(apiZonesGeoJsonData);
  });
  e2eLogin();
});

describe('pap-abandonment-ticket: test the correct behaviour of form at first step', () => {
  it('should navigate correctly to report abandonment', () => {
    if (servicesButton && abandonmentTicketButton) {
      cy.contains(servicesButton.label).click();
      cy.contains(abandonmentTicketButton.text).click();
    } else {
      throw new Error('Services button not found in homeButtons.');
    }
  });

  it('should display the correct ticket type, label and status back button should be hidden', () => {
    cy.get('.pap-form-first-step').should('include.text', abandonmentTicketForm.label);
    const expectedLabelText = abandonmentTicketForm.step[0].label;
    cy.get('.pap-form-label-first-step').should('include.text', expectedLabelText);
    cy.get('.pap-status-back-button').should('be.hidden');
  });
});

describe('pap-abandonment-ticket: test the correct behaviour of form at second step', () => {
  it('should display the correct ticket type, ticket label, status next button should be disabled and a label with this field is required if no trash type selected', () => {
    cy.get('.pap-status-next-button').click();
    cy.get('.pap-form-content').should('include.text', abandonmentTicketForm.label);
    const expectedLabelText = abandonmentTicketForm.step[1].label;
    cy.get('.pap-form-label').should('include.text', expectedLabelText);
    cy.get('.pap-status-next-button').should('not.be.enabled');
    cy.get('pap-error-form-handler ion-list ion-label').should(
      'include.text',
      'Questo campo è obbligatorio',
    );
  });
});

describe.skip('pap-abandonment-ticket: test the correct behaviour of form at third step', () => {
  it('should go to third step with a trash type selected', () => {
    cy.get('pap-form-select ion-list ion-item').first().click();
    cy.get('.pap-status-next-button').click();
  });

  it('should display the correct ticket type, ticket label, status next button should be disabled and a label with this field is required if no location selected', () => {
    cy.get('.pap-form-content').should('include.text', abandonmentTicketForm.label);
    const expectedLabelText = abandonmentTicketForm.step[2].label;
    cy.get('.pap-form-label').should('include.text', expectedLabelText);
    cy.get('.pap-status-next-button').should('not.be.enabled');
    cy.get('pap-error-form-handler ion-list ion-label').should(
      'include.text',
      'Questo campo è obbligatorio',
    );
  });

  it('should click on a random position on the pap-map and verify address', () => {
    cy.wait(1000); //TODO manage waiting without wait
    // Start intercepting requests to Nominatim
    cy.intercept('https://nominatim.openstreetmap.org/reverse*').as('nominatimRequest');
    // Perform the click on the center of the map
    cy.get('pap-form-location').then($map => {
      const width = $map.width();
      const height = $map.height();
      if (width && height) {
        // Find the center of the element
        const centerX = width / 2;
        const centerY = height / 2;
        // Click on the center of the map
        cy.wait(1000);
        cy.wrap($map).click(centerX, centerY);
      }
    });
    // Wait for the request to Nominatim to be made
    cy.wait('@nominatimRequest').then(interception => {
      const url = new URL(interception.request.url);
      const lat = url.searchParams.get('lat');
      const lon = url.searchParams.get('lon');
      // Now you have the coordinates in `lat` and `lon`
      // Make a new request to Nominatim to get the `display_name`
      // and then check that the `ion-textarea` element contains that value
      cy.request(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      ).then(response => {
        // const nominatimDisplayName = response.body.display_name;
        cy.get('pap-form-location ion-item ion-textarea').should('not.be.empty');
      });
    });
  });

  it('should have a label that matches one of the apiZonesGeoJson labels', function () {
    cy.get('pap-form-location ion-label')
      .should('be.visible')
      .invoke('text')
      .then(uiLabelText => {
        const labelsFromApi = this['apiZonesGeoJsonData'].features.map(
          (feature: Feature) => feature.properties.label,
        );
        expect(labelsFromApi).to.include(uiLabelText.trim());
      });
  });
});

describe.skip('pap-abandonment-ticket: test the correct behaviour of form at fourth step', () => {
  it('should go to fourth step with a location selected', () => {
    cy.get('.pap-status-next-button').click();
  });

  it('should display the correct ticket type, ticket label', () => {
    cy.get('.pap-form-content').should('include.text', abandonmentTicketForm.label);
    const expectedLabelText = abandonmentTicketForm.step[3].label;
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

describe.skip('pap-abandonment-ticket: test the correct behaviour of form at fifth step', () => {
  it('should go to fifth step', () => {
    cy.get('.pap-status-next-button').click();
  });

  it('should display the correct ticket type, ticket label', () => {
    cy.get('.pap-form-content').should('include.text', abandonmentTicketForm.label);
    const expectedLabelText = abandonmentTicketForm.step[4].label;
    cy.get('.pap-form-label').should('include.text', expectedLabelText);
    cy.get('pap-error-form-handler ion-list ion-label').should('not.exist');
  });

  it('should write a text into text area and go to recap', () => {
    cy.get('ion-textarea').type('this is a text for e2e test by Rubens');
    cy.get('.pap-status-checkmark-button').should('exist').click();
  });
});

describe.skip('pap-abandonment-ticket: test the correct behaviour of form at recap step', () => {
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

describe.skip('pap-abandonment-ticket: test the correct behaviour of cancel button in status', () => {
  it('should display ion-alert correctly', () => {
    cy.get('.pap-status-cancel-icon').should('exist').click();
    cy.get('ion-alert').should('exist');
  });

  it('should display alert title correctly', () => {
    const alertTitle =
      abandonmentTicketForm && abandonmentTicketForm.label
        ? `Vuoi annullare ${abandonmentTicketForm.label}?`
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
