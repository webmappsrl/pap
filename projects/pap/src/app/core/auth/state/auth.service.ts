import {switchMap, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env, environment} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {
  LoginCredentials,
  LogoutResponse,
  RegisterData,
  ResendEmailResponse,
  User,
} from '../auth.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient) {}

  delete(): Observable<User> {
    return this._http.get(`${env.api}/delete`) as Observable<User>;
  }

  getAlert(error: string): void {
    window.alert(JSON.stringify(error));
  }

  getUser(): Observable<User> {
    return this._http.get(`${env.api}/user`) as Observable<User>;
  }

  login(credential: LoginCredentials): Observable<User> {
    return this._http.post(
      `${env.api}/login`,
      {
        email: credential.email,
        password: credential.password,
        app_company_id: environment.companyId,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    ) as Observable<User>;
  }

  logout(): Observable<LogoutResponse> {
    return this.update({fcm_token: ''}).pipe(
      tap(() => localStorage.removeItem('access_token')),
      switchMap(() => this.getUser()),
    ) as Observable<LogoutResponse>;
  }

  register(data: RegisterData): Observable<User> {
    return this._http.post(
      `${env.api}/register`,
      {
        ...data,
        app_company_id: env.companyId,
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    ) as Observable<User>;
  }

  resendEmail(): Observable<ResendEmailResponse> {
    return this._http.get(`${env.api}/email/resend`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }) as Observable<ResendEmailResponse>;
  }

  update(updates: Partial<User>): Observable<User> {
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
    ) as Observable<User>;
  }
}
