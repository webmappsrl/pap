import * as HomeActions from './home.actions';

import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, concatMap, map} from 'rxjs/operators';

import {Injectable} from '@angular/core';
import {buttonAction} from '../home.model';
import {of} from 'rxjs';
import {environment} from 'projects/pap/src/environments/environment';

@Injectable()
export class HomeEffects {
  yHomes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.yHomes),
      concatMap(() =>
        of([
          {
            label: environment.config.name,
            img: 'assets/icons/logo.png',
            url: 'info',
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
            label: 'Servizi',
            svg: 'assets/icons/logo-call.svg',
            url: 'ticket-reservation',
            action: buttonAction.ACTION,
            buttons: [
              {
                text: 'Prenota un servizio',
                icon: 'create',
                data: {
                  action: 'ticket-reservation',
                },
              },
              {
                text: 'Segnala abbandono',
                icon: 'trash-bin',
                data: {
                  action: 'abandonment-ticket',
                },
              },
              {
                text: 'Segnala mancato ritiro',
                icon: 'alert-circle',
                data: {
                  action: 'report-ticket',
                },
              },
              {
                text: 'Richiedi Informazioni',
                icon: 'information-circle',
                data: {
                  action: 'info-ticket',
                },
              },
              {
                text: 'CHIUDI',
                role: 'cancel',
              },
            ],
          },
          {
            label: 'Calendari',
            icon: 'calendar',
            url: 'calendar',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'I miei ticket',
            icon: 'archive',
            url: 'reports',
            action: buttonAction.NAVIGATION,
          },
          {
            label: 'Centro notifiche',
            url: 'notification',
            action: buttonAction.NAVIGATION,
            hideInHome: true,
          },
          {
            label: 'Rifiutario',
            icon: 'document-text',
            url: 'trashbook',
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
