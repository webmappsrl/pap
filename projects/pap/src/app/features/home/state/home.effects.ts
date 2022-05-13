import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as HomeActions from './home.actions';



@Injectable()
export class HomeEffects {

  yHomes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.yHomes),
      concatMap(() =>
        of([
          {
            label: 'company',
            img: 'assets/icons/logo-e.png',
            url: 'company',
            action: 'navigation'
          },
          {
            label: 'calendar',
            icon: 'calendar',
            url: 'calendar',
            action: 'navigation'
          },
          {
            label: 'map',
            icon: 'map',
            url: 'map',
            action: 'navigation'
          },
          {
            label: 'book',
            icon: 'checkmark',
            url: 'book',
            action: 'navigation'
          },
          {
            label: 'abandonment',
            icon: 'chatbubbles',
            url: 'abandonment',
            action: 'navigation'
          },
          {
            label: 'disruption',
            icon: 'create',
            url: 'disruption',
            action: 'navigation'
          },
          {
            label: 'trashbook',
            icon: 'clipboard',
            url: 'trashbook',
            action: 'navigation'
          },
          {
            label: 'reports',
            icon: 'list',
            url: 'reports',
            action: 'navigation'
          },
          {
            label: 'info',
            icon: 'information',
            url: 'info',
            action: 'navigation'
          },
        ]).pipe(
          map(buttons => HomeActions.yHomesSuccess({ buttons })),
          catchError(error => of(HomeActions.yHomesFailure({ error }))),
        ),
      ),
    );
  });



  constructor(private actions$: Actions) { }

}
