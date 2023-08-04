import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {Address} from '../settings.model';
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private _http: HttpClient) {}

  calendarSettings(): Observable<any> {
    return this._http.get(`${env.api}/address/index`);
  }

  createAddress(address: Address): Observable<any> {
    return this._http.post(`${env.api}/address/create`, address);
  }

  deleteAddress(id: number): Observable<any> {
    return this._http.get(`${env.api}/address/delete/${id}`);
  }
}
