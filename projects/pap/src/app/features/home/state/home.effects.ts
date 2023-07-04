import * as HomeActions from './home.actions';

import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map} from 'rxjs/operators';

import {Injectable} from '@angular/core';
import {buttonAction} from '../home.model';
import {of} from 'rxjs';

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
            label: 'Calendario',
            icon: 'calendar',
            url: 'calendar',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Centri raccolta',
            icon: 'map',
            url: 'waste-center-collection',
            action: buttonAction.NAVIGATION,
            hideInMenu: true,
          },
          {
            label: 'Prenota servizio',
            icon: 'call',
            url: 'ticket-reservation',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Segnala abbandono',
            icon: 'chatbubbles',
            url: 'abandonment-ticket',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'segnala mancato ritiro',
            icon: 'create',
            url: 'report-ticket',
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
            label: 'Richiedi Informazioni',
            icon: 'information',
            url: 'info-ticket',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Impostazioni',
            url: 'settings',
            action: buttonAction.NAVIGATION,
            hideInHome: true,
          },
          {
            label: 'ESA',
            img: 'assets/icons/logo-e.png',
            url: 'info',
            action: buttonAction.NAVIGATION,
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
