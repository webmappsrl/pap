import {GeoJsonFeatureCollection} from './../form/location/location.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private _http: HttpClient) {}

  getAddress(coordinates: number[]): Observable<string> {
    return this._http
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${coordinates[1]}&lon=${coordinates[0]}&format=json`,
      )
      .pipe(
        map((response: any) => {
          const address = response.display_name ?? '';
          return address as string;
        }),
      );
  }

  getConfiniZone(): Observable<GeoJsonFeatureCollection> {
    return this._http.get(
      `${env.api}/c/${env.companyId}/zones.geojson`,
    ) as Observable<GeoJsonFeatureCollection>;
  }
}
