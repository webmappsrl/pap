> Ticket: oc:7608

# Stabilità notifiche push — notifiche locali graduate con recupero passivo

## Cosa cambia

`LocalNotificationService.scheduleNotifications()` introduce tre modifiche:

1. **Store a 60 giorni**: `app.component.ts` dispatcha `loadCalendars({start_date: oggi, stop_date: oggi+60})` invece di `loadCalendars()` senza params. L'effetto `loadCalendars$` (triggerato da `loadTrashBooksSuccess`) viene rimosso per evitare race condition — `loadCalendarsWithDate$` copre già il suo caso d'uso. `scheduleNotifications()` continua a leggere dallo store come oggi, ma ora trova 60 giorni di dati.

2. **Suddivisione in due fasce** dei 50 slot disponibili:
   - **Notifiche normali** (prime `max(1, n - 8)`): testo dettagliato con tipo raccolta e orario, comportamento invariato.
   - **Notifiche di recupero** (ultime `min(n - 1, 8)`): titolo `Raccolta differenziata`, corpo `C'è qualcosa da raccogliere oggi — apri per vedere quale`, campo `extra: { recovery: true }` per identificarle al tap.

3. **Tap recovery → calendario**: `LocalNotificationService` espone un Observable `recoveryTap$` che emette quando l'utente tocca una notifica di recupero. `app.component.ts` si sottoscrive e chiama `NavController.navigateRoot('/calendar')`. Separazione netta: il service gestisce le notifiche, il component gestisce la navigazione. Il rescheduling avviene implicitamente tramite il listener `resume` già presente.

## Perché

Le notifiche di calendario sono locali e schedulate solo quando l'app è aperta (login o resume). Se l'utente non apre l'app per settimane, le notifiche scadono senza essere rigenerate. Background fetch e silent push non risolvono il problema su Android 12+ (force-stop) né su iOS (force-quit dall'utente). L'approccio graduato sfrutta il limite di 50 slot intenzionalmente: le ultime 8 notifiche fungono da "zona di recupero" che invita l'utente a riaprire l'app, innescando la rischedulazione automatica.

## Requisiti

- [ ] `app.component.ts` dispatcha `loadCalendars({start_date: oggi, stop_date: oggi+60})` al login
- [ ] L'effetto `loadCalendars$` in `calendar.effects.ts` viene rimosso (sostituito da `loadCalendarsWithDate$`)
- [ ] `scheduleNotifications()` legge dallo store come oggi — nessuna chiamata HTTP diretta
- [ ] `_initNotifications()` verifica il risultato di `requestPermissions()`: early return se non `granted`
- [ ] Le notifiche future sono ordinate cronologicamente prima della suddivisione
- [ ] Le prime `max(1, n - 8)` notifiche mantengono il formato attuale (titolo + dettaglio raccolta)
- [ ] Le ultime `min(n - 1, 8)` notifiche usano titolo `Raccolta differenziata` e corpo `C'è qualcosa da raccogliere oggi — apri per vedere quale`
- [ ] Le notifiche di recupero includono `extra: { recovery: true }` per essere identificabili al tap
- [ ] `LocalNotificationService` espone `recoveryTap$: Observable<void>` che emette al tap di una recovery
- [ ] Il listener `localNotificationActionPerformed` è registrato una sola volta in `_initNotifications()`
- [ ] `app.component.ts` si sottoscrive a `recoveryTap$` e chiama `NavController.navigateRoot('/calendar')`
- [ ] Se il calendario ha 0 eventi futuri, non viene schedulata nessuna notifica (comportamento invariato)
- [ ] Se il calendario ha 1 evento futuro, viene schedulato come normale (0 recovery)

## Rischi

| Rischio | Mitigazione |
|---|---|
| Race condition: `loadCalendars$` sovrascrive store con 10gg dopo il caricamento a 60gg | Rimozione di `loadCalendars$`; `loadCalendarsWithDate$` copre il caso d'uso |
| Listener `localNotificationActionPerformed` registrato più volte (ogni resume) | Registrazione una tantum in `_initNotifications()` |
| `NavController` non disponibile al cold-start se nel service | `recoveryTap$` Observable nel service, navigazione gestita da `app.component.ts` che controlla il ciclo di vita |
| Permessi notifiche revocati → scheduling silenzioso inutile | Early return in `_initNotifications()` se `requestPermissions()` ≠ `granted` |
| Con calendari ad alta densità (>2 raccolte/giorno) la copertura si riduce sotto i 60gg | Limite noto e accettato: con 1-2 raccolte/giorno ERSU la copertura è 21-42gg normali + 8gg recovery |
| Recovery già schedulate rimangono sul dispositivo dopo un rollback | Al primo avvio post-rollback, `_removeNotifications()` le cancella prima di rischedulare |

## Out of scope

- Background fetch / `cordova-plugin-background-fetch` (già parzialmente implementato ma non presente nel codice attuale — non toccato in questo ciclo)
- Push notification server-side (FCM/APNs) — Soluzione 2 del ticket, valutata per un ciclo successivo
- Silent push per triggerare rescheduling — Soluzione 3 del ticket, scartata
- Configurazione nativa (Info.plist, AndroidManifest.xml)
- Traduzione in altre lingue (testi già hardcoded in italiano nell'intera app)

## Moduli toccati

| File | Tipo modifica |
|---|---|
| `projects/pap/src/app/shared/services/local-notification.service.ts` | Logica suddivisione normale/recovery, `recoveryTap$` Observable, listener tap, check permessi |
| `projects/pap/src/app/features/calendar/state/calendar.effects.ts` | Rimozione effetto `loadCalendars$` (race condition con 60gg) |
| `projects/pap/src/app/app.component.ts` | `loadCalendars` con `stop_date +60gg`; sottoscrizione a `recoveryTap$` → `navigateRoot('/calendar')` |
