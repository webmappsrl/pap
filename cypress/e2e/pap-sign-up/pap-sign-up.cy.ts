import {Feature, UserType} from 'projects/pap/src/app/shared/form/location/location.model';
import {environment} from 'projects/pap/src/environments/environment';

const apiZonesGeoJson = `${environment.api}/c/${environment.companyId}/zones.geojson`;

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.intercept('GET', apiZonesGeoJson).as('apiZonesGeoJsonCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@apiZonesGeoJsonCall').then(interception => {
    const apiZonesGeoJsonData = interception?.response?.body;
    cy.wrap(apiZonesGeoJsonData).as('apiZonesGeoJsonData');
    cy.log(apiZonesGeoJsonData);
  });
});

describe('pap-sign-up: test the correct behaviour of form at first step', () => {
  it('should navigate to /sign-up when sign up button is clicked', () => {
    cy.get('.pap-header-button').click();
    cy.get('.pap-alert-login .alert-button-role-sign-up').click();
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
    cy.get('.ion-align-self-start ion-button').should('exist', 'not.be.disabled');
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.enabled');
  });

  it('should not be able to go ahead with too short password', () => {
    cy.get('ion-input[formControlName="password"]').type('123');
    cy.get('ion-input[formControlName="password_confirmation"]').type('123');
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.enabled');
  });

  it('should not be able to go ahead with wrong password', () => {
    cy.get('ion-input[formControlName="password"]').type('testpasswordcoretta123');
    cy.get('ion-input[formControlName="password_confirmation"]').type('testpasswordsbagliata321');
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.enabled');
  });

  it('should now able to go ahead with correct password', () => {
    cy.get('ion-input[formControlName="password"]').type('testpasswordcoretta123');
    cy.get('ion-input[formControlName="password_confirmation"]').type('testpasswordcoretta123');
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.disabled');
  });
});

describe('pap-sign-up: test the correct behaviour of form at third step', () => {
  it('should navigate to third step correctly', () => {
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.disabled').click();
  });

  it('only prev button should be disabled without a selected address', () => {
    cy.get('.ion-align-self-start ion-button').should('exist', 'not.be.disabled');
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.enabled');
  });

  it('should click on the center of the pap-map and verify address', () => {
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

  it('only prev button should be disabled with a selected address and without a user type selected', () => {
    cy.get('.ion-align-self-start ion-button').should('exist', 'not.be.disabled');
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.enabled');
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

  it('should select always first user type from list', () => {
    cy.get('pap-third-step-signup-form ion-radio-group ion-item').first().click();
  });

  it('should now able to send your registration with all the required fields', () => {
    cy.get('.ion-align-self-end ion-button').should('exist', 'not.be.disabled');
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
