import {HttpClient, HttpHeaders} from '@angular/common/http';
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

  login(credential: any) {
    console.log('login ', env.api);
    return this._http.post(
      `${env.api}/api/login`,
      {
        email: credential.email,
        password: credential.password,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  register(credential: any) {
    return this._http.post(
      `${env.api}/api/register`,
      {
        ...credential,
        company_id: 8,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }
}
