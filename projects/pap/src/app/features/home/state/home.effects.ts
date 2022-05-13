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
          },
          {
            label: 'calendar',
            icon: 'calendar',
            url: 'calendar',
          },
          {
            label: 'map',
            icon: 'map',
            url: 'map',
          },
          {
            label: 'disruption',
            icon: 'create',
            url: 'disruption',
          },
          {
            label: 'abandonment',
            icon: 'chatbubbles',
            url: 'abandonment',
          },
          {
            label: 'book',
            icon: 'checkmark',
            url: 'book',
          },
          {
            label: 'trashbook',
            icon: 'clipboard',
            url: 'trashbook',
          },
          {
            label: 'reports',
            icon: 'list',
            url: 'reports',
          },
          {
            label: 'info',
            icon: 'information',
            url: 'info',
          },
        ]).pipe(
          map(buttons => HomeActions.yHomesSuccess({buttons})),
          catchError(error => of(HomeActions.yHomesFailure({error}))),
        ),
      ),
    );
  });



  constructor(private actions$: Actions) {}

}
