import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import {buttonAction} from '../../../features/home/home.model';
import {footerInfo} from '../footer.model';
import * as FooterActions from './footer.actions';

const footermock: footerInfo = {
  // label: 'portAPPorta',
  img: 'assets/images/footer.png',
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
export class FooterEffects {
  loadFooters$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FooterActions.loadFooters),
      concatMap(() =>
        of(footermock).pipe(
          map(data => FooterActions.loadFootersSuccess({data})),
          catchError(error => of(FooterActions.loadFootersFailure({error}))),
        ),
      ),
    );
  });
  showButtons$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(FooterActions.showButtons),
      concatMap(action =>
        of(footermock).pipe(
          map(data => {
            let dataclone = {...data};
            if (!action.show) {
              dataclone.showBack = true;
              delete dataclone.buttonEnd;
              delete dataclone.buttonStart;
            }
            return FooterActions.loadFootersSuccess({data: dataclone});
          }),
          catchError(error => of(FooterActions.loadFootersFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions) {}
}
