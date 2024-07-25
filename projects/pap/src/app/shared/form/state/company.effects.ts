import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {loadFormJson, loadFormJsonFailure, loadFormJsonSuccess} from './company.actions';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {CompanyService} from './company.service';

@Injectable()
export class CompanyEffects {
  loadFormJson$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFormJson),
      mergeMap(() =>
        this._companySvc.getFormJson().pipe(
          map(formJson => loadFormJsonSuccess({formJson})),
          catchError(error => of(loadFormJsonFailure({error: error.message}))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private _companySvc: CompanyService,
  ) {}
}
