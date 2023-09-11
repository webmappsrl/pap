import {createAction, props} from '@ngrx/store';
import {ApiTicket} from '../../../shared/models/apimodels';
import {SuccessResponse} from '../../../shared/form/model';

export const loadInfoTickets = createAction('[InfoTicket] Load InfoTickets');

export const loadInfoTicketsSuccess = createAction(
  '[InfoTicket] Load InfoTickets Success',
  props<{data: SuccessResponse}>(),
);

export const loadInfoTicketsFailure = createAction(
  '[InfoTicket] Load InfoTickets Failure',
  props<{error: string}>(),
);
export const sendReportInfoTickets = createAction(
  '[InfoTicket] sendReport InfoTickets',
  props<{data: ApiTicket}>(),
);

export const sendReportInfoTicketsSuccess = createAction(
  '[InfoTicket] sendReport InfoTickets Success',
  props<{data: any}>(),
);

export const sendReportInfoTicketsFailure = createAction(
  '[InfoTicket] sendReport InfoTickets Failure',
  props<{error: string}>(),
);
