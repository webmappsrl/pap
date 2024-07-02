import {createAction, props} from '@ngrx/store';
import { PushNotification } from '../push-notification.model';

export const loadPushNotification = createAction(
  '[PushNotification] Load Push Notification'
);

export const loadPushNotificationSuccess = createAction(
  '[PushNotification] Load Push Notification Success',
  props<{pushNotifications: PushNotification[]}>(),
);

export const loadPushNotificationFailure = createAction(
  '[PushNotification] Load Push Notification Failure',
  props<{error: string}>(),
);
