import {createReducer, on} from '@ngrx/store';
import {TrashBookType} from '../../../features/trash-book/trash-book-model';
import * as TicketActions from './form.actions';

export const ticketFeatureKey = 'ticket';

export interface TicketState {
  loading: boolean;
  error?: string;
  success?: boolean;
  currentTrashBookType?: TrashBookType;
}

export const initialState: TicketState = {
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(TicketActions.sendTicket, state => ({
    ...state,
    loading: true,
  })),
  on(TicketActions.sendTicketSuccess, (state, action) => ({
    ...state,
    success: true,
    loading: false,
  })),
  on(TicketActions.sendTicketFailure, (state, action) => {
    return {
      ...state,
      error: action.err,
      loading: false,
    };
  }),
  on(TicketActions.resetTicket, (state, action) => {
    return {
      ...state,
      error: undefined,
      currentTrashBookType: undefined,
      success: false,
      loading: false,
    };
  }),
  on(TicketActions.currentTrashBookType, (state, action) => {
    return {
      ...state,
      currentTrashBookType: action.currentTrashBookType,
    };
  }),
);
