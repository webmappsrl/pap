import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap} from 'rxjs/operators';
import {of} from 'rxjs';

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
            action: 'navigation',
          },
          {
            label: 'calendario',
            icon: 'calendar',
            url: 'calendar',
            action: 'navigation',
          },
          {
            label: 'centri raccolta',
            icon: 'map',
            url: 'map',
            action: 'navigation',
          },
          {
            label: 'prenota servizio',
            icon: 'checkmark',
            url: 'book',
            action: 'navigation',
          },
          {
            label: 'segnala abbandono',
            icon: 'chatbubbles',
            url: 'abandonment',
            action: 'navigation',
          },
          {
            label: 'attiva segnalazione',
            icon: 'create',
            url: 'disruption',
            action: 'navigation',
          },
          {
            label: 'rifiutario',
            icon: 'clipboard',
            url: 'trashbook',
            action: 'navigation',
          },
          {
            label: 'le mie segnalazioni',
            icon: 'list',
            url: 'reports',
            action: 'navigation',
          },
          {
            label: 'info',
            icon: 'information',
            url: 'info',
            action: 'navigation',
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
