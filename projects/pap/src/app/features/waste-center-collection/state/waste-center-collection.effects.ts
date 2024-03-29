import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import * as WasteCenterCollectionActions from './waste-center-collection.actions';
import {WasteCenterCollectionService} from './waste-center-collection.service';

@Injectable()
export class WasteCenterCollectionEffects {
  loadWasteCenterCollections$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(WasteCenterCollectionActions.loadWasteCenterCollections),
      switchMap(_ => this._WasteCenterCollectionSvc.getWasteCenterCollection()),
      map(data => {
        return WasteCenterCollectionActions.loadWasteCenterCollectionsSuccess({data});
      }),
      catchError(error =>
        of(WasteCenterCollectionActions.loadWasteCenterCollectionsFailure({error})),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private _WasteCenterCollectionSvc: WasteCenterCollectionService,
  ) {}
}
