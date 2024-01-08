import {format} from 'date-fns';
import {it as itLocale} from 'date-fns/locale';
import {environment} from 'projects/pap/src/environments/environment';
import {Feature} from 'projects/pap/src/app/shared/form/location/location.model';
import {TicketFormConf} from 'projects/pap/src/app/shared/models/form.model';

export interface FormMockup {
  Immagine?: string;
  Indirizzo?: {
    city: string;
    address: string;
  };
  Note?: string;
  Servizio?: string;
  Telefono: string;
}

/**
 * Clears the test state.
 * This function uses Cypress to clear cookies and local storage.
 * It is useful for resetting the application state between end-to-end tests.
 */
export function clearTestState(): void {
  cy.clearCookies();
  cy.clearLocalStorage();
}

/**
 * Logs into the application.
 * @param email - User's email address.
 * @param password - User's password.
 */
export function e2eLogin(
  email: string = 'email',
  password: string = Cypress.env('password'),
): Cypress.Chainable {
  email = Cypress.env(email);
  const apiLogin = `${environment.api}/login`;
  cy.intercept('POST', apiLogin).as('loginRequest');
  cy.get('.pap-header-button').click();
  cy.get('ion-alert').should('be.visible');
  cy.get('.alert-button-role-sign-in').click();
  cy.url().should('include', '/sign-in');
  cy.get('form [formControlName="email"]').type(email);
  cy.get('form [formControlName="password"]').type(password);
  cy.get('ion-button[type="submit"]').click();
  return cy.wait('@loginRequest').its('response.body');
}

/**
 * Formats a date using the date-fns library.
 * @param dateStr - Date as a string.
 * @param formatStr - Desired format.
 * @returns Formatted date.
 */
export function formatDateUsingPapDatePipe(dateStr: string, formatStr: string = 'MMMM'): string {
  return format(new Date(dateStr), formatStr, {
    locale: itLocale,
  });
}

/**
 * Generates the start and stop date range for the API call.
 * The start date is 15 days prior to the current date, and the stop date is the current date.
 *
 * @returns {Object} An object containing formatted startDate and stopDate strings.
 */
export function getApiDateRange(): {startDate: string; stopDate: string} {
  const today = new Date(); // Get the current date
  const startDate = new Date();
  startDate.setDate(today.getDate() - 14); // Subtract 14 days from the current date
  // Helper function to format a date into "day-month-year" without leading zeros
  const formatDate = (date: Date): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // JavaScript month starts from 0 (0 = January, 11 = December)
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // Return the formatted dates
  return {
    startDate: formatDate(startDate),
    stopDate: formatDate(today),
  };
}

/**
 * Converts a color from HEX format to RGB format.
 * @param hex - Color in HEX format.
 * @returns Color in RGB format.
 */
