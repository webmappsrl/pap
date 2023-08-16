import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserTypesService {
  constructor(private _http: HttpClient) {}

  getUserTypes(): Observable<any> {
    return this._http.get(`${env.api}/c/${env.companyId}/user_types.json`);
  }
}
