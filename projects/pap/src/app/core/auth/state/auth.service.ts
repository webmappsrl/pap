import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment as env} from 'projects/pap/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  delete() {
    return this._http.get(`${env.api}/api/delete`);
  }

  getAlert(error: any): void {
    window.alert(JSON.stringify(error));
  }

  getUser(): Observable<any> {
    return this._http.get(`${env.api}/api/user`);
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

  logout(): Observable<any> {
    localStorage.removeItem('access_token');
    return this.getUser();
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

  resendEmail() {
    return this._http.get(`${env.api}/api/email/resend`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  update(updates: any) {
    return this._http.post(
      `${env.api}/api/user`,
      {
        ...updates,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }
}
