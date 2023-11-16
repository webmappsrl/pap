import {e2eLogin, testValidZone} from 'cypress/utils/test-utils';
import {Address, User} from 'projects/pap/src/app/core/auth/auth.model';
import {Feature, UserType} from 'projects/pap/src/app/shared/form/location/location.model';
import {environment} from 'projects/pap/src/environments/environment';

let apiName: User;
let apiEmail: User;
let authToken: User;
let apiPhoneNumber: User;
let apiFiscalCode: User;
let apiUserCode: User;
let apiUserAddress: any;
let apiZonesGeoJsonData: any = null;
const apiUser = `${environment.api}/user`;
const apiZonesGeoJson = `${environment.api}/c/${environment.companyId}/zones.geojson`;

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.intercept('GET', apiZonesGeoJson).as('apiZonesGeoJsonCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@apiZonesGeoJsonCall').then(interception => {
    apiZonesGeoJsonData = interception?.response?.body;
    cy.wrap(apiZonesGeoJsonData).as('apiZonesGeoJsonData');
    cy.log(apiZonesGeoJsonData);
  });
  e2eLogin().then(response => {
    expect(response.success).to.be.true;
    authToken = response.data.token;
    cy.request({
      url: apiUser,
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    }).then(response => {
      apiName = response.body.name;
      apiEmail = response.body.email;
      apiPhoneNumber = response.body.phone_number;
      apiFiscalCode = response.body.fiscal_code;
      apiUserCode = response.body.user_code;
      apiUserAddress = response.body.addresses.map((address: Address) => address.address);
    });
  });
});

describe('pap-settings: test the correct behaviour of firstStep tab', () => {
  it('should navigate to /settings after login', () => {
    cy.get('.pap-header-button').click();
    cy.url().should('include', '/settings');
  });

  it('should check if the name in the form matches the name from the API', () => {
    cy.get('ion-input[formControlName="name"]').should('have.value', apiName);
  });

  it('should check if the name in the form matches the email from the API', () => {
    cy.get('ion-input[formControlName="email"]').should('have.value', apiEmail);
  });

  it('should check if the phone number in the form matches the phone number from the API', () => {
    if (apiPhoneNumber) {
      cy.get('ion-input[formControlName="phone_number"]').should('have.value', apiPhoneNumber);
    } else {
      cy.log('API phone number is not defined.');
    }
  });

  it('should check if the fiscal code in the form matches the fiscal code from the API', () => {
    if (apiFiscalCode) {
      cy.get('ion-input[formControlName="fiscal_code"]').should('have.value', apiFiscalCode);
    } else {
      cy.log('API fiscal code is not defined.');
    }
  });

  it('should check if the user code in the form matches the user code from the API', () => {
    if (apiUserCode) {
      cy.get('ion-input[formControlName="user_code"]').should('have.value', apiUserCode);
    } else {
      cy.log('API user code is not defined.');
    }
  });
});

describe('pap-settings: test the correct behaviour of secondStep tab', () => {
  it('should navigate to secondStep tab correctly', () => {
    cy.get('ion-segment-button[value="secondStep"]').click();
  });

  it('should disable the save button if no data is entered in the password fields', () => {
    cy.get('ion-input[formControlName="password"]').should(
      'have.attr',
      'placeholder',
      'Inserire la password',
    );
    cy.get('ion-input[formControlName="password_confirmation"]').should(
      'have.attr',
      'placeholder',
      'Inserire la password',
    );
    cy.get('ion-button:contains("Salva")').should('not.be.enabled');
  });

  it('should enable the save button if data is entered in the password fields', () => {
    cy.get('ion-input[formControlName="password"]').type('TestPassword123');
    cy.get('ion-input[formControlName="password_confirmation"]').type('TestPassword123');
    cy.get('ion-button:contains("Salva")').should('not.be.disabled');
  });
});

