import {FormMockup, e2eLogin, testRecapTicketForm} from 'cypress/utils/test-utils';
import {homeButtons, servicesButtons} from 'projects/pap/src/app/features/home/home.model';
import {infoTicketForm} from 'projects/pap/src/app/shared/models/form.model';

const servicesButton = homeButtons.find(button => button.label === 'Servizi');
const infoTicketButton = servicesButtons.find(button => button.text === 'Richiedi Informazioni');
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
  cy.visit(Cypress.env('baseurl'));
  e2eLogin();
});

describe('pap-info-ticket: test the correct behaviour of form at first step', () => {
  it('should navgate correctly to request information"', () => {
    if (servicesButton && infoTicketButton) {
      cy.contains(servicesButton.label).click();
      cy.contains(infoTicketButton.text).click();
    } else {
      throw new Error('Services button not found in homeButtons.');
    }
  });

  it('should display the correct ticket type, label and status back button should be hidden', () => {
    cy.get('.pap-form-first-step').should('include.text', infoTicketForm.label);
    const expectedLabelText = infoTicketForm.step[0].label;
    cy.get('.pap-form-label-first-step').should('include.text', expectedLabelText);
    cy.get('.pap-status-back-button').should('be.hidden');
  });
});

describe('pap-info-ticket: test the correct behaviour of form at second step', () => {
  it('should go to second step', () => {
    cy.get('.pap-status-next-button').click();
  });
  it('should write a text into text area and go to recap', () => {
    cy.get('ion-textarea').type(formMockup.Note as string);
    cy.get('.pap-status-next-button').click();
  });
  it('should write a text into text area and go to recap', () => {
    cy.get('ion-input').should('be.visible').type(formMockup.Telefono);
    cy.get('.pap-status-checkmark-button').should('exist').click();
  });
});

describe('pap-info-ticket: test the correct behaviour of form at recap step', () => {
  it('should display sending button in status', () => {
    cy.get('.pap-status-sending-button').should('exist');
  });
  it('test values inside a recap ticket form', () => testRecapTicketForm(formMockup));
});

describe('pap-info-ticket: test the correct behaviour of cancel button in status', () => {
  it('should display ion-alert correctly', () => {
    cy.get('.pap-status-cancel-icon').should('exist').click();
    cy.get('ion-alert').should('exist');
  });

  it('should display alert title correctly', () => {
    const alertTitle =
      infoTicketForm && infoTicketForm.label
        ? `Vuoi annullare ${infoTicketForm.label}?`
        : 'Vuoi annullare?';
    cy.get('.alert-title').should('have.text', alertTitle);
    cy.get('ion-alert').should('exist');
  });

  it('should have 2 buttons inside the alert-button-group', () => {
    cy.get('.alert-button-group button').should('have.length', 2);
  });

  it('should click on the Ok button and navigate to /home', () => {
    cy.get('ion-alert .alert-button-group button').contains('Ok').click();
    cy.url().should('include', '/home');
  });
});

after(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
});