export function hexToRgb(hex: string): string {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Navigates to a page by clicking a button and verifies the URL.
 * Assumes that the navigation might require interaction with an alert.
 *
 * @param buttonLabel - CSS selector for the header button to initiate navigation.
 * @param expectedUrl - Expected URL to navigate to.
 */
export function navigateToPageAndVerifyUrl(buttonLabel: string, expectedUrl: string): void {
  cy.contains(buttonLabel).click();
  cy.url().should('include', expectedUrl);
}

/**
 * Translates a value based on the given language key or returns the string directly.
 *
 * If the provided value is a string, it directly returns the string.
 * If the value is an object with language keys, it returns the value of the first key.
 *
 * @param value - The string or object with language keys.
 * @returns Translated string or the direct string.
 */
export function papLang(value: string | {[lang: string]: string}): string {
  if (typeof value === 'string') {
    return value;
  } else {
    const keys = Object.keys(value);
    return value[keys[0]];
  }
}

/**
 * Verifies the alert title based on the given ticket form.
 *
 * @param {Object} ticketForm - The ticket form data object.
 */
export function testAlertTitle(ticketForm: any): void {
  const alertTitle =
    ticketForm && ticketForm.label ? `Vuoi annullare ${ticketForm.label}?` : 'Vuoi annullare?';

  cy.get('.alert-title').should('have.text', alertTitle);
  cy.get('ion-alert').should('exist');
}

/**
 * Tests navigation to the third step of the form.
 * @param formMockup - Mock object of the form.
 */
export function testGoToThirdStep(formMockup: FormMockup): void {
  cy.get('.pap-calendar-trashlist')
    .first()
    .then(btn => {
      formMockup.Servizio = btn.text().trim();
    });
  cy.get('.pap-calendar-trashlist').first().click();
  cy.get('.pap-status-next-button').click();
}

/**
 * Handles image selection.
 * Opens the image picker, verifies its presence, and closes the picker.
 */
export function testImagePicker(): void {
  cy.get('pap-form-image-picker ion-button').click();
  cy.get('ion-action-sheet').should('exist');
  cy.get('.action-sheet-group-cancel').click();
  cy.get('ion-action-sheet').should('not.exist');
}

/**
 * Tests location selection on a map.
 * Interacts with the map, makes requests to Nominatim for geolocation data,
 * and verifies that the data matches with the form inputs.
 * @param formMockup - Mock object of the form containing address data.
 */
export function testLocation(formMockup: any): void {
  // Start intercepting requests to Nominatim
  cy.intercept('https://nominatim.openstreetmap.org/reverse*').as('nominatimRequest');
  // Perform the click on the center of the map
  cy.get('pap-form-location')
    .should('be.visible')
    .then($map => {
      cy.get('.leaflet-control-zoom-in').should('be.visible').click({multiple: true, force: true});
      cy.wait(500);
      cy.get('.leaflet-control-zoom-in').should('be.visible').click({multiple: true, force: true});
      cy.wait(500);
      cy.get('.leaflet-control-zoom-in').should('be.visible').click({multiple: true, force: true});
      cy.wait(500);

      const width = $map.width();
      const height = $map.height();
      if (width && height) {
        // Find the center of the element
        const centerX = width / 2;
        const centerY = height / 2;
        // Click on the center of the map
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
      const displayName = response.body.display_name;
      console.log(`Dati di risposta da Nominatim: ${displayName}`);
      console.log(`Latitudine: ${lat}, Longitudine: ${lon}`);
      cy.wait(1000);
      cy.get('[formControlName="city"]')
        .invoke('val')
        .then(cityValue => {
          expect(cityValue).to.not.be.empty;
          formMockup.Indirizzo.city = cityValue as string;
        });
      cy.get('[formControlName="address"]')
        .invoke('val')
        .then(addressValue => {
          expect(addressValue).to.not.be.empty;
          formMockup.Indirizzo.address = addressValue as string;
        });
    });
  });
}

/**
 * Tests the recap of the ticket form.
 * Verifies that each row in the recap matches the data entered in the form.
 * @param formMockup - Mock object of the form containing ticket data.
 */
export function testRecapTicketForm(formMockup: FormMockup): void {
  cy.get('.pap-form-recap-list ion-row').each((row, rowIndex) => {
    let recap: keyof typeof formMockup | null = null;
    cy.wrap(row)
      .find('ion-col')
      .eq(0)
      .invoke('text')
      .then(text => {
        recap = text.replace(':', '').trim() as keyof typeof formMockup;
      });
    cy.wrap(row)
      .find('ion-col')
      .eq(1)
      .invoke('text')
      .then(value => {
        if (recap && formMockup[recap] != null) {
          switch (recap) {
            case 'Telefono':
              expect(value.trim()).to.not.be.empty;
              break;
            case 'Indirizzo':
              expect(value).to.include((formMockup[recap] as any).city);
              expect(value).to.include((formMockup[recap] as any).address);
              break;
            default:
              expect((formMockup[recap] as string).trim()).contain(value.trim());
              break;
          }
        }
      });
  });
}

