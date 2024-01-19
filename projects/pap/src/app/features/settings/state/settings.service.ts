import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {SuccessResponse} from '../../../shared/form/model';
import {Address} from '../../../core/auth/auth.model';
@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private _http: HttpClient) {}

  calendarSettings(): Observable<any> {
    return this._http.get(`${env.api}/address/index`);
  }

  createAddress(address: Address): Observable<SuccessResponse> {
    return this._http.post(`${env.api}/address/create`, address) as Observable<SuccessResponse>;
  }

  deleteAddress(id: number): Observable<SuccessResponse> {
    return this._http.get(`${env.api}/address/delete/${id}`) as Observable<SuccessResponse>;
  }

  updateAddress(address: Partial<Address>): Observable<any> {
    return this._http.post(`${env.api}/address/update`, address);
  }
}
