import {Injectable} from '@angular/core';
import {
  LocalNotificationSchema,
  LocalNotifications,
  ScheduleOptions,
} from '@capacitor/local-notifications';
import {Store, select} from '@ngrx/store';
import {Subject} from 'rxjs';
import {differenceInHours, subHours} from 'date-fns';
import {filter, map, take} from 'rxjs/operators';
import {isLogged} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {CalendarRow} from '../../features/calendar/calendar.model';
import {selectCalendarState} from '../../features/calendar/state/calendar.selectors';
import {CalendarState} from '../../features/calendar/state/calendar.reducer';

const RECOVERY_COUNT = 8;

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {
  calendarView$ = this._store.pipe(select(selectCalendarState));
  isLogged$ = this._store.pipe(select(isLogged));

  private _recoveryTap$ = new Subject<void>();
  readonly recoveryTap$ = this._recoveryTap$.asObservable();

  private _listenerRegistered = false;

  constructor(private _store: Store<AppState>) {}

  async scheduleNotifications(): Promise<void> {
    const permissionGranted = await this._initNotifications();
    if (!permissionGranted) return;

    await this._removeNotifications();
    setTimeout(async () => {
      this.calendarView$
        .pipe(
          filter(p => p != null && p.calendars != null && p.calendars.length > 0),
          map((calendarState: CalendarState) => calendarState!.calendars![0]),
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
                  extra: {
                    start_time: calendarRow.start_time,
                    stop_time: calendarRow.stop_time,
                  },
                });
              }
            });
          });

          if (notifications.length === 0) return;

          notifications.sort((a, b) => a.schedule!.at!.getTime() - b.schedule!.at!.getTime());

          const recoveryCount = Math.min(notifications.length - 1, RECOVERY_COUNT);
          const normalCount = notifications.length - recoveryCount;

          notifications.slice(normalCount).forEach(n => {
            const body = this._getRecoveryBody(n.extra?.start_time, n.extra?.stop_time);
            n.body = body;
            n.largeBody = body;
            n.extra = {recovery: true};
          });

          const options: ScheduleOptions = {notifications};
          try {
            await LocalNotifications.schedule(options);
          } catch (e) {
            console.log(`LocalNotifications error: ${e}`);
            console.log(`LocalNotifications error: ${JSON.stringify(options)}`);
          }
        });
    }, 2000);
  }

  private _getRecoveryBody(start_time?: string, stop_time?: string): string {
    if (start_time && stop_time) {
      return `Ritiro dalle ore ${start_time} alle ore ${stop_time} — apri per vedere cosa preparare`;
    }
    return `Hai una raccolta programmata — apri per vedere i dettagli`;
  }

  private _getBodyNotificationFromCalendarRows(calendarRow: CalendarRow): string {
    let body = '';
    if (calendarRow.trash_types) {
      calendarRow.trash_types.forEach(trashObj => {
        body += `${trashObj.name['it']}, `;
      });
    }
    body += `il ritiro verrà effettuato dalle ore ${calendarRow.start_time} alle ore ${calendarRow.stop_time}`;
    return body;
  }

  private async _initNotifications(): Promise<boolean> {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') return false;

    if (!this._listenerRegistered) {
      this._listenerRegistered = true;
      LocalNotifications.addListener('localNotificationActionPerformed', () => {
        this._recoveryTap$.next();
      });
    }

    return true;
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
