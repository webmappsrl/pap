import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {forkJoin, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
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
      map(([trashBookRows, trashBookTypes]) => {
        trashBookRows = trashBookRows.map(waste => {
          waste.trashBookType = trashBookTypes.find(tt => tt.id === waste.trash_type_id);
          waste.hide = false;
          return waste;
        });
        const data = {trashBookRows, trashBookTypes};
        return TrashBookActions.loadTrashBooksSuccess({data});
      }),
      catchError(error => of(TrashBookActions.loadTrashBooksFailure({error}))),
    );
  });

  constructor(private actions$: Actions, private _trashBookSvc: TrashBookService) {}
}
