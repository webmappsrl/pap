import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as SettingsActions from './settings.actions';

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