describe('pap-settings: test the correct behaviour of thirdStep tab', () => {
  it('should navigate to thirdStep tab correctly', () => {
    cy.get('ion-segment-button[value="thirdStep"]').click();
  });

  it('should verify that the displayed zone matches the API zones', function () {
    cy.get('h5')
      .should('exist')
      .invoke('text')
      .then(uiLabelText => {
        const labels = uiLabelText.split('  ').map(label => label.trim());
        const labelsFromApi = this['apiZonesGeoJsonData'].features.map(
          (feature: Feature) => feature.properties.label,
        );
        labels.forEach(label => {
          expect(labelsFromApi).to.include(label);
        });
      });
  });

  it('should verify that all displayed zones match the API user addresses', () => {
    apiUserAddress.forEach((address: Address) => {
      cy.log(`Zona ${address}`);
      cy.get('ion-card-subtitle').should('include.text', address);
    });
  });
});

describe('pap-settings: test the correct behaviour of add address button', () => {
  it('should open location modal correctly', () => {
    cy.get('ion-button').contains('Aggiungi indirizzo').click();
    cy.get('pap-location-modal').should('exist');
  });

  it('should click on a random position on the pap-map and verify address', () => {
    cy.wait(1000); //TODO manage waiting without wait
    //Start intercepting requests to Nominatim
    cy.intercept('https://nominatim.openstreetmap.org/reverse*').as('nominatimRequest');
    //Perform the random click on the map as intended
    cy.get('pap-form-location')
      .should('be.visible')
      .then($map => {
        const width = $map.width();
        const height = $map.height();
        if (width && height) {
          //Find the center of the element
          const centerX = width / 2;
          const centerY = height / 2;
          //Determine the random offset. For example, within a range of +/- 10 pixels from the center.
          const maxOffset = 10;
          const offsetX = Math.floor(Math.random() * (2 * maxOffset + 1)) - maxOffset;
          const offsetY = Math.floor(Math.random() * (2 * maxOffset + 1)) - maxOffset;
          //Calculate the click coordinates
          const clickX = centerX + offsetX;
          const clickY = centerY + offsetY;
          cy.wrap($map).click(clickX, clickY);
        }
      });
    //Wait for the request to Nominatim to be made
    cy.wait('@nominatimRequest').then(interception => {
      const url = new URL(interception.request.url);
      const lat = url.searchParams.get('lat');
      const lon = url.searchParams.get('lon');
      //Now you have the coordinates in `lat` and `lon`
      //Make a new request to Nominatim to get the `display_name`
      //and then check that the `ion-textarea` element contains that value
      cy.request(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=it`,
      ).then(response => {
        // const nominatimDisplayName = response.body.display_name;
        cy.get('pap-form-location ion-item ion-textarea').should('not.be.empty');
      });
    });
  });

  it('should have a label that matches one of the apiZonesGeoJson labels', () => {
    cy.wait(1000);
    cy.log(apiZonesGeoJsonData);
    testValidZone(apiZonesGeoJsonData);
  });

  it('should have a label that matches one of the apiZonesGeoJson user types', function () {
    const labelsFromApi = this['apiZonesGeoJsonData'].features.flatMap((feature: Feature) =>
      feature.properties.availableUserTypes.map((userType: UserType) => userType.label.it),
    );
    cy.get('ion-radio-group ion-item ion-label').each($el => {
      const text = $el.text().trim();
      expect(labelsFromApi).to.include(text);
    });
  });

  it('should select always first user type from list and enabled save button', () => {
    cy.get('ion-radio-group ion-item ion-radio').first().should('not.be.disabled');
    cy.get('ion-button').contains('Salva').should('exist', 'not.be.disabled');
  });

  it('should go back to settings when click on cancel button', () => {
    cy.get('ion-button').contains('Annulla').should('exist').click();
  });
});

describe('pap-settings: test the correct behaviour of log out button', () => {
  it('should logout successfully', () => {
    cy.get('ion-button').contains('Log out').should('exist').click();
    //first alert
    cy.get('.pap-alert .pap-alert-btn-ok').click();
    cy.wait(500);
    //second alert
    cy.get('.pap-alert .pap-alert-btn-ok').click();
    cy.url().should('include', '/home');
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
