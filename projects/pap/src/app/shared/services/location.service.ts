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
          return this._getAddressAndCityFromNominatim(rawAddress);
        }),
      );
  }

  getConfiniZone(): Observable<GeoJsonFeatureCollection> {
    return this._http.get(
      `${env.api}/c/${env.companyId}/zones.geojson`,
    ) as Observable<GeoJsonFeatureCollection>;
  }

  getCoordinates(address: string): Observable<any> {
    return this._http.get(
      `https://nominatim.openstreetmap.org/search?q=${address}&format=json&polygon=1&addressdetails=1`,
    );
  }

  private _getAddressAndCityFromNominatim(
    address: {[key: string]: string},
  ): {address: string; city: string; house_number: string} {
    return {
      address: address['road'] ?? '',
      house_number: address['house_number'] ?? '',
      city: '',
    };
  }
}
