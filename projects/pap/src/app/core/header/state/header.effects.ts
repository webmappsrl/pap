import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as HeaderActions from './header.actions';
import {headerInfo} from '../header.model';
import {buttonAction} from '../../../features/home/home.model';

const headermock: headerInfo = {
  label: 'portAPPorta',
  // img: 'assets/icons/logo-e.png',
  showBack: false,
  buttonStart: {
    label: '',
    action: buttonAction.OPENMENU,
    icon: 'menu',
  },
  buttonEnd: {
    label: '',
    action: buttonAction.NAVIGATION,
    url: 'settings',
    icon: 'settings',
  },
  isMenuOpen: false,
};

@Injectable()
export class HeaderEffects {
  loadHeaders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HeaderActions.loadHeaders),
      concatMap(() =>
        of(headermock).pipe(
          map(data => HeaderActions.loadHeadersSuccess({data})),
          catchError(error => of(HeaderActions.loadHeadersFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions) {}
}
