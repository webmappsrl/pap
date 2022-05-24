import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  getUser(): Observable<any> {
    return this._http.get(`${env.api}/api/user`);
  }

  getAlert(error: any): void {
    window.alert(JSON.stringify(error));
  }
}
