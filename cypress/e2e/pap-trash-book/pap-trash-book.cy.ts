import {hexToRgb} from 'cypress/utils/test-utils';
import {homeButtons} from 'projects/pap/src/app/features/home/home.model';
import {
  TrashBookRow,
  TrashBookType,
} from 'projects/pap/src/app/features/trash-book/trash-book-model';
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

describe('pap-trash-book: test the correct behaviour of page', () => {
  it('should render the correct number and content of ion-labels', function () {
    if (trathTypesButton) {
      cy.contains(trathTypesButton.label).click();
      cy.url().should('include', trathTypesButton.url);
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

  it('should match trash type color correctly', function () {
    cy.get('pap-trash-book ion-card ion-list ion-item ion-icon').each($icon => {
      const itemColor = $icon.css('color');
      const itemName = $icon.next().text().trim();
      cy.log(`Checking color for: ${itemName}`);
      const expectedColor = this['trashTypesData'].find(
        (trashType: TrashBookRow) => trashType.name === itemName,
      )?.color;
      if (expectedColor) {
        const rgbExpectedColor = hexToRgb(expectedColor);
        expect(itemColor).to.equal(rgbExpectedColor);
      }
    });
  });

  it('should filter the list when a search term is entered', function () {
    const randomIndex = Math.floor(Math.random() * this['wastesData'].length);
    const randomWaste = this['wastesData'][randomIndex];
    const searchTerm = randomWaste.name;
    cy.get('ion-searchbar input').type(searchTerm);
    cy.get('pap-trash-book ion-card ion-list ion-item ion-label')
      .contains(searchTerm)
      .should('be.visible');
  });

  it('should not find results with a wrong search', () => {
    const searchTerm = 'asd';
    cy.get('ion-searchbar input').clear().type(searchTerm);
    cy.get('pap-trash-book ion-card ion-list ion-item ion-label').should('not.be.visible');
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
