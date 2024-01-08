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
});

describe('pap-sign-up: test the correct behaviour of form at first step', () => {
  it('should navigate to /sign-up when sign up button is clicked', () => {
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert .alert-button-role-sign-up').click();
    cy.url().should('include', '/sign-up');
  });

  it('form next button should be disabled without required fields', () => {
    cy.get('ion-card ion-button').should('exist', 'not.be.enabled');
  });

  it('should type a phone number', () => {
    cy.get('ion-input[formControlName="phone_number"]').type('123456789');
  });

  it('should type a user code', () => {
    cy.get('ion-input[formControlName="user_code"]').type('testusercodee2e');
  });

  it('should type a fiscal code', () => {
    cy.get('ion-input[formControlName="fiscal_code"]').type('WBMWMP98R03G702M');
  });

  it('next button should be disabled yet with phone, user code and fiscal code entered because need name and email', () => {
    cy.get('ion-card ion-button').should('exist', 'not.be.enabled');
  });

  it('should type name', () => {
    cy.get('ion-input[formControlName="name"]').type('Name e2e');
  });

  it('should type email', () => {
    cy.get('ion-input[formControlName="email"]').type('mail@e2e.it');
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
    cy.get('ion-input[formControlName="password"]').type('123');
    cy.get('ion-input[formControlName="password_confirmation"]').type('123');
    cy.get('.pap-second-step-signup-form-next-button').should('exist', 'not.be.enabled');
  });

  it('should not be able to go ahead with wrong password', () => {
    cy.get('ion-input[formControlName="password"]').type('testpasswordcoretta123');
    cy.get('ion-input[formControlName="password_confirmation"]').type('testpasswordsbagliata321');
    cy.get('.pap-second-step-signup-form-next-button').should('exist', 'not.be.enabled');
  });

  it('should now able to go ahead with correct password', () => {
    cy.get('ion-input[formControlName="password"]').type('testpasswordcoretta123');
    cy.get('ion-input[formControlName="password_confirmation"]').type('testpasswordcoretta123');
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
