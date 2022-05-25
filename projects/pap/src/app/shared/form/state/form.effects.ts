import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as FormActions from './form.actions';



@Injectable()
export class FormEffects {

  loadForms$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(FormActions.loadForms),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => FormActions.loadFormsSuccess({ data })),
          catchError(error => of(FormActions.loadFormsFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
