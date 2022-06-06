import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Calendar, CalendarRow} from './calendar.model';
import {DatePipe} from '@angular/common';
import {TrashBookType} from '../trash-book/trash-book-model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(private _http: HttpClient) {}

  getCalendar(): Observable<Calendar> {
    // return this._http.get(`${env.api}/api/c/4/calendar.json`) as Observable<Calendar>;
    return of({
      '2022-06-03': [
        {
          trash_types: [16, 17],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-07-03': [
        {
          trash_types: [18, 17],
          start_time: '07:00',
          stop_time: '19:00',
        },
        {
          trash_types: [16, 19],
          start_time: '08:00',
          stop_time: '20:00',
        },
      ],
    });
  }

  getTrashTypes(): Observable<TrashBookType[]> {
    return this._http.get(`${env.api}/api/c/4/trash_types.json`) as Observable<TrashBookType[]>;
  }
}
