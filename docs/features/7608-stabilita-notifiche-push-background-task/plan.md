> Ticket: oc:7608

# Plan — Stabilità notifiche push: notifiche locali graduate con recupero passivo

## Contesto

Branch: `feature/oc-7608-stabilita-notifiche-push-background-task`
Commit convention: `feat(oc:7608): ...` / `fix(oc:7608): ...` / `refactor(oc:7608): ...`

**Tre file toccati, in questo ordine:**
1. `calendar.effects.ts` — rimozione dell'effetto che causa race condition
2. `local-notification.service.ts` — logica di suddivisione + `recoveryTap$`
3. `app.component.ts` — `loadCalendars` con 60gg + sottoscrizione `recoveryTap$`

---

## Step 1 — Rimozione effetto `loadCalendars$` da `calendar.effects.ts`

**File:** `projects/pap/src/app/features/calendar/state/calendar.effects.ts`

**Problema:** `loadCalendars$` risponde a `loadTrashBooksSuccess` e chiama sempre `getCalendars()` senza params (10gg). Può sovrascrivere lo store dopo il caricamento a 60gg, causando una race condition.

**Cosa fare:** rimuovere completamente l'effetto `loadCalendars$` (righe 15-30). L'effetto `loadCalendarsWithDate$` (righe 31-44) copre già tutti i casi d'uso: risponde a qualsiasi `loadCalendars` action e usa i props passati.

**Verifica:** cercare altri punti nell'app che dipendano implicitamente da `loadCalendars$` per il caricamento automatico al login. Candidato noto: il trigger da `loadTrashBooksSuccess` potrebbe essere intenzionale per garantire che il calendario si carichi dopo il trash-book. Se così fosse, spostare la responsabilità esplicitamente in `app.component.ts` (vedi Step 3).

```typescript
// RIMUOVERE questo effetto:
loadCalendars$ = createEffect(() => {
  return this.isLogged$.pipe(
    filter(l => l),
    switchMap(_ => this.actions$),
    ofType(TrashBookAction.loadTrashBooksSuccess),
    switchMap(() => of({type: '[Calendar] Load Calendars'})),
    ofType(CalendarActions.loadCalendars),
    switchMap(action => {
      return this.calendarService.getCalendars();
    }),
    map(calendars => CalendarActions.loadCalendarsSuccess({calendars})),
    catchError(error => of(CalendarActions.loadCalendarsFailure({error}))),
  );
});
```

**Commit:** `refactor(oc:7608): remove loadCalendars$ effect to prevent race condition with 60-day store`

---

## Step 2 — Refactor `LocalNotificationService`

**File:** `projects/pap/src/app/shared/services/local-notification.service.ts`

### 2a — Aggiungere `recoveryTap$` Observable e listener

Aggiungere un `Subject<void>` privato e un Observable pubblico `recoveryTap$`.
Registrare il listener `localNotificationActionPerformed` **una sola volta** all'interno di `_initNotifications()`. Il listener emette su `recoveryTap$` solo se `notification.actionId === 'tap'` e `notification.notification.extra?.recovery === true`.

```typescript
import {Subject} from 'rxjs';

private _recoveryTap$ = new Subject<void>();
readonly recoveryTap$ = this._recoveryTap$.asObservable();

private async _initNotifications(): Promise<void> {
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') return; // early return se permessi negati

  LocalNotifications.addListener('localNotificationActionPerformed', notification => {
    if (notification.notification.extra?.recovery === true) {
      this._recoveryTap$.next();
    }
  });
}
```

> **Nota:** il listener viene registrato ogni volta che `_initNotifications()` è chiamata (cioè ad ogni `scheduleNotifications()`). Capacitor accumula listener duplicati. Usare un flag booleano privato `_listenerRegistered = false` per garantire la registrazione una tantum:
>
> ```typescript
> private _listenerRegistered = false;
>
> private async _initNotifications(): Promise<void> {
>   const permission = await LocalNotifications.requestPermissions();
>   if (permission.display !== 'granted') return;
>
>   if (!this._listenerRegistered) {
>     this._listenerRegistered = true;
>     LocalNotifications.addListener('localNotificationActionPerformed', n => {
>       if (n.notification.extra?.recovery === true) {
>         this._recoveryTap$.next();
>       }
>     });
>   }
> }
> ```

