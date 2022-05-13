import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  constructor(private _http: HttpClient) {}

  getScss(): Observable<string> {
    return this._http.get(
      'http://apiesa.netseven.it/resources/variables.scss',
    ) as Observable<string>;
  }
}
