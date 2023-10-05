import {environment} from 'projects/pap/src/environments/environment';

const apiGeojson = `${environment.api}/c/${environment.companyId}/waste_collection_centers.geojson`;

beforeEach(() => {
  cy.intercept('GET', apiGeojson).as('geojsonCall');
  cy.visit('/waste-center-collection');
});

describe('pap-waste-center-collection: test the correct behaviour of page', () => {
  it('should make a successful GET request to the geojson API', () => {
    cy.wait('@geojsonCall').its('response.statusCode').should('eq', 200); //success status code
  });

  it('should display markers on the map', () => {
    cy.get('.leaflet-marker-icon').should('be.visible');
  });

  it('should display an alert when a marker is clicked', () => {
    cy.get('.leaflet-marker-icon').first().click();
    cy.get('.pap-waste-center-alert').should('be.visible');
  });

  it('should close the alert when the oK button is clicked', () => {
    cy.get('.leaflet-marker-icon').first().click();
    cy.get('.pap-waste-center-alert-btn-ok').click();
    cy.get('.pap-waste-center-alert').should('not.be.visible');
  });

  it('should open external link when the directions button is clicked', () => {
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get('.leaflet-marker-icon').first().click();
    cy.get('.pap-waste-center-alert-btn-nav').click();
    cy.get('@windowOpen').should('be.called');
  });

  it('should open external link when the website button is clicked', () => {
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get('.leaflet-marker-icon').first().click();
    cy.get('.pap-waste-center-alert-btn-web').click();
    cy.get('@windowOpen').should('be.called');
  });

  it('should display the correct data when a marker is clicked', () => {
    // Intercept the API call and alias the response
    cy.intercept('GET', apiGeojson).as('geojsonCall');
    // Visit the page and wait for the API call to complete
    cy.visit('/waste-center-collection');
    cy.wait('@geojsonCall').then(interception => {
      // Get the name description and hours from the first feature of the intercepted response
      const expectedName = interception?.response?.body.features[0].properties.name;
      const expectedDescription = interception?.response?.body.features[0].properties.description;
      const expectedOrario = interception?.response?.body.features[0].properties.orario;
      cy.get('.leaflet-marker-icon').first().click();
      cy.get('.pap-waste-center-alert h2').eq(0).should('have.text', expectedName);
      cy.get('.pap-waste-center-alert ion-label').eq(0).should('have.text', expectedDescription);
      cy.get('.pap-waste-center-alert ion-label').eq(1).should('have.text', expectedOrario);
    });
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
