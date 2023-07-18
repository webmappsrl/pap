import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {WasteCenterCollectionFeature} from '../waste-center-collection-model';

@Injectable({
  providedIn: 'root',
})
export class WasteCenterCollectionService {
  constructor(private _http: HttpClient) {}

  getWasteCenterCollection(): Observable<WasteCenterCollectionFeature[]> {
    return this._http
      .get(`${env.api}/api/c/${env.companyId}/waste_collection_centers.geojson`)
      .pipe(map((data: any) => data.features)) as Observable<WasteCenterCollectionFeature[]>;
  }
}
