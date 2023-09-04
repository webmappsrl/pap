import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import * as LayoutActions from './layout.actions';
import {LayoutService} from './layout.service';

@Injectable()
export class LayoutEffects {
  yLayouts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LayoutActions.yLayouts),
      concatMap(() =>
        this._mainLayoutSvc.getScss().pipe(
          map(scss => LayoutActions.yLayoutsSuccess({scss})),
          catchError(error => of(LayoutActions.yLayoutsFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions, private _mainLayoutSvc: LayoutService) {}
}
