import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store, select} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, filter, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {isLogged} from '../../../core/auth/state/auth.selectors';
import {AppState} from '../../../core/core.state';
import { PushNotificationService } from '../push-notification.service';
import { loadPushNotification, loadPushNotificationFailure, loadPushNotificationSuccess } from './push-notification.actions';

@Injectable()
export class PushNotificationEffects {
  loadPushNotification$ = createEffect(() => this.actions$.pipe(
    ofType(loadPushNotification),
    withLatestFrom(this._store.pipe(select(isLogged))),
    filter(([action, logged]) => logged),
    mergeMap(() => this.pushNotificationService.getPushNotification().pipe(
      map(pushNotifications => loadPushNotificationSuccess({ pushNotifications })),
      catchError(error => of(loadPushNotificationFailure({ error: error.message })))
    ))
  ));

  constructor(
    private actions$: Actions,
    private pushNotificationService: PushNotificationService,
    private _store: Store<AppState>,
  ) {}
}
