import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Calendar, CalendarRow} from './calendar.model';
import {TrashBookType} from '../trash-book/trash-book-model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private _http: HttpClient) {}

  getCalendar(): Observable<Calendar> {
    return (this._http.get(`${env.api}/api/c/4/calendar`) as Observable<any>).pipe(
      map(r => r.data as Calendar),
    );
  }
}
