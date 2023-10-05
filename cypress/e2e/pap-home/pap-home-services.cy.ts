import {homeButtons, servicesButtons} from 'projects/pap/src/app/features/home/home.model';

const servicesButton = homeButtons.find(button => button.label === 'Servizi');
const closeButton = servicesButtons.find(button => button.text === 'CHIUDI');

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.wait(1000);
  cy.visit('/');
});

describe('pap-home-servizi: test the correct presences of action sheet buttons', () => {
  it('should open the action sheet when the services button is clicked and close button is clicked', () => {
    if (servicesButton) {
      cy.contains(servicesButton.label).click();
      if (closeButton) {
        cy.contains(closeButton.text).click();
        cy.get('.pap-form-selector').should('not.be.visible');
      } else {
        throw new Error('Close button not found in servicesButtons.');
      }
    } else {
      throw new Error('Services button not found in homeButtons.');
    }
  });

  it('should display the correct number of servicesButtons', () => {
    if (servicesButton) {
      cy.contains(servicesButton.label).click({force: true});
      cy.get('.pap-form-selector button').should('have.length', servicesButtons.length);
      if (closeButton) {
        cy.contains(closeButton.text).click();
        cy.get('.pap-form-selector').should('not.be.visible');
      } else {
        throw new Error('Close button not found in servicesButtons.');
      }
    } else {
      throw new Error('Services button not found in homeButtons.');
    }
  });

  it('should display correct label of servicesButtons', () => {
    servicesButtons.forEach((btn, index) => {
      cy.get('.pap-form-selector button').eq(index).should('have.text', btn.text);
    });
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
