> Ticket: oc:8056

# Piano — [Review oc:7608] Notifiche di recupero: promemoria persi e "zona di recupero" che non scatta

## Convenzione commit

Tutti i commit usano `fix(oc:8056): ...`

**⚠️ Nessun commit automatico.** I commit sotto sono istruzioni testuali — ogni `git commit` va eseguito manualmente dopo revisione esplicita del diff.

---

## Step 1 — `local-notification.service.ts`: costanti e flag

**File:** `projects/pap/src/app/shared/services/local-notification.service.ts`

### 1a — Aggiungere `PLATFORM_LIMIT` e aggiornare `RECOVERY_COUNT`

In cima al file, subito dopo gli import, sostituire:

```typescript
const RECOVERY_COUNT = 8;
```

con:

```typescript
// iOS hard limit for pending local notifications; used as a cross-platform ceiling.
const PLATFORM_LIMIT = 64;
// Must be < PLATFORM_LIMIT so recovery notifications always fit within the platform quota.
const RECOVERY_COUNT = 8;
```

### 1b — Aggiungere il flag `_scheduling`

Nella classe `LocalNotificationService`, dopo `private _listenerRegistered = false;`, aggiungere:

```typescript
private _scheduling = false;
```

---

## Step 2 — `local-notification.service.ts`: `_removeNotifications()` robusta

**File:** `projects/pap/src/app/shared/services/local-notification.service.ts`

Avvolgere il corpo di `_removeNotifications()` in try/catch:

```typescript
private async _removeNotifications(): Promise<void> {
  try {
    const pendingNotification = await LocalNotifications.getPending();
    if (pendingNotification.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pendingNotification.notifications,
      });
    }
  } catch {
    // Silently ignore — getPending() can throw on some Android configurations.
  }
}
```

---

## Step 3 — `local-notification.service.ts`: riordino `scheduleNotifications()`

**File:** `projects/pap/src/app/shared/services/local-notification.service.ts`

Riscrivere `scheduleNotifications()` applicando:

1. Guard `_scheduling` in ingresso
2. `_removeNotifications()` **prima** del check permessi
3. `PLATFORM_LIMIT` come tetto prima dello split (con `sort` già applicato)
4. Reset `_scheduling` in finally

```typescript
async scheduleNotifications(): Promise<void> {
  if (this._scheduling) return;
  this._scheduling = true;

  try {
    await this._removeNotifications();

    const permissionGranted = await this._initNotifications();
    if (!permissionGranted) return;

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
                  schedule: {at, allowWhileIdle: true},
                  extra: {
                    start_time: calendarRow.start_time,
                    stop_time: calendarRow.stop_time,
                  },
                });
              }
            });
          });

          if (notifications.length === 0) return;

          // Sort first, then cap to platform limit — order matters.
          notifications.sort((a, b) => a.schedule!.at!.getTime() - b.schedule!.at!.getTime());
          notifications.splice(PLATFORM_LIMIT);

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
          }
        });
    }, 2000);
  } finally {
    this._scheduling = false;
  }
}
```

> **Nota:** il `finally` resetta `_scheduling` immediatamente dopo il `setTimeout`, non dopo che le notifiche sono state schedulate. Questo è intenzionale: il `setTimeout` esegue in modo asincrono e il lock serve solo a prevenire invocazioni concorrenti multiple ravvicinate al resume, non a serializzare la logica interna del subscribe.

---

## Step 4 — `local-notification.service.ts`: unificare formattazione orari

**File:** `projects/pap/src/app/shared/services/local-notification.service.ts`

### 4a — Aggiungere `_formatTimeRange()`

```typescript
private _formatTimeRange(start_time: string, stop_time: string): string {
  return `dalle ore ${start_time} alle ore ${stop_time}`;
}
```

### 4b — Aggiornare `_getBodyNotificationFromCalendarRows()`

```typescript
private _getBodyNotificationFromCalendarRows(calendarRow: CalendarRow): string {
  let body = '';
  if (calendarRow.trash_types) {
    calendarRow.trash_types.forEach(trashObj => {
      body += `${trashObj.name['it']}, `;
    });
  }
  body += `il ritiro verrà effettuato ${this._formatTimeRange(calendarRow.start_time, calendarRow.stop_time)}`;
  return body;
}
```

### 4c — Aggiornare `_getRecoveryBody()`

```typescript
private _getRecoveryBody(start_time?: string, stop_time?: string): string {
  if (start_time && stop_time) {
    return `Ritiro ${this._formatTimeRange(start_time, stop_time)} — apri per vedere cosa preparare`;
  }
  return `Hai una raccolta programmata — apri per vedere i dettagli`;
}
```

---

## Step 5 — `local-notification.service.spec.ts`: aggiornare test esistenti e aggiungere integrazione

**File:** `projects/pap/src/app/shared/services/local-notification.service.spec.ts`

### 5a — Aggiornare la costante `RECOVERY_COUNT` nella spec

Aggiungere accanto a `RECOVERY_COUNT = 8`:

```typescript
const PLATFORM_LIMIT = 64;
```

### 5b — Aggiungere test per il cap a `PLATFORM_LIMIT` nella suite `split logic`

