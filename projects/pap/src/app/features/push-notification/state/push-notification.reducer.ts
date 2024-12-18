import {createReducer, on} from '@ngrx/store';
import {PushNotification} from '../push-notification.model';
import {
  getDeliveredNotificationFailure,
  getDeliveredNotificationSuccess,
  loadPushNotification,
  loadPushNotificationFailure,
  loadPushNotificationSuccess,
  removeAllDeliveredNotificationsFailure,
  removeAllDeliveredNotificationsSuccess,
} from './push-notification.actions';
import {PushNotificationSchema} from '@capacitor/push-notifications';

export const pushNotificationFeatureKey = 'push-notification';

export interface PushNotificationState {
  deliveredNotifications?: PushNotificationSchema[];
  error: string;
  firstNotificationId?: number;
  pushNotifications?: PushNotification[];
}

export const initialState: PushNotificationState = {
  error: '',
  deliveredNotifications: [],
  pushNotifications: [],
};

export const reducer = createReducer(
  initialState,
  on(loadPushNotification, state => state),
  on(loadPushNotificationSuccess, (state, {pushNotifications}) => ({
    ...state,
    pushNotifications,
    firstNotificationId: pushNotifications?.[0]?.id,
  })),
  on(loadPushNotificationFailure, (state, {error}) => ({
    ...state,
    error,
  })),
  on(getDeliveredNotificationSuccess, (state, {deliveredNotifications}) => ({
    ...state,
    deliveredNotifications: deliveredNotifications.notifications,
  })),
  on(getDeliveredNotificationFailure, (state, {error}) => ({
    ...state,
    error,
  })),
  on(removeAllDeliveredNotificationsSuccess, state => ({
    ...state,
    deliveredNotifications: [],
  })),
  on(removeAllDeliveredNotificationsFailure, (state, {error}) => ({
    ...state,
    error,
  })),
);
