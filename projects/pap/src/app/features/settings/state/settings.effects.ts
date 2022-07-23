import * as SettingsActions from './settings.actions';

import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';

import {Injectable} from '@angular/core';

@Injectable()
export class SettingsEffects {
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

  constructor(private actions$: Actions) {}
}
