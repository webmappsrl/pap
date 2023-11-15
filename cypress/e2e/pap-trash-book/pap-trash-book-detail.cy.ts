import {e2eLogin, hexToRgb} from 'cypress/utils/test-utils';
import {homeButtons} from 'projects/pap/src/app/features/home/home.model';
import {TrashBookType} from 'projects/pap/src/app/features/trash-book/trash-book-model';
import {environment} from 'projects/pap/src/environments/environment';

const trathTypesButton = homeButtons.find(button => button.label === 'Rifiutario');
const apiWastes = `${environment.api}/c/${environment.companyId}/wastes.json`;
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.wait(1000);
  cy.intercept('GET', apiWastes).as('wastesCall');
  cy.intercept('GET', apiTrashTypes).as('trashTypesCall');
  cy.visit(Cypress.env('baseurl'));
  cy.wait('@wastesCall').then(interception => {
    const wastesData = interception?.response?.body;
    cy.wrap(wastesData).as('wastesData');
  });
  cy.wait('@trashTypesCall').then(interception => {
    const trashTypesData = interception?.response?.body;
    cy.wrap(trashTypesData).as('trashTypesData');
  });
  e2eLogin();
});

describe('pap-trash-book-detail: test the correct behaviour of page', () => {
  it('should render the correct number and content of ion-labels in pap-trash-book', function () {
    if (trathTypesButton) {
      cy.contains(trathTypesButton.label).click();
      cy.url().should('include', trathTypesButton.url);
      cy.get('pap-trash-book ion-card ion-list ion-item ion-label').should(
        'have.length',
        this['wastesData'].length,
      );
      cy.get('pap-trash-book ion-card ion-list ion-item ion-label').should($labels => {
        const labelTexts = $labels.map((index, el) => Cypress.$(el).text().trim()).get();
        const namesFromWastesApi = this['wastesData'].map((item: TrashBookType) => item.name);
        expect(labelTexts).to.deep.equal(namesFromWastesApi);
      });
    } else {
      throw new Error('Button not found.');
    }
  });

  it('should navigate to the trash book detail page, display correct waste details based on search input, and verify associated actions', function () {
    const randomIndex = Math.floor(Math.random() * this['wastesData'].length);
    const randomWaste = this['wastesData'][randomIndex];
    const searchTerm = randomWaste.name;
    const trashTypeId = randomWaste.trash_type_id;
    const expectedTypeName = this['trashTypesData'].find(
      (type: TrashBookType) => type.id === trashTypeId,
    ).name;
    cy.get('ion-searchbar input').type(searchTerm);
    cy.get('pap-trash-book ion-card ion-list ion-item ion-label')
      .contains(searchTerm)
      .should('be.visible')
      .click();
    cy.url().should('include', '/trashbook/detail');
    cy.get('h1').should('contain.text', randomWaste.name);
    if (randomWaste.pap) {
      cy.get('.trash-book-details-calendar ion-button')
        .should('exist')
        .and('contain.text', 'calendario');
    } else {
      cy.get('.trash-book-details-calendar ion-label.trash-book-details-value')
        .should('exist')
        .and('contain.text', 'non pianificato');
    }
    if (randomWaste.collection_center) {
      cy.get('.trash-book-details-collection-center ion-button')
        .should('exist')
        .and('contain.text', 'Vedi');
    } else {
      cy.log('Field collection_center does not exist..');
    }
    if (randomWaste.delivery) {
      cy.get('.trash-book-details-delivery ion-button')
        .should('exist')
        .and('contain.text', 'Prenota');
    } else {
      cy.log('Field delivery does not exist.');
    }
    if (randomWaste.where != '') {
      cy.get('.trash-book-details-where ion-label.trash-book-details-value ')
        .should('exist')
        .and('contain.text', randomWaste.where);
    } else {
      cy.log('Field does where not exist.');
    }
    cy.get('.trash-book-details-type')
      .invoke('text')
      .then(text => text.trim())
      .should('eq', expectedTypeName);
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
