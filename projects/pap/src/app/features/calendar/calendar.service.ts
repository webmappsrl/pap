import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Calendar} from './calendar.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private _http: HttpClient) {}

  getCalendar(): Observable<Calendar> {
    return (this._http.get(`${env.api}/c/${env.companyId}/calendar`) as Observable<any>).pipe(
      map(r => r.data as Calendar),
    );
  }
}
