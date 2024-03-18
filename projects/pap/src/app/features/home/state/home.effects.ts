import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, concatMap, delay, filter, map, startWith, withLatestFrom} from 'rxjs/operators';
import {buttonAction, homeButtons} from '../home.model';
import * as HomeActions from './home.actions';
import {AppState} from '../../../core/core.state';
import {Store, select} from '@ngrx/store';
import {isVip, userRoles} from '../../../core/auth/state/auth.selectors';

@Injectable()
export class HomeEffects {
  userRoles$ = this._store.pipe(select(userRoles));
  yHomes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.yHomes),
      concatMap(() =>
        of(homeButtons).pipe(
          withLatestFrom(this.userRoles$),
          map(([buttons, userRoles]) => {
            buttons = buttons.filter(b =>
              b.roles ? b.roles?.some(role => userRoles.includes(role)) : true,
            );
            return HomeActions.yHomesSuccess({buttons});
          }),
          catchError(error => of(HomeActions.yHomesFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions, private _store: Store<AppState>) {}
}
