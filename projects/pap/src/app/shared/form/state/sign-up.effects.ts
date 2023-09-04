import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import * as SignUpActions from './sign-up.actions';
import {UserTypesService} from './sign-up.service';

@Injectable()
export class SignUpEffects {
  ySignUps$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignUpActions.loadUserTypes),
      switchMap(_ =>
        this._userTypesSvc.getUserTypes().pipe(
          map(userTypes => SignUpActions.loadUserTypesSuccess({userTypes})),
          catchError(error => {
            return of(SignUpActions.loadUserTypesFailure({error}));
          }),
        ),
      ),
    );
  });

  constructor(private actions$: Actions, private _userTypesSvc: UserTypesService) {}
}
