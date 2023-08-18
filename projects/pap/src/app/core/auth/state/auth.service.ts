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
    return this._http.get(`${env.api}/delete`);
  }

  getAlert(error: any): void {
    window.alert(JSON.stringify(error));
  }

  getUser(): Observable<any> {
    return this._http.get(`${env.api}/user`);
  }

  login(credential: any) {
    console.log('login ', env.api);
    return this._http.post(
      `${env.api}/login`,
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
      `${env.api}/register`,
      {
        ...credential,
        app_company_id: env.companyId,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  resendEmail() {
    return this._http.get(`${env.api}/email/resend`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  update(updates: any) {
    return this._http.post(
      `${env.api}/user`,
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
