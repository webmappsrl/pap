import {format} from 'date-fns';
import {it as itLocale} from 'date-fns/locale';
import {environment} from 'projects/pap/src/environments/environment';

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