/**
 * Tests the form step to ensure the correct ticket type and label are displayed,
 * and that the back button is hidden.
 *
 * @param {Object} ticketForm - The ticket form data object.
 * @param {number} stepIndex - The index of the step to test.
 */
export function testTicketFormStep(
  ticketForm: TicketFormConf,
  stepIndex: number,
  nextButtonShouldBeDisabled: boolean = false,
  shouldCheckErrorMessage: boolean = false,
  mandatoryMessage: string = 'Questo campo è obbligatorio',
): void {
  const currentStep = ticketForm.step[stepIndex];
  const expectedLabelText = currentStep.label;
  switch (stepIndex) {
    case 0:
      cy.get('.pap-form-first-step').should('include.text', ticketForm.label);
      cy.get('.pap-form-label-first-step').should('include.text', expectedLabelText);
      cy.get('.pap-status-back-button').should('be.hidden');
      break;

    case 1:
      cy.get('.pap-status-next-button').click();
      cy.get('.pap-form-content').should('include.text', ticketForm.label);
      cy.get('.pap-form-label').should('include.text', expectedLabelText);
      cy.get('.pap-status-next-button').should('not.be.enabled');
      cy.get('pap-error-form-handler ion-list ion-label').should('include.text', mandatoryMessage);
      break;

    case 2:
      cy.get('.pap-form-content').should('include.text', ticketForm.label);
      cy.get('.pap-form-label').should('include.text', expectedLabelText);
      if (currentStep.userAddress) {
        cy.wait(200);
        cy.get('pap-address-selector').should('exist');
        cy.get('pap-address-selector').click();
        cy.get('ion-popover').should('exist');
        cy.get('ion-popover ion-list ion-item').last().click();
      }
      if (nextButtonShouldBeDisabled) {
        cy.get('.pap-status-next-button').should('not.be.enabled');
      }

      if (shouldCheckErrorMessage) {
        cy.get('pap-error-form-handler ion-list ion-label').should(
          'include.text',
          mandatoryMessage,
        );
      } else {
        cy.get('pap-error-form-handler ion-list ion-label').should('not.exist');
      }
      break;

    case 3:
    case 4:
      cy.get('.pap-form-content').should('include.text', ticketForm.label);
      cy.get('.pap-form-label').should('include.text', expectedLabelText);
      cy.get('pap-error-form-handler ion-list ion-label').should('not.exist');
      break;

    default:
      cy.log(`Unknown step index: ${stepIndex}`);
  }
}

/**
 * Tests the validity of a geographical zone.
 * @param zoneGeojson - GeoJSON data of the zone.
 */
export function testValidZone(zoneGeojson: any): void {
  expect(zoneGeojson).to.be.not.null;
  cy.get('.top-right ion-badge')
    .should('be.visible')
    .invoke('text')
    .then(uiLabelText => {
      cy.log(uiLabelText);
      const labelsFromApi = zoneGeojson.features.map(
        (feature: Feature) => feature.properties.label,
      );
      expect(labelsFromApi).to.include(uiLabelText.trim());
    });
}

/**
 * Translates a ticket type.
 * @param ticketType - The ticket type.
 * @returns Translated ticket type.
 */
export function translateTicketType(ticketType: string): string {
  switch (ticketType) {
    case 'abandonment':
      return 'abbandono';
    case 'reservation':
      return 'prenotazione';
    case 'report':
      return 'mancato ritiro';
    case 'info':
      return 'informazioni';
    default:
      return ticketType;
  }
}

/**
 * Verifies the day and month of a given date in the format used in PAP reports.
 * @param dateStr - The date string to be verified.
 */
export function verifyPapDateComponents(dateStr: string): void {
  const formattedDay = formatDateUsingPapDatePipe(dateStr, 'd');
  const formattedMonth = formatDateUsingPapDatePipe(dateStr, 'MMMM');

  cy.get('.pap-date-day').contains(formattedDay).should('exist');
  cy.get('.pap-date-month').contains(formattedMonth).should('exist');
}
