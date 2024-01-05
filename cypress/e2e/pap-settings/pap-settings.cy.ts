import {
  clearTestState,
  FormMockup,
  e2eLogin,
  testLocation,
  testValidZone,
} from 'cypress/utils/test-utils';
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
  clearTestState();
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
});

describe('pap-settings: test the correct behaviour of add address button', () => {
  it('should open location modal correctly', () => {
    cy.get('ion-button').contains('Aggiungi indirizzo').click();
    cy.get('pap-location-modal').should('exist');
  });

  it('should click on a random position on the pap-map and verify address', () => {
    testLocation(formMockup);
  });

  it('should have a label that matches one of the apiZonesGeoJson labels', () => {
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
  clearTestState();
});