### 2b — Modificare `scheduleNotifications()` per la suddivisione normale/recovery

La logica attuale costruisce tutte le notifiche in un unico array senza cap. La nuova logica:

1. Costruire l'array `notifications: LocalNotificationSchema[]` come oggi (nessun cambiamento alla struttura per singola notifica).
2. Ordinare `notifications` per `schedule.at` crescente.
3. Calcolare `recoveryCount = Math.min(notifications.length - 1, 8)` e `normalCount = notifications.length - recoveryCount`.
4. Le prime `normalCount` notifiche rimangono invariate.
5. Le ultime `recoveryCount` notifiche vengono modificate:
   - `body = "C'è qualcosa da raccogliere oggi — apri per vedere quale"`
   - `largeBody = body`
   - `extra = { recovery: true }`
6. Se `notifications.length === 0`: return senza schedulare nulla.

```typescript
// dopo aver costruito l'array notifications e prima di LocalNotifications.schedule():

notifications.sort((a, b) => a.schedule!.at!.getTime() - b.schedule!.at!.getTime());

const recoveryCount = Math.min(notifications.length - 1, 8);
const normalCount = notifications.length - recoveryCount;
const recoveryBody = "C'è qualcosa da raccogliere oggi — apri per vedere quale";

notifications.slice(normalCount).forEach(n => {
  n.body = recoveryBody;
  n.largeBody = recoveryBody;
  n.extra = { recovery: true };
});
```

**Commit:** `feat(oc:7608): add recoveryTap$ observable and split notifications into normal/recovery`

---

## Step 3 — Modificare `app.component.ts`

**File:** `projects/pap/src/app/app.component.ts`

### 3a — `loadCalendars` con `stop_date` a 60 giorni

Sostituire `this._store.dispatch(loadCalendars())` (riga 72) con:

```typescript
import {format, addDays} from 'date-fns';

const start_date = format(new Date(), 'd-M-yyyy');
const stop_date = format(addDays(new Date(), 60), 'd-M-yyyy');
this._store.dispatch(loadCalendars({start_date, stop_date}));
```

`date-fns` è già importato nel progetto (`subHours`, `differenceInHours` usati nel service). Verificare che `format` e `addDays` siano disponibili senza installazioni aggiuntive.

### 3b — Sottoscrizione a `recoveryTap$`

All'interno del blocco `isLogged$.pipe(filter(l => l), take(1)).subscribe(...)`, aggiungere dopo `scheduleNotifications()`:

```typescript
this._localNotificationSvc.recoveryTap$.subscribe(() => {
  this._navCtrl.navigateRoot('/calendar');
});
```

`NavController` è già iniettato in `app.component.ts` come `_navCtrl`.

**Commit:** `feat(oc:7608): load calendar with 60-day range and navigate to calendar on recovery tap`

---

## Verifica manuale (dispositivo reale)

I background task e i listener di notifiche locali non sono affidabili sui simulatori. Test richiesti su dispositivo fisico:

- [ ] Schedulare notifiche → verificare che le ultime 8 abbiano testo generico (log o debug)
- [ ] Toccare una notifica di recupero → app apre e naviga a `/calendar`
- [ ] Dopo il tap, verificare che le notifiche vengano rischedulate (resume listener)
- [ ] Con 0 eventi futuri: nessuna notifica schedulata
- [ ] Con 1 evento futuro: 1 normale, 0 recovery
- [ ] Con permessi negati: `scheduleNotifications()` esce senza errori

---

## Note architetturali

- `loadCalendarsWithDate$` in `calendar.effects.ts` risponde a **qualsiasi** `loadCalendars` action — incluse quelle dispatched da `calendar-page.component.ts` (senza params) e `report-ticket.component.ts` (con params propri). La rimozione di `loadCalendars$` non altera questi flussi.
- La `calendar-page.component.ts` dispatcha `loadCalendars()` senza params quando viene aperta: questo sovrascrive lo store con i dati di default del backend (probabilmente 10gg). Non è un problema per le notifiche, che vengono schedulate solo al login/resume — non ogni volta che l'utente apre il calendario.
- Il `setTimeout(2000)` in `scheduleNotifications()` rimane invariato: è ancora necessario per attendere che lo store NgRx venga idratato dopo il dispatch di `loadCalendars`.
