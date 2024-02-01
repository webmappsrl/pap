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
          return this._getAddressAndCityFromNominatim(response.display_name, rawAddress);
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
    displayName: string,
    address: {[key: string]: string},
    keysToRemove: string[] = ['postcode', 'state', 'country', 'house_number'],
    addressKeys: string[] = ['road', 'isolated_dwelling', 'amenity', 'suburb'],
  ): {address: string; city: string} {
    // Verifica la validità di displayName e address
    if (
      !displayName ||
      typeof displayName !== 'string' ||
      !address ||
      typeof address !== 'object'
    ) {
      return {address: '', city: ''};
    }

    let addressComponents: string[] = [];
    let cityComponents: string[] = [];
    let displayNameParts = displayName.split(', ').filter(part => part.trim() !== '');

    displayNameParts.forEach(part => {
      let foundInAddressKeys = false;
      for (const key of addressKeys) {
        if (address[key] === part) {
          addressComponents.push(part);
          foundInAddressKeys = true;
          break;
        }
      }
      if (!foundInAddressKeys && !keysToRemove.some(key => address[key] === part)) {
        cityComponents.push(part);
      }
    });

    return {
      address: addressComponents.reverse().join(', '),
      city: cityComponents.reverse().join(', '),
    };
  }
}
