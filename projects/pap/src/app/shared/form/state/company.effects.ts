import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  loadCompaniesData,
  loadCompaniesDataFailure,
  loadCompaniesDataSuccess,
} from './company.actions';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {CompanyService} from './company.service';

@Injectable()
export class CompanyEffects {
  loadCompaniesData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCompaniesData),
      mergeMap(() =>
        this._companySvc.getCompaniesData().pipe(
          map(({formJson, properties}) => loadCompaniesDataSuccess({formJson, properties})),
          catchError(error => of(loadCompaniesDataFailure({error: error.message}))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private _companySvc: CompanyService,
  ) {}
}
