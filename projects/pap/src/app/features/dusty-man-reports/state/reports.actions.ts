import {createAction, props} from '@ngrx/store';
import {Ticket} from './reports.effects';

export const loadTickets = createAction('[Tickets] Load Tickets');

export const loadTicketsSuccess = createAction(
  '[Reports] Load Tickets Success',
  props<{reports: Ticket[]}>(),
);

export const loadTicketsFailure = createAction(
  '[Reports] Load Tickets Failure',
  props<{error: string}>(),
);

export const updateTicket = createAction(
  '[Ticket] update Ticket',
  props<{data: Partial<Ticket>}>(),
);

export const updateTicketSuccess = createAction(
  '[Ticket] update ticket Success',
  props<{ticket: any}>(),
);

export const updateTicketFailure = createAction(
  '[Ticket] update tickets Failure',
  props<{error: string}>(),
);

export const selectTicketById = createAction('[Ticket] select ticket by id', props<{id: number}>());

export const selectTicketByIdSuccess = createAction(
  '[Ticket] select ticket by id Success',
  props<{report: any}>(),
);
export const selectTicketByIdFailure = createAction(
  '[Ticket] select ticket by id Failure',
  props<{error: any}>(),
);
