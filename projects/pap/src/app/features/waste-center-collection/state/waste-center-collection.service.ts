import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {WasteCenterCollectionFeature} from '../waste-center-collection-model';

@Injectable({
  providedIn: 'root',
})
export class WasteCenterCollectionService {
  constructor(private _http: HttpClient) {}

  getWasteCenterCollection(): Observable<WasteCenterCollectionFeature[]> {
    return this._http
      .get('http://portapporta.webmapp.it/api/c/4/waste_collection_centers.geojson')
      .pipe(map((data: any) => data.features)) as Observable<WasteCenterCollectionFeature[]>;
  }
}
