import {Injectable} from '@angular/core';
import {
  LocalNotificationSchema,
  LocalNotifications,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import {Store, select} from '@ngrx/store';
import {format, subHours} from 'date-fns';
import {filter} from 'rxjs';
import {AppState} from '../../core/core.state';
import {CalendarRow} from '../../features/calendar/calendar.model';
import {selectCalendarState} from '../../features/calendar/state/calendar.selectors';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  calendarView$ = this._store.pipe(select(selectCalendarState));

  constructor(private _store: Store<AppState>) {
    this._initLocalNotifications();
    this._scheduleLocalNotifications();
  }

  private _getBodyNotificationFromCalendarRows(calendarRow: CalendarRow): string {
    let body = '';
    // `${calendarRow.trash_objects!.map(f => f.name).toString()}`
    if (calendarRow.trash_objects) {
      calendarRow.trash_objects.forEach(trashObj => {
        body += `${trashObj.name}, `;
      });
    }
    body += `esporre i sacchetti dalle ore ${calendarRow.start_time} alle ore ${calendarRow.stop_time}`;
    return body;
  }

  private async _initLocalNotifications(): Promise<void> {
    await LocalNotifications.requestPermissions();
  }

  private async _scheduleLocalNotifications(): Promise<void> {
    setTimeout(() => {
      this.calendarView$
        .pipe(filter(p => p != null && p.calendar != null))
        .subscribe(async calendarView => {
          const calendar = calendarView.calendar!;
          const calendarDates = Object.keys(calendar);
          const notifications: LocalNotificationSchema[] = [];
          calendarDates.forEach(calendarDate => {
            const calendarRows: CalendarRow[] = calendar![calendarDate];
            const currentDate = new Date();
            currentDate.setMinutes(currentDate.getMinutes() + 1);
            const atDate = new Date(calendarDate);

            calendarRows.forEach(calendarRow => {
              const startHour = +calendarRow.start_time.split(':')[0];
              const startMinute = +calendarRow.start_time.split(':')[1];
              const startDate = atDate.setHours(startHour, startMinute);
              const at = subHours(startDate, 7);
              const body = this._getBodyNotificationFromCalendarRows(calendarRow);
              notifications.push({
                id: +`${at.getTime()}`.toString().slice(0, 8),
                title: 'Raccolta differenziata',
                body,
                largeBody: 'largeBody della notifica',
                summaryText: 'summaryText della notifica',
                schedule: {
                  at,
                  allowWhileIdle: true,
                },
              });
              console.log(
                `${format(at, 'dd/MM/yyyy HH:mm:ss')}: ${body} alle notifica inviata alle ${format(
                  at,
                  'dd/MM/yyyy HH:mm:ss',
                )}`,
              );
            });
          });
          let options: ScheduleOptions = {
            notifications,
          };
          try {
            const pendingNotification = await LocalNotifications.getPending();
            if (pendingNotification.notifications.length > 0) {
              await LocalNotifications.cancel({notifications: pendingNotification.notifications});
            }
            await LocalNotifications.schedule(options);
          } catch (e) {
            console.log(`LocalNotifications error: ${e}`);
            console.log(`LocalNotifications error: ${JSON.stringify(options)}`);
            window.alert(`error: ${JSON.stringify(e)}`);
          }
        });
    }, 2000);
  }
}
