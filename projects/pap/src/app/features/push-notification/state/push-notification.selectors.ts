import {createFeatureSelector, createSelector} from '@ngrx/store';
import { PushNotificationState } from './push-notification.reducer';
import * as fromPushNotification from './push-notification.reducer';

export const selectPushNotificationState = createFeatureSelector<PushNotificationState>(fromPushNotification.pushNotificationFeatureKey);
export const pushNotifications = createSelector(selectPushNotificationState, state => state.pushNotifications);
