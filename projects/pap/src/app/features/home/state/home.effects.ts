import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap} from 'rxjs/operators';
import {of} from 'rxjs';

import * as HomeActions from './home.actions';
import {buttonAction} from '../home.model';

@Injectable()
export class HomeEffects {
  yHomes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.yHomes),
      concatMap(() =>
        of([
          {
            label: 'Centro notifiche',
            url: 'notification',
            action: buttonAction.NAVIGATION,
            hideInHome: true,
          },
          {
            label: 'Company',
            img: 'assets/icons/logo-e.png',
            url: 'info',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Calendario',
            icon: 'calendar',
            url: 'calendar',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Centri raccolta',
            icon: 'map',
            url: 'map',
            action: buttonAction.NAVIGATION,
            hideInMenu: true,
          },
          {
            label: 'Prenota servizio',
            icon: 'checkmark',
            url: 'book',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Segnala abbandono',
            icon: 'chatbubbles',
            url: 'abandonment',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Attiva segnalazione',
            icon: 'create',
            url: 'disruption',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Rifiutario',
            icon: 'clipboard',
            url: 'trashbook',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Le mie segnalazioni',
            icon: 'list',
            url: 'reports',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Info',
            icon: 'information',
            url: 'info',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Impostazioni',
            url: 'settings',
            action: buttonAction.NAVIGATION,
            hideInHome: true,
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
