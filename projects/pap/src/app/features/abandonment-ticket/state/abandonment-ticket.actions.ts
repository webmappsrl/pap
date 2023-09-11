import {createAction, props} from '@ngrx/store';
import {SuccessResponse} from '../../../shared/form/model';

export const loadAbandonmentTickets = createAction('[AbandonmentTicket] Load AbandonmentTickets');

export const loadAbandonmentTicketsSuccess = createAction(
  '[AbandonmentTicket] Load AbandonmentTickets Success',
  props<{data: SuccessResponse}>(),
);

export const loadAbandonmentTicketsFailure = createAction(
  '[AbandonmentTicket] Load AbandonmentTickets Failure',
  props<{error: string}>(),
);
