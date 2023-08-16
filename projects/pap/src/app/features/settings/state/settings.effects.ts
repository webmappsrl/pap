import * as SettingsActions from './settings.actions';

import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, concatMap, map, switchMap} from 'rxjs/operators';

import {Injectable} from '@angular/core';
import {SettingsService} from './settings.service';

@Injectable()
export class SettingsEffects {
  loadCalendarSettings$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.loadCalendarSettings),
      switchMap(_ => this._settingsSvc.calendarSettings()),
      map(res => SettingsActions.loadCalendarSettingsSuccess(res)),
      catchError(err => of(SettingsActions.loadCalendarSettingsFailure(err))),
    );
  });
  loadSettingss$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SettingsActions.loadSettingss),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => SettingsActions.loadSettingssSuccess({data})),
          catchError(error => of(SettingsActions.loadSettingssFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions, private _settingsSvc: SettingsService) {}
}
