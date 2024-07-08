import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store, select} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, filter, map, mergeMap, withLatestFrom} from 'rxjs/operators';
import {isLogged} from '../../../core/auth/state/auth.selectors';
import {AppState} from '../../../core/core.state';
import { PushNotificationService } from '../push-notification.service';
import { getDeliveredNotification, getDeliveredNotificationFailure, getDeliveredNotificationSuccess, loadPushNotification, loadPushNotificationFailure, loadPushNotificationSuccess, removeAllDeliveredNotifications, removeAllDeliveredNotificationsFailure, removeAllDeliveredNotificationsSuccess } from './push-notification.actions';
import { BroadcastNotificationService } from '../../../shared/services/broadcast-notification.service';

@Injectable()
export class PushNotificationEffects {
  getDeliveredNotification$ = createEffect(() => this._actions$.pipe(
    ofType(getDeliveredNotification),
    withLatestFrom(this._store.pipe(select(isLogged))),
    filter(([action, logged]) => logged),
    mergeMap(() => this._broadcastNotificationSvc.getDeliveredNotifications().pipe(
      map(deliveredNotifications => getDeliveredNotificationSuccess({ deliveredNotifications })),
      catchError(error => of(getDeliveredNotificationFailure({ error: error.message })))
    ))
  ));
  loadPushNotification$ = createEffect(() => this._actions$.pipe(
    ofType(loadPushNotification),
    withLatestFrom(this._store.pipe(select(isLogged))),
    filter(([action, logged]) => logged),
    mergeMap(() => this._pushNotificationSvc.getPushNotification().pipe(
      map(pushNotifications => loadPushNotificationSuccess({ pushNotifications })),
      catchError(error => of(loadPushNotificationFailure({ error: error.message })))
    ))
  ));
  removeAllDeliveredNotification$ = createEffect(() => this._actions$.pipe(
    ofType(removeAllDeliveredNotifications),
    withLatestFrom(this._store.pipe(select(isLogged))),
    filter(([action, logged]) => logged),
    mergeMap(() => this._broadcastNotificationSvc.removeAllDeliveredNotifications().pipe(
      map(() => removeAllDeliveredNotificationsSuccess()),
      catchError(error => of(removeAllDeliveredNotificationsFailure({ error: error.message })))
    ))
  ));

  constructor(
    private _actions$: Actions,
    private _pushNotificationSvc: PushNotificationService,
    private _broadcastNotificationSvc: BroadcastNotificationService,
    private _store: Store<AppState>,
  ) {}
}
