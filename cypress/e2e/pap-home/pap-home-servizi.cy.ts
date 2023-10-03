import {homeButtons, serviziButtons} from 'projects/pap/src/app/features/home/home.model';

const serviziButton = homeButtons.find(button => button.label === 'Servizi');
const chiudiButton = serviziButtons.find(button => button.text === 'CHIUDI');

before(() => {
  cy.visit('/');
});

describe('pap-home-servizi: test the correct presences of action sheet buttons', () => {
  it('should open the action sheet when the "Servizi" button is clicked and close when the "CHIUDI" button is clicked', () => {
    if (serviziButton) {
      cy.contains(serviziButton.label).click();
      if (chiudiButton) {
        cy.contains(chiudiButton.text).click();
        cy.get('.pap-form-selector').should('not.be.visible');
      } else {
        throw new Error('CHIUDI button not found in Servizi buttons.');
      }
    } else {
      throw new Error('Servizi button not found in homeButtons.');
    }
  });

  it('should display the correct number of serviziButtons', () => {
    if (serviziButton) {
      cy.contains(serviziButton.label).click({force: true});
      cy.get('.pap-form-selector button').should('have.length', serviziButtons.length);
      if (chiudiButton) {
        cy.contains(chiudiButton.text).click();
        cy.get('.pap-form-selector').should('not.be.visible');
      } else {
        throw new Error('CHIUDI button not found in Servizi buttons.');
      }
    } else {
      throw new Error('Servizi button not found in homeButtons.');
    }
  });

  it('should display correct label of serviziButtons', () => {
    serviziButtons.forEach((btn, index) => {
      cy.get('.pap-form-selector button').eq(index).should('have.text', btn.text);
    });
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