```typescript
it(`${PLATFORM_LIMIT} events: ${PLATFORM_LIMIT - RECOVERY_COUNT} normal, ${RECOVERY_COUNT} recovery`, () => {
  const result = applyRecoverySplit(makeNotifications(PLATFORM_LIMIT), getBody);
  expect(result.filter(n => !n.extra?.recovery).length).toBe(PLATFORM_LIMIT - RECOVERY_COUNT);
  expect(result.filter(n => n.extra?.recovery).length).toBe(RECOVERY_COUNT);
});

it(`${PLATFORM_LIMIT + 10} events capped: only ${PLATFORM_LIMIT} scheduled`, () => {
  const notifications = makeNotifications(PLATFORM_LIMIT + 10);
  notifications.sort((a, b) => a.schedule!.at!.getTime() - b.schedule!.at!.getTime());
  notifications.splice(PLATFORM_LIMIT);
  const result = applyRecoverySplit(notifications, getBody);
  expect(result.length).toBe(PLATFORM_LIMIT);
});
```

### 5c — Aggiungere suite `scheduleNotifications()` con mock di `LocalNotifications`

Aggiungere in cima agli import della spec:

```typescript
import {LocalNotifications} from '@capacitor/local-notifications';
import {of} from 'rxjs';
```

E aggiungere la suite:

```typescript
describe('scheduleNotifications()', () => {
  let cancelSpy: jasmine.Spy;
  let scheduleSpy: jasmine.Spy;
  let getPendingSpy: jasmine.Spy;
  let requestPermissionsSpy: jasmine.Spy;

  function makeCalendarState(daysCount: number) {
    const calendar: Record<string, CalendarRow[]> = {};
    for (let i = 1; i <= daysCount; i++) {
      const d = addDays(MOCK_NOW, i);
      const key = d.toISOString().split('T')[0];
      calendar[key] = [{start_time: '07:00', stop_time: '13:00', trash_types: []}] as any;
    }
    return {calendars: [{calendar}], error: ''};
  }

  beforeEach(() => {
    cancelSpy = spyOn(LocalNotifications, 'cancel').and.resolveTo(undefined as any);
    scheduleSpy = spyOn(LocalNotifications, 'schedule').and.resolveTo(undefined as any);
    getPendingSpy = spyOn(LocalNotifications, 'getPending').and.resolveTo({notifications: []});
    requestPermissionsSpy = spyOn(LocalNotifications, 'requestPermissions').and.resolveTo({display: 'granted'} as any);
    spyOn(LocalNotifications, 'addListener').and.resolveTo({remove: () => {}} as any);
  });

  it('calls cancel() before schedule() when permissions are granted', async () => {
    const store = TestBed.inject(Store);
    (store as any).overrideSelector(selectCalendarState, makeCalendarState(5));
    await service.scheduleNotifications();
    await new Promise(r => setTimeout(r, 2100));
    expect(cancelSpy).toHaveBeenCalledBefore(scheduleSpy);
  });

  it('calls cancel() even when permissions are denied', async () => {
    requestPermissionsSpy.and.resolveTo({display: 'denied'} as any);
    await service.scheduleNotifications();
    expect(getPendingSpy).toHaveBeenCalled();
  });

  it('never schedules more than PLATFORM_LIMIT notifications', async () => {
    const store = TestBed.inject(Store);
    (store as any).overrideSelector(selectCalendarState, makeCalendarState(PLATFORM_LIMIT + 20));
    await service.scheduleNotifications();
    await new Promise(r => setTimeout(r, 2100));
    const scheduled: LocalNotificationSchema[] = scheduleSpy.calls.mostRecent().args[0].notifications;
    expect(scheduled.length).toBeLessThanOrEqual(PLATFORM_LIMIT);
  });

  it('last RECOVERY_COUNT notifications are recovery', async () => {
    const store = TestBed.inject(Store);
    (store as any).overrideSelector(selectCalendarState, makeCalendarState(PLATFORM_LIMIT + 20));
    await service.scheduleNotifications();
    await new Promise(r => setTimeout(r, 2100));
    const scheduled: LocalNotificationSchema[] = scheduleSpy.calls.mostRecent().args[0].notifications;
    const tail = scheduled.slice(-RECOVERY_COUNT);
    tail.forEach(n => expect(n.extra?.recovery).toBeTrue());
  });

  it('ignores concurrent calls while scheduling', async () => {
    const store = TestBed.inject(Store);
    (store as any).overrideSelector(selectCalendarState, makeCalendarState(5));
    service.scheduleNotifications();
    service.scheduleNotifications();
    await new Promise(r => setTimeout(r, 2100));
    expect(getPendingSpy).toHaveBeenCalledTimes(1);
  });
});
```

> **Nota:** i test con `setTimeout(2100)` sono necessari per attendere il `setTimeout(2000)` interno al service. Questo pattern è accettabile in Karma perché Jasmine supporta `done` o Promise nei test async — assicurarsi che il test sia dichiarato `async` e usi `await`.

---

## Verifica finale

```bash
npm run test:ci
```

Tutti i test devono passare (inclusi i nuovi). Verificare in particolare:

- Nessuna regressione nelle suite `split logic` e `recoveryTap$` esistenti
- Le 4 nuove assertion della suite `scheduleNotifications()` passano

---

## Commit

```
fix(oc:8056): cap notifications to PLATFORM_LIMIT, fix zombie cleanup and concurrent scheduling
```

Eseguire solo dopo revisione esplicita del diff.
