import {createAction, props} from '@ngrx/store';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import {Ticket, SuccessResponse} from '../model';
import {TicketFormConf} from '../../models/form.model';

export const sendTicket = createAction('[Ticket] send Ticket', props<{ticket: Ticket}>());
export const sendTicketSuccess = createAction(
  '[Ticket] send Ticket Success',
  props<{res: SuccessResponse}>(),
);
export const sendTicketFailure = createAction(
  '[Ticket] send Ticket Failure',
  props<{err: string}>(),
);
export const resetTicket = createAction('[Ticket] reset Ticket Failure');
export const currentTrashBookType = createAction(
  '[Ticket] set currentTrashBookType',
  props<{currentTrashBookType: TrashBookType | undefined}>(),
);
export const loadTicketFormsConfig = createAction('[TicketForms] Load Config');
export const loadTicketFormsConfigSuccess = createAction(
  '[TicketForms] Load Config Success',
  props<{configs: {[key: string]: TicketFormConf}}>(),
);
export const loadTicketFormsConfigFailure = createAction(
  '[TicketForms] Load Config Failure',
  props<{err: string}>(),
);
