import {Injectable} from '@angular/core';
import {App} from '@capacitor/app';
import {
  LocalNotificationSchema,
  LocalNotifications,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import {Store, select} from '@ngrx/store';
import {differenceInCalendarDays, subHours} from 'date-fns';
import {filter, take} from 'rxjs/operators';
import {isLogged} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {CalendarRow} from '../../features/calendar/calendar.model';
import {selectCalendarState} from '../../features/calendar/state/calendar.selectors';
@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {
  calendarView$ = this._store.pipe(select(selectCalendarState));
  isLogged$ = this._store.pipe(select(isLogged));

  constructor(private _store: Store<AppState>) {
    App.addListener('resume', () => {
      this.isLogged$
        .pipe(
          filter(l => l),
          take(1),
        )
        .subscribe(async () => {
          this._initNotifications();
          this._scheduleNotifications();
        });
    });
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

  private async _remove(): Promise<void> {
    const pendingNotification = await LocalNotifications.getPending();
    if (pendingNotification.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pendingNotification.notifications,
      });
    }
  }

  private async _scheduleNotifications(): Promise<void> {
    await this._remove();
    setTimeout(async () => {
      this.calendarView$
        .pipe(filter(p => p != null && p.calendars != null))
        .subscribe(async calendarView => {
          const calendars = calendarView.calendars!;
          if (calendars) {
            calendars.forEach(async calendar => {
              const calendarDates = Object.keys(calendar.calendar);
              const notifications: LocalNotificationSchema[] = [];
              calendarDates
                .filter(cDate => differenceInCalendarDays(new Date(cDate), new Date()) > 0)
                .forEach(calendarDate => {
                  const calendarRows: CalendarRow[] = calendar.calendar![calendarDate];
                  const currentDate = new Date();
                  currentDate.setMinutes(currentDate.getMinutes() + 1);
                  const atDate = new Date(calendarDate);

                  calendarRows.forEach(calendarRow => {
                    const startHour = +calendarRow.start_time.split(':')[0];
                    const startMinute = +calendarRow.start_time.split(':')[1];
                    const startDate = atDate.setHours(startHour, startMinute);
                    let at = subHours(startDate, 12);
                    if (+startHour >= 12) {
                      at = subHours(startDate, 7);
                    }
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
                  });
                });
              let options: ScheduleOptions = {
                notifications,
              };
              try {
                await LocalNotifications.schedule(options);
              } catch (e) {
                console.log(`LocalNotifications error: ${e}`);
                console.log(`LocalNotifications error: ${JSON.stringify(options)}`);
              }
            });
          }
        });
    }, 2000);
  }
}
