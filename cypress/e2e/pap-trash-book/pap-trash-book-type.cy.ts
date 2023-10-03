import {hexToRgb, papLang} from 'cypress/utils/test-utils';
import {homeButtons} from 'projects/pap/src/app/features/home/home.model';
import {TrashBookType} from 'projects/pap/src/app/features/trash-book/trash-book-model';
import {environment} from 'projects/pap/src/environments/environment';

const rifiutarioButton = homeButtons.find(button => button.label === 'Rifiutario');
const apiWastes = `${environment.api}/c/${environment.companyId}/wastes.json`;
const apiTrashTypes = `${environment.api}/c/${environment.companyId}/trash_types.json`;

before(() => {
  cy.intercept('GET', apiWastes).as('wastesCall');
  cy.intercept('GET', apiTrashTypes).as('trashTypesCall');
  cy.visit('/');
  cy.wait('@wastesCall').then(interception => {
    const wastesData = interception?.response?.body;
    cy.wrap(wastesData).as('wastesData');
  });
  cy.wait('@trashTypesCall').then(interception => {
    const trashTypesData = interception?.response?.body;
    cy.wrap(trashTypesData).as('trashTypesData');
  });
});

describe('pap-trash-book-type: test the correct behaviour of page', () => {
  it('should render the correct number and content of ion-labels in pap-trash-book', function () {
    if (rifiutarioButton) {
      cy.contains(rifiutarioButton.label).click();
      cy.url().should('include', rifiutarioButton.url);
      cy.get('pap-trash-book ion-card ion-list ion-item ion-label').should(
        'have.length',
        this['wastesData'].length,
      );
      cy.get('pap-trash-book ion-card ion-list ion-item ion-label').should($labels => {
        const labelTexts = $labels.map((index, el) => Cypress.$(el).text()).get();
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
    const expectedTypeDescription = this['trashTypesData'].find(
      (type: TrashBookType) => type.id === trashTypeId,
    ).description;
    const expectedTypeHowTo = this['trashTypesData'].find(
      (type: TrashBookType) => type.id === trashTypeId,
    ).howto;
    const expectedAllowedData = this['trashTypesData'].find(
      (type: TrashBookType) => type.id === trashTypeId,
    ).allowed;
    const expectedNotAllowedData = this['trashTypesData'].find(
      (type: TrashBookType) => type.id === trashTypeId,
    ).notallowed;
    cy.get('ion-searchbar input').type(searchTerm);
    cy.get('pap-trash-book ion-card ion-list ion-item ion-label')
      .contains(searchTerm)
      .should('be.visible')
      .click();
    cy.get('.trash-book-details-type .trash-book-details-value').should('be.visible').click();
    cy.get('pap-trash-book-type').should('exist');
    cy.get('h1').should('contain.text', papLang(expectedTypeName));
    if (expectedTypeDescription) {
      cy.get('.trash-book-type-content').should('contain.text', papLang(expectedTypeDescription));
    }
    if (expectedTypeHowTo) {
      cy.get('.trash-book-type-content').should('contain.text', papLang(expectedTypeHowTo));
    }
    cy.get('ion-col[size="6"]:first li').each(($li, index) => {
      expect($li.text().trim()).to.equal(expectedAllowedData[index].trim());
    });

    cy.get('ion-col[size="6"]:last li').each(($li, index) => {
      expect($li.text().trim()).to.equal(expectedNotAllowedData[index].trim());
    });
  });

  it('should have the correct environment color for the trash-book-type-icon-allowed icon', () => {
    const primaryTintColorRegex = /--ion-color-primary-tint: (\#\w+);/;
    const match = environment.config.resources.variables.match(primaryTintColorRegex);
    const environmentPrimaryTintColor = match ? match[1] : null;
    if (environmentPrimaryTintColor) {
      cy.get('.trash-book-type-icon-allowed').should(
        'have.css',
        'color',
        hexToRgb(environmentPrimaryTintColor),
      );
    } else {
      throw new Error('Color not found in environment variables.');
    }
  });

  it('should have the correct environment color for the ion-card', () => {
    const lightColorRegex = /--ion-color-light: (\#\w+);/;
    const match = environment.config.resources.variables.match(lightColorRegex);
    const environmentLightColorRegex = match ? match[1] : null;
    if (environmentLightColorRegex) {
      cy.get('ion-card').should(
        'have.css',
        'background-color',
        hexToRgb(environmentLightColorRegex),
      );
    } else {
      throw new Error('Color not found in environment variables.');
    }
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
