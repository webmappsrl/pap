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
            icon: 'md-calendar',
            url: 'calendar',
          },
          {
            label: 'map',
            icon: 'map',
            url: 'map',
          },
          {
            label: 'disruption',
            icon: 'md-create',
            url: 'disruption',
          },
          {
            label: 'abandonment',
            icon: 'md-chatbubbles',
            url: 'abandonment',
          },
          {
            label: 'book',
            icon: 'md-checkmark',
            url: 'book',
          },
          {
            label: 'trashbook',
            icon: 'md-clipboard',
            url: 'trashbook',
          },
          {
            label: 'reports',
            icon: 'md-list',
            url: 'reports',
          },
          {
            label: 'info',
            icon: 'md-information',
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
