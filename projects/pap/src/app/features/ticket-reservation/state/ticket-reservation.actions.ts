import {createAction, props} from '@ngrx/store';
import {SuccessResponse} from '../../../shared/form/model';

export const loadTicketReservations = createAction('[TicketReservation] Load TicketReservations');

export const loadTicketReservationsSuccess = createAction(
  '[TicketReservation] Load TicketReservations Success',
  props<{data: SuccessResponse}>(),
);

export const loadTicketReservationsFailure = createAction(
  '[TicketReservation] Load TicketReservations Failure',
  props<{error: string}>(),
);
