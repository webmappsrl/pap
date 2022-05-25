import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {Observable, EMPTY, of, forkJoin} from 'rxjs';

import * as TrashBookActions from './trash-book.actions';
import {TrashBookService} from './trash-book.service';

@Injectable()
export class TrashBookEffects {
  loadTrashBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrashBookActions.loadTrashBooks),
      switchMap(_ =>
        forkJoin([this._trashBookSvc.getTrashBook(), this._trashBookSvc.getTrashTypes()]),
      ),
      map(([data, trashTypes]) => {
        data = data.map(waste => {
          waste.trashBookType = trashTypes.find(tt => tt.id === waste.trash_type_id);
          waste.hide = false;
          return waste;
        });
        return TrashBookActions.loadTrashBooksSuccess({data});
      }),
      catchError(error => of(TrashBookActions.loadTrashBooksFailure({error}))),
    );
  });

  constructor(private actions$: Actions, private _trashBookSvc: TrashBookService) {}
}
