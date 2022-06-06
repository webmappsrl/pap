import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs';
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
  constructor(private http: HttpClient) {}

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
    return this.http
      .get(
        //  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates[0]},${coordinates[1]}&key=${env.GOOOGLEAPIKEY}`,
        `https://nominatim.openstreetmap.org/reverse?lat=${coordinates[0]}&lon=${coordinates[1]}&format=json`,
      )
      .pipe(
        map((response: any) => {
          const address = response.display_name ?? '';
          return address as string;
        }),
      );
  }
}
