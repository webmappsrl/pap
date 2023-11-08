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

  getAddress(coordinates: number[]): Observable<any> {
    return this._http
      .get(
        `https://nominatim.openstreetmap.org/reverse?lat=${coordinates[1]}&lon=${coordinates[0]}&format=jsonv2&addressdetails=1`,
      )
      .pipe(
        map((response: any) => {
          const rawAddress = response.address ?? {};
          let address = '';
          let city = '';
          if (rawAddress.road != null) {
            address = rawAddress.road;
          } else if (rawAddress.isolated_dwelling != null) {
            address = rawAddress.isolated_dwelling;
          } else if (rawAddress.isolated_dwelling != null) {
            address = rawAddress.isolated_dwelling;
          }
          if (rawAddress.city != null) {
            city = rawAddress.city;
          } else if (rawAddress.town != null) {
            city = rawAddress.town;
          } else if (rawAddress.province != null) {
            city = rawAddress.province;
          } else if (rawAddress.village != null) {
            city = rawAddress.village;
          }
          return {
            address,
            city,
          };
        }),
      );
  }

  getConfiniZone(): Observable<GeoJsonFeatureCollection> {
    return this._http.get(
      `${env.api}/c/${env.companyId}/zones.geojson`,
    ) as Observable<GeoJsonFeatureCollection>;
  }
}
