import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadFormJson, loadFormJsonFailure, loadFormJsonSuccess } from "./form-fields.actions";
import { catchError, map, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { FormJsonService } from "./form-fields.service";

@Injectable()
export class FormJsonEffects {
  loadFormJson$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadFormJson),
      mergeMap(() =>
        this._formJsonSvc.getFormJson().pipe(
          map(formJson => loadFormJsonSuccess({formJson})),
          catchError(error => of(loadFormJsonFailure({error: error.message}))),
        )
      )
    );
  });

  constructor(private actions$: Actions, private _formJsonSvc: FormJsonService) {}
}
