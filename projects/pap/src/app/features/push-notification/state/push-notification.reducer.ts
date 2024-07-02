import {createReducer, on} from '@ngrx/store';
import { PushNotification } from '../push-notification.model';
import { loadPushNotification, loadPushNotificationFailure, loadPushNotificationSuccess } from './push-notification.actions';

export const pushNotificationFeatureKey = 'push-notification';

export interface PushNotificationState {
  error: string;
  pushNotifications?: PushNotification[];
}

export const initialState: PushNotificationState = {
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(loadPushNotification, state => state),
  on(loadPushNotificationSuccess, (state, action) => ({
    ...state,
    pushNotifications: action.pushNotifications,
  })),
  on(loadPushNotificationFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),
);
