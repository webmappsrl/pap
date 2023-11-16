import {format} from 'date-fns';
import {it as itLocale} from 'date-fns/locale';
import {environment} from 'projects/pap/src/environments/environment';
import {Feature} from 'projects/pap/src/app/shared/form/location/location.model';
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
 * Logs into the application.
 * @param email - User's email address.
 * @param password - User's password.
 */
export function e2eLogin(
  email: string = Cypress.env('email'),
  password: string = Cypress.env('password'),
): Cypress.Chainable {
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

export function testLocation(formMockup: any): void {
  // Start intercepting requests to Nominatim
  cy.screenshot();
  cy.intercept('https://nominatim.openstreetmap.org/reverse*').as('nominatimRequest');
  // Perform the click on the center of the map
  cy.get('pap-form-location')
    .should('be.visible')
    .then($map => {
      const width = $map.width();
      const height = $map.height();
      if (width && height) {
        // Find the center of the element
        const centerX = width / 2;
        const centerY = height / 1.6;
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
      cy.get('[formControlName="city"]')
        .invoke('val')
        .then(cityValue => {
          formMockup.Indirizzo.city = cityValue as string;
          expect(displayName).to.include(cityValue);
        });
      cy.get('[formControlName="address"]')
        .invoke('val')
        .then(addressValue => {
          formMockup.Indirizzo.address = addressValue as string;
          expect(displayName).to.include(addressValue);
        });
    });
  });
}

export function testRecapTicketForm(formMockup: FormMockup) {
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
            default:
              expect((formMockup[recap] as string).trim()).to.equal(value.trim());
              break;
            case 'Indirizzo':
              expect(value).to.include((formMockup[recap] as any).city);
              expect(value).to.include((formMockup[recap] as any).address);
              break;
          }
        }
      });
  });
}

export function testValidZone(zoneGeojson: any) {
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

export function testGoToThirdStep(formMockup: FormMockup) {
  cy.get('.pap-calendar-trashlist')
    .first()
    .then(btn => {
      formMockup.Servizio = btn.text().trim();
    });
  cy.get('.pap-calendar-trashlist').first().click();
  cy.get('.pap-status-next-button').click();
}
