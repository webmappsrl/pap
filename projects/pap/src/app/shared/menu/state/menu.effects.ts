import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import {buttonAction} from '../../../features/home/home.model';
import {menuButton} from '../menu.model';
import * as HeaderActions from './menu.actions';

const headermock: menuButton = {
  // label: 'portAPPorta',
  img: 'assets/images/header-logo.svg',
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
  loadMenu$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HeaderActions.loadMenu),
      concatMap(() =>
        of(headermock).pipe(
          map(data => HeaderActions.loadMenuSuccess({data})),
          catchError(error => of(HeaderActions.loadMenuFailure({error}))),
        ),
      ),
    );
  });
  showButtons$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HeaderActions.showButtons),
      concatMap(action =>
        of(headermock).pipe(
          map(data => {
            let dataclone = {...data};
            if (!action.show) {
              dataclone.showBack = true;
              delete dataclone.buttonEnd;
              delete dataclone.buttonStart;
            }
            return HeaderActions.loadMenuSuccess({data: dataclone});
          }),
          catchError(error => of(HeaderActions.loadMenuFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions) {}
}
