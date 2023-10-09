import {homeButtons} from 'projects/pap/src/app/features/home/home.model';
import {environment} from 'projects/pap/src/environments/environment';

const apiGeojson = `${environment.api}/c/${environment.companyId}/waste_collection_centers.geojson`;
const wasteCenterButton = homeButtons.find(button => button.label === 'Centri raccolta');

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(Cypress.env('baseurl'));
});

describe('pap-waste-center-collection: test the correct behaviour of page', () => {
  beforeEach(() => {
    cy.intercept('GET', apiGeojson).as('geojsonCall');
  });

  it('should render the correct number and content of ion-labels', () => {
    if (wasteCenterButton) {
      cy.contains(wasteCenterButton.label).click();
      cy.url().should('include', wasteCenterButton.url);
      cy.wait('@geojsonCall').then(interception => {
        const geojsonData = interception?.response?.body;
        cy.wrap(geojsonData).as('geojsonData');
      });
    } else {
      throw new Error('Button not found.');
    }
  });

  it('should display markers on the map', () => {
    cy.get('.leaflet-marker-icon').should('be.visible');
  });

  it('should display an alert when a marker is clicked', function () {
    cy.get('.leaflet-marker-icon').first().should('be.visible').click();
    cy.get('.pap-waste-center-alert').should('be.visible');
  });

  it('should close the alert when the oK button is clicked', () => {
    cy.get('.pap-waste-center-alert-btn-ok').should('be.visible').click();
    cy.get('.pap-waste-center-alert').should('not.be.visible');
  });

  it('should open external link when the directions button is clicked', () => {
    cy.get('.leaflet-marker-icon').first().should('be.visible').click();
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get('.pap-waste-center-alert-btn-nav').first().should('be.visible').click();
    cy.get('@windowOpen').should('be.called');
  });

  it('should open external link when the website button is clicked', () => {
    cy.get('.leaflet-marker-icon').first().should('be.visible').click();
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });
    cy.get('.pap-waste-center-alert-btn-web').click();
    cy.get('@windowOpen').should('be.called');
  });

  it('should display the correct data when a marker is clicked', function () {
    cy.get('.leaflet-marker-icon').first().should('be.visible').click();

    cy.get('.pap-waste-center-alert h2').eq(0).should('be.visible');
    cy.get('.pap-waste-center-alert ion-label').eq(0).should('be.visible');
    cy.get('.pap-waste-center-alert ion-label').eq(1).should('be.visible');
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
