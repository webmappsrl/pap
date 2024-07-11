import {createAction, props} from '@ngrx/store';
import {PushNotification} from '../push-notification.model';
import {DeliveredNotifications} from '@capacitor/push-notifications';

export const loadPushNotification = createAction('[PushNotification] Load Push Notification');

export const loadPushNotificationSuccess = createAction(
  '[PushNotification] Load Push Notification Success',
  props<{pushNotifications: PushNotification[]}>(),
);

export const loadPushNotificationFailure = createAction(
  '[PushNotification] Load Push Notification Failure',
  props<{error: string}>(),
);

export const getDeliveredNotification = createAction(
  '[PushNotification] Update Delivered Notification',
);

export const getDeliveredNotificationSuccess = createAction(
  '[PushNotification] Update Delivered Notification Success',
  props<{deliveredNotifications: DeliveredNotifications}>(),
);

export const getDeliveredNotificationFailure = createAction(
  '[PushNotification] Update Delivered Notification Failure',
  props<{error: string}>(),
);

export const removeAllDeliveredNotifications = createAction(
  '[PushNotification] Remove All Delivered Notification',
);

export const removeAllDeliveredNotificationsSuccess = createAction(
  '[PushNotification] Remove All Delivered Notification Success',
);

export const removeAllDeliveredNotificationsFailure = createAction(
  '[PushNotification] Remove All Delivered Notification Failure',
  props<{error: string}>(),
);
