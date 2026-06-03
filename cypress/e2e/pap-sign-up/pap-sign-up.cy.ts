import {FormMockup, testLocation, testValidZone} from 'cypress/utils/test-utils';
import {Feature, UserType} from 'projects/pap/src/app/shared/form/location/location.model';
import {environment} from 'projects/pap/src/environments/environment';

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

const mockCompaniesData = {
  success: true,
  data: {
    form_json: [
      {name: 'name', label: 'Nome', type: 'text', step: 1, rules: [{name: 'required'}], only_fe: true},
      {name: 'email', label: 'Email', type: 'text', step: 1, rules: [{name: 'required'}, {name: 'email'}], only_fe: true},
      {name: 'phone_number', label: 'Telefono', type: 'text', step: 1},
      {name: 'fiscal_code', label: 'Codice fiscale', type: 'text', step: 1, from_form_data: true, rules: [{name: 'required'}]},
      {name: 'user_code', label: 'Nominativo TARI', type: 'text', step: 1},
      {name: 'password', label: 'Password', type: 'password', step: 2, rules: [{name: 'required'}, {name: 'minLength', value: 8}], only_fe: true},
      {name: 'password_confirmation', label: 'Conferma Password', type: 'password', step: 2, rules: [{name: 'required'}, {name: 'minLength', value: 8}], only_fe: true},
      {name: 'secondStep', label: '', type: 'group', step: 2, customValidator: {name: 'confirmedValidator', args: ['password', 'password_confirmation']}, only_fe: true},
    ],
    properties: [],
  },
  message: 'Company form JSON and properties.',
};

const mockZonesGeoJson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'MultiPolygon',
      coordinates: [[[[9.5, 43.5], [11.0, 43.5], [11.0, 44.8], [9.5, 44.8], [9.5, 43.5]]]],
    },
    properties: {id: 1, label: 'Zona Test', comune: 'Massarosa', availableUserTypes: [{id: 1, label: {it: 'Residente'}}], types: [], url: ''},
  }],
};

beforeEach(() => {
  cy.intercept('GET', apiZonesGeoJson, {body: mockZonesGeoJson}).as('apiZonesGeoJsonCall');
  cy.intercept('GET', `${environment.api}/c/${environment.companyId}/companies_data*`, {body: mockCompaniesData}).as('companiesDataCall');
});

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.intercept('GET', apiZonesGeoJson, {body: mockZonesGeoJson}).as('apiZonesGeoJsonCall');
  cy.intercept('GET', `${environment.api}/c/${environment.companyId}/companies_data*`, {body: mockCompaniesData}).as('companiesDataCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@companiesDataCall');
});

describe('pap-sign-up: test the correct behaviour of form at first step', () => {
  it('should navigate to /sign-up when sign up button is clicked', () => {
    cy.get('.pap-header-button-setting').click();
    cy.get('.pap-alert .alert-button-role-sign-up').click();
    cy.url().should('include', '/sign-up');
    // Zones mocked — set data directly; wait only if the call happens
    apiZonesGeoJsonData = mockZonesGeoJson;
    cy.wrap(mockZonesGeoJson).as('apiZonesGeoJsonData');
    cy.get('[e2e-pap-form-control-name="phone_number"]', {timeout: 15000}).should('exist');
  });

  it('form next button should be disabled without required fields', () => {
    cy.get('ion-card ion-button').should('exist', 'not.be.enabled');
  });

  it('should type a phone number', () => {
    cy.get('[e2e-pap-form-control-name="phone_number"]').type('123456789');
  });

  it('should type a user code', () => {
    cy.get('[e2e-pap-form-control-name="user_code"]').type('testusercodee2e');
  });

  it('should type a fiscal code', () => {
    cy.get('[e2e-pap-form-control-name="fiscal_code"]').type('WBMWMP98R03G702M');
  });

  it('next button should be disabled yet with phone, user code and fiscal code entered because need name and email', () => {
    cy.get('ion-card ion-button').should('exist', 'not.be.enabled');
  });

  it('should type name', () => {
    cy.get('[e2e-pap-form-control-name="name"]').type('Name e2e');
  });

  it('should type email', () => {
    cy.get('[e2e-pap-form-control-name="email"]').type('mail@e2e.it');
  });

  it('next button should now be enabled with required fields', () => {
    cy.get('ion-card ion-button').should('exist', 'not.be.disabled');
  });
});

describe('pap-sign-up: test the correct behaviour of form at second step', () => {
  it('should navigate to second step correctly', () => {
    cy.get('ion-card ion-button').should('exist', 'not.be.disabled').click();
  });

  it('only prev button should be disabled without required fields', () => {
    cy.get('.pap-second-step-signup-form-back-button').should('exist', 'not.be.disabled');
    cy.get('.pap-second-step-signup-form-next-button').should('exist', 'not.be.enabled');
  });

  it('should not be able to go ahead with too short password', () => {
    cy.get('[e2e-pap-form-control-name="password"]').type('123');
    cy.get('[e2e-pap-form-control-name="password_confirmation"]').type('123');
    cy.get('.pap-second-step-signup-form-next-button').should('exist', 'not.be.enabled');
  });

  it('should not be able to go ahead with wrong password', () => {
    cy.get('[e2e-pap-form-control-name="password"]').type('testpasswordcoretta123');
    cy.get('[e2e-pap-form-control-name="password_confirmation"]').type('testpasswordsbagliata321');
    cy.get('.pap-second-step-signup-form-next-button').should('exist', 'not.be.enabled');
  });

  it('should now able to go ahead with correct password', () => {
    cy.get('[e2e-pap-form-control-name="password"]').type('testpasswordcoretta123');
    cy.get('[e2e-pap-form-control-name="password_confirmation"]').type('testpasswordcoretta123');
    cy.get('.pap-second-step-signup-form-next-button').should('exist', 'not.be.disabled');
  });
});

describe('pap-sign-up: test the correct behaviour of form at third step', () => {
  it('should navigate to third step correctly', () => {
    cy.get('.pap-second-step-signup-form-next-button').should('exist', 'not.be.disabled').click();
  });

  it('only prev button should be disabled without a selected address', () => {
    cy.get('.ion-align-self-start ion-button').should('exist', 'not.be.disabled');
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.enabled');
  });

  it('should click on the center of the pap-map and verify address', () => {
    testLocation(formMockup);
  });

  it('only prev button should be disabled with a selected address and without a user type selected', () => {
    cy.get('.ion-align-self-start ion-button').should('exist', 'not.be.disabled');
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.enabled');
  });

  it('should have a label that matches one of the apiZonesGeoJson user types', () => {
    testValidZone(apiZonesGeoJsonData);
  });

  it('should select always first user type from list', () => {
    cy.get('pap-third-step-signup-form ion-radio-group ion-item ion-radio')
      .first()
      .should('not.be.disabled');
  });

  it('should now able to send your registration with all the required fields', () => {
    cy.get('.pap-third-step-signup-checkmark-button').should('exist', 'not.be.disabled');
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
