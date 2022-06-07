import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Calendar, CalendarRow} from './calendar.model';
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
      '2022-06-04': [
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
      '2022-12-31': [
        {
          trash_types: [16, 17],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-01-23': [
        {
          trash_types: [20, 17],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-02-28': [
        {
          trash_types: [16, 19],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-03-30': [
        {
          trash_types: [16, 17],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-04-13': [
        {
          trash_types: [16, 18],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-05-16': [
        {
          trash_types: [18, 17],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-07-26': [
        {
          trash_types: [20, 17],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-08-05': [
        {
          trash_types: [20],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-09-01': [
        {
          trash_types: [16, 17],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-10-28': [
        {
          trash_types: [16, 17, 18],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
      '2022-11-27': [
        {
          trash_types: [17],
          start_time: '07:00',
          stop_time: '19:00',
        },
      ],
    });
  }
}
