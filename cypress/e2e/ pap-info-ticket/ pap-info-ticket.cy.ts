import {e2eLogin} from 'cypress/utils/test-utils';
import {homeButtons, servicesButtons} from 'projects/pap/src/app/features/home/home.model';
import {infoTicketForm} from 'projects/pap/src/app/shared/models/form.model';

const servicesButton = homeButtons.find(button => button.label === 'Servizi');
const infoTicketButton = servicesButtons.find(button => button.text === 'Richiedi Informazioni');

before(() => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.wait(1000);
  cy.visit('/');
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
    cy.get('ion-textarea').type('this is a text for e2e test by Rubens');
    cy.get('.pap-status-checkmark-button').should('exist').click();
  });
});

describe('pap-info-ticket: test the correct behaviour of form at recap step', () => {
  it('should display the recap title', () => {
    cy.get('.pap-form-recap-title').should('include.text', 'Riepilogo');
  });

  it('should display sending button in status', () => {
    cy.get('.pap-status-sending-button').should('exist');
  });

  it('should display the text field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("text")')) {
        cy.get('ion-note[ngSwitchCase="text"]').should('not.be.empty');
      }
    });
  });

  it('should display the trash type field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("trash_type_id")')) {
        cy.get('ion-note[ngSwitchCase="trash_type_id"]').should('not.be.empty');
      }
    });
  });

  it('should display the building field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("building")')) {
        cy.get('ion-note[ngSwitchCase="building"]').should('not.be.empty');
      }
    });
  });

  it('should display the floor field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("floor")')) {
        cy.get('ion-note[ngSwitchCase="floor"]').should('not.be.empty');
      }
    });
  });

  it('should display the name field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("name")')) {
        cy.get('ion-note[ngSwitchCase="name"]').should('not.be.empty');
      }
    });
  });

  it('should display the surname field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("surname")')) {
        cy.get('ion-note[ngSwitchCase="surname"]').should('not.be.empty');
      }
    });
  });

  it('should display the image field if present', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("image")')) {
        cy.get('img').should('be.visible');
      }
    });
  });

  it('should display the default message for not inserted values', () => {
    cy.get('.pap-form-recap-note-internal').then($elements => {
      if ($elements.is(':contains("messages.notInserted")')) {
        cy.get('ion-note.pap-form-recap-note[ngSwitchDefault]').should(
          'include.text',
          'messages.notInserted',
        );
      }
    });
  });
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
