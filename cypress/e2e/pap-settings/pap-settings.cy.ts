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
let realZonesGeoJsonData: any = null;
const apiUser = `${environment.api}/user`;
const apiZonesGeoJson = `${environment.api}/c/${environment.companyId}/zones.geojson`;

const mockZonesGeoJson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [[[[9.5, 43.5], [11.0, 43.5], [11.0, 44.8], [9.5, 44.8], [9.5, 43.5]]]],
    },
    properties: {id: 1, label: 'Zona Test', comune: 'Massarosa', availableUserTypes: [
      {id: 1, label: {it: 'Domestico'}},
      {id: 2, label: {it: 'Commerciale'}},
      {id: 3, label: {it: 'Artigianale/industriale'}},
      {id: 4, label: {it: 'Balneare'}},
    ], types: [], url: ''},
  }],
};

const mockCompaniesData = {
  success: true,
  data: {
    form_json: [
      {name: 'name', label: 'Nome', type: 'text', step: 1, rules: [{name: 'required'}], only_fe: true},
      {name: 'email', label: 'Email', type: 'text', step: 1, rules: [{name: 'required'}, {name: 'email'}], only_fe: true},
      {name: 'phone_number', label: 'Telefono', type: 'text', step: 1},
      {name: 'fiscal_code', label: 'Codice fiscale', type: 'text', step: 1, from_form_data: true},
      {name: 'user_code', label: 'Nominativo TARI', type: 'text', step: 1},
      {name: 'password', label: 'Password', type: 'password', step: 2, placeholder: 'Inserire la password', rules: [{name: 'required'}, {name: 'minLength', value: 8}], only_fe: true},
      {name: 'password_confirmation', label: 'Conferma Password', type: 'password', step: 2, placeholder: 'Inserire la password', rules: [{name: 'required'}, {name: 'minLength', value: 8}], only_fe: true},
      {name: 'secondStep', label: '', type: 'group', step: 2, customValidator: {name: 'confirmedValidator', args: ['password', 'password_confirmation']}, only_fe: true},
    ],
    properties: [],
  },
  message: 'Company form JSON and properties.',
};
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
beforeEach(() => {
  cy.intercept('GET', `${environment.api}/c/${environment.companyId}/companies_data*`, {body: mockCompaniesData}).as('companiesDataCall');
  cy.intercept('GET', apiZonesGeoJson, {body: mockZonesGeoJson}).as('apiZonesGeoJsonCallEach');
});

before(() => {
  clearTestState();
  // Fetch real zones separately for thirdStep test (zone label vs calendarSettings)
  cy.request('GET', apiZonesGeoJson).then(resp => {
    realZonesGeoJsonData = resp.body;
  });
  // Mock zones so store always has a zone covering the default map center
  cy.intercept('GET', apiZonesGeoJson, {body: mockZonesGeoJson}).as('apiZonesGeoJsonCall');
  cy.intercept('GET', `${environment.api}/c/${environment.companyId}/companies_data*`, {body: mockCompaniesData}).as('companiesDataCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@companiesDataCall');
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
  cy.wait('@apiZonesGeoJsonCall').then(interception => {
    apiZonesGeoJsonData = interception?.response?.body;
    cy.wrap(apiZonesGeoJsonData).as('apiZonesGeoJsonData');
    cy.log(apiZonesGeoJsonData);
  });
});

describe('pap-settings: test the correct behaviour of firstStep tab', () => {
  it('should navigate to /settings after login', () => {
    cy.get('.pap-header-button-setting').click();
    cy.url().should('include', '/settings');
    cy.get('[e2e-pap-form-control-name="name"]', {timeout: 15000}).should('exist');
  });

  it('should check if the name in the form matches the name from the API', () => {
    cy.get('[e2e-pap-form-control-name="name"]').should('have.value', apiName);
  });

  it('should check if the name in the form matches the email from the API', () => {
    cy.get('[e2e-pap-form-control-name="email"]').should('have.value', apiEmail);
  });

  it('should check if the phone number in the form matches the phone number from the API', () => {
    if (apiPhoneNumber) {
      cy.get('[e2e-pap-form-control-name="phone_number"]').should('have.value', apiPhoneNumber);
    } else {
      cy.log('API phone number is not defined.');
    }
  });

  it('should check if the fiscal code in the form matches the fiscal code from the API', () => {
    if (apiFiscalCode) {
      cy.get('[e2e-pap-form-control-name="fiscal_code"]').should('have.value', apiFiscalCode);
    } else {
      cy.log('API fiscal code is not defined.');
    }
  });

  it('should check if the user code in the form matches the user code from the API', () => {
    if (apiUserCode) {
      cy.get('[e2e-pap-form-control-name="user_code"]').should('have.value', apiUserCode);
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
    cy.get('[e2e-pap-form-control-name="password"]').should('exist');
    cy.get('[e2e-pap-form-control-name="password_confirmation"]').should('exist');
    cy.get('ion-button:contains("Salva")').should('not.be.enabled');
  });

  it('should enable the save button if data is entered in the password fields', () => {
    cy.get('[e2e-pap-form-control-name="password"]').type('TestPassword123');
    cy.get('[e2e-pap-form-control-name="password_confirmation"]').type('TestPassword123');
    cy.get('ion-button:contains("Salva")').should('not.be.disabled');
  });
});

describe('pap-settings: test the correct behaviour of thirdStep tab', () => {
  it('should navigate to thirdStep tab correctly', () => {
    cy.get('ion-segment-button[value="thirdStep"]').click();
  });

  it('should verify that the displayed zone matches the API zones', () => {
    cy.get('h5')
      .should('exist')
      .invoke('text')
      .then(uiLabelText => {
        const labels = uiLabelText.split('  ').map((label: string) => label.trim());
        const labelsFromApi = realZonesGeoJsonData.features.map(
          (feature: Feature) => feature.properties.label,
        );
        labels.forEach((label: string) => {
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
    testValidZone(mockZonesGeoJson);
  });

  it('should have a label that matches one of the apiZonesGeoJson user types', () => {
    const labelsFromApi = mockZonesGeoJson.features.flatMap((feature: any) =>
      feature.properties.availableUserTypes.map((userType: any) => userType.label.it),
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
