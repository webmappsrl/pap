import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment as env} from 'projects/pap/src/environments/environment';
const MAP = {
  bounds: {
    southWest: {
      lat: 41.99962549506941,
      lng: 9.786415100097656,
    },
    northEast: {
      lat: 43.65396273281939,
      lng: 10.711669921874998,
    },
  },
};

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private _http: HttpClient) {}

  isInsideMap(latLng: number[]) {
    console.log('------- ~ LocationService ~ isInsideMap ~ latLng', latLng, MAP.bounds);
    return (
      latLng[0] >= MAP.bounds.southWest.lat &&
      latLng[0] <= MAP.bounds.northEast.lat &&
      latLng[1] >= MAP.bounds.southWest.lng &&
      latLng[1] <= MAP.bounds.northEast.lng
    );
  }

  getAddress(coordinates: number[]) {
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

  getConfiniZone(): Observable<any> {
    return this._http.get(`${env.api}/api/c/4/zones.geojson`);
  }
}
