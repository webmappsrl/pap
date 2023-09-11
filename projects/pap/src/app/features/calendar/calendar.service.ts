import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Calendar} from './calendar.model';
import {SuccessData} from '../../shared/form/model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private _http: HttpClient) {}

  getCalendars(prop?: {start_date: string; stop_date: string}): Observable<Calendar[]> {
    return (
      this._http.get(`${env.api}/c/${env.companyId}/calendar`, {params: prop}) as Observable<
        SuccessData<Calendar[]>
      >
    ).pipe(map(r => r.data));
  }
}
