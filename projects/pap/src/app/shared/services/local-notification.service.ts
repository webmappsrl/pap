import {Injectable} from '@angular/core';
import {App} from '@capacitor/app';
import {
  LocalNotificationSchema,
  LocalNotifications,
  PendingResult,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import {Store, select} from '@ngrx/store';
import {differenceInHours, subHours} from 'date-fns';
import {filter, map, take} from 'rxjs/operators';
import {isLogged} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {CalendarRow} from '../../features/calendar/calendar.model';
import {selectCalendarState} from '../../features/calendar/state/calendar.selectors';
import {CalendarState} from '../../features/calendar/state/calendar.reducer';
@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {
  calendarView$ = this._store.pipe(select(selectCalendarState));
  isLogged$ = this._store.pipe(select(isLogged));

  constructor(private _store: Store<AppState>) {}

  async scheduleNotifications(): Promise<void> {
    await this._initNotifications();
    await this._removeNotifications();
    setTimeout(async () => {
      this.calendarView$
        .pipe(
          filter(p => p != null && p.calendars != null && p.calendars.length > 0),
          map((calendarState: CalendarState) => calendarState!.calendars![0]), // applichiamo le notifiche solo al primo calendario;
          take(1),
        )
        .subscribe(async calendar => {
          const calendarDates = Object.keys(calendar.calendar);
          const notifications: LocalNotificationSchema[] = [];
          calendarDates.forEach(calendarDate => {
            const calendarRows: CalendarRow[] = calendar.calendar![calendarDate];
            calendarRows.forEach(calendarRow => {
              const startDate = new Date(calendarDate);
              const startHour = +calendarRow.start_time.split(':')[0];
              const startMinute = +calendarRow.start_time.split(':')[1];
              startDate.setHours(startHour, startMinute);
              let at = subHours(startDate, 12);
              if (+startHour >= 12) {
                at = subHours(startDate, 7);
              }
              if (differenceInHours(at, new Date()) > 0) {
                const body = this._getBodyNotificationFromCalendarRows(calendarRow);
                notifications.push({
                  id: +`${at.getTime()}`.toString().slice(0, 8),
                  title: 'Raccolta differenziata',
                  body,
                  largeBody: body,
                  schedule: {
                    at,
                    allowWhileIdle: true,
                  },
                });
              }
            });
          });
          let options: ScheduleOptions = {
            notifications,
          };
          try {
            await LocalNotifications.schedule(options);
            // console.info(options.notifications.map(n => ({at: n.schedule, text: n.body})));
          } catch (e) {
            console.log(`LocalNotifications error: ${e}`);
            console.log(`LocalNotifications error: ${JSON.stringify(options)}`);
          }
        });
    }, 2000);
  }

  private _getBodyNotificationFromCalendarRows(calendarRow: CalendarRow): string {
    let body = '';
    if (calendarRow.trash_types) {
      calendarRow.trash_types.forEach(trashObj => {
        body += `${trashObj.name['it']}, `;
      });
    }
    body += `esporre i sacchetti dalle ore ${calendarRow.start_time} alle ore ${calendarRow.stop_time}`;
    return body;
  }

  private async _initNotifications(): Promise<void> {
    await LocalNotifications.requestPermissions();
  }

  private async _removeNotifications(): Promise<void> {
    const pendingNotification = await LocalNotifications.getPending();
    if (pendingNotification.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pendingNotification.notifications,
      });
    }
  }
}
