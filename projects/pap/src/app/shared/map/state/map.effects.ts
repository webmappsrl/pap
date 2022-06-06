import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, of, switchMap} from 'rxjs';
import {LocationService} from '../../services/location.service';
import * as MapActions from './map.actions';

@Injectable()
export class MapEffects {
  setMarker$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MapActions.setMarker),
      switchMap(action =>
        this._locationService.getAddress(action.coords).pipe(
          map(address => MapActions.setCurrentMarkerSuccess({address})),
          catchError(error => {
            return of(MapActions.setCurrentMarkerFailure({error}));
          }),
        ),
      ),
    );
  });
  constructor(private actions$: Actions, private _locationService: LocationService) {}
}
