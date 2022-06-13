import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {WasteCenterCollectionFeature} from '../waste-center-collection-model';
import {environment as env} from 'projects/pap/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WasteCenterCollectionService {
  constructor(private _http: HttpClient) {}

  getWasteCenterCollection(): Observable<WasteCenterCollectionFeature[]> {
    return this._http
      .get(`${env.api}/api/c/4/waste_collection_centers.geojson`)
      .pipe(map((data: any) => data.features)) as Observable<WasteCenterCollectionFeature[]>;
  }
}
