import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {LocationService} from '../../services/location.service';
import * as MapActions from './map.actions';

@Injectable()
export class MapEffects {
  loadConfiniZone$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.loadConfiniZone),
      switchMap(_ =>
        this._locationSvc.getConfiniZone().pipe(
          map(data => MapActions.loadConfiniZoneSuccess({data})),
          catchError(error => {
            return of(MapActions.loadConfiniZoneFailure({error}));
          }),
        ),
      ),
    );
  });
  setMarker$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.setMarker),
      switchMap(action =>
        this._locationSvc.getAddress(action.coords).pipe(
          map(address => MapActions.setCurrentMarkerSuccess({address})),
          catchError(error => {
            return of(MapActions.setCurrentMarkerFailure({error}));
          }),
        ),
      ),
    );
  });

  constructor(private actions$: Actions, private _locationSvc: LocationService) {}
}
