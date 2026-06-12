> Ticket: oc:8056

# [Review oc:7608] Notifiche di recupero: promemoria persi e "zona di recupero" che non scatta

## Cosa cambia

- La "zona di recupero" (le ultime N notifiche di recupero) viene ora garantita anche per utenti con raccolte frequenti, grazie a un tetto esplicito sul numero totale di notifiche prima dello split.
- Se i permessi notifiche vengono revocati, le notifiche già schedulate vengono sempre ripulite — anche senza entrare nel ramo di scheduling.
- La formattazione dell'orario di raccolta viene unificata in un metodo condiviso, eliminando il rischio di testi divergenti tra notifiche normali e di recupero.
- Il formato data `'d-M-yyyy'` usato per le chiamate al calendario viene centralizzato in una costante condivisa.

## Perché

Emerso dalla code review di oc:7608 (PR #80). Due bug bloccanti impattano direttamente l'affidabilità delle notifiche:

1. **Bug 2 — Zona di recupero non scatta mai con raccolte frequenti:** il calendario 60 giorni può generare più di 64 notifiche. iOS accetta al massimo 64 notifiche pending e scarta le più lontane nel tempo — che sono esattamente le 8 di recupero. Senza un tetto esplicito prima dello split, la rete di sicurezza non scatta mai per gli utenti più attivi.
2. **Bug 4 — Notifiche zombie dopo revoca permessi:** `_removeNotifications()` viene chiamata solo se i permessi sono concessi. Se l'utente revoca i permessi dopo averli concessi, le notifiche già schedulate restano in coda.

I due item di cleanup (formattazione orari e formato data) riducono il rischio di regressioni future per divergenza di testi.

## Requisiti

- [ ] Aggiungere la costante `PLATFORM_LIMIT = 64` in `local-notification.service.ts`
- [ ] Prima dello split recovery, troncare l'array `notifications` a `PLATFORM_LIMIT` elementi (i più vicini nel tempo)
- [ ] `RECOVERY_COUNT` rimane 8; il commento deve esplicitare la relazione con `PLATFORM_LIMIT`
- [ ] Spostare `await this._removeNotifications()` prima del check `_initNotifications()` in `scheduleNotifications()`
- [ ] Estrarre `_formatTimeRange(start: string, stop: string): string` e usarlo sia in `_getBodyNotificationFromCalendarRows` che in `_getRecoveryBody`
- [ ] Aggiungere flag `_scheduling = false`; all'ingresso di `scheduleNotifications()` uscire immediatamente se `true`, resettare a `false` al termine (success e error) — previene esecuzioni concorrenti su resume ravvicinati
- [ ] Avvolgere il corpo di `_removeNotifications()` in try/catch — in caso di errore tornare silenziosamente senza propagare il reject
- [ ] Aggiornare i test unitari di `local-notification.service.spec.ts` per coprire il nuovo comportamento (cap a PLATFORM_LIMIT, cleanup incondizionato)
- [ ] Aggiungere test di integrazione su `scheduleNotifications()` che mockino `LocalNotifications` e verifichino: numero notifiche passate a `schedule()` ≤ PLATFORM_LIMIT, le ultime 8 sono recovery, `cancel()` viene chiamato prima di `schedule()` anche se i permessi sono negati

## Rischi

- **Troncamento a 64 sbaglia l'ordine:** se `notifications` non è già ordinato per data al momento del troncamento, potremmo tenere le date sbagliate. Il fix deve assicurare che l'ordinamento avvenga **prima** del troncamento (`sort` → `splice` → split recovery).
- **`CALENDAR_DATE_FORMAT` condiviso crea coupling tra moduli:** `calendar.model.ts` diventa una dipendenza di `report-ticket.component.ts`. Rischio basso perché il formato è già identico — se venisse cambiato, cambierebbe comunque in entrambi i posti. Mitigazione: la costante va in `calendar.model.ts` (già importato in tutta l'app).

## Out of scope

- **Bug 1** (promemoria persi dopo segnalazione mancato ritiro): già risolto da oc:8054 con lo slice `reportCalendar` separato.
- **Bug 3** (tap su qualsiasi notifica porta al calendario): comportamento invariato per scelta.
- **Cleanup gulp** (3 blocchi copia quasi identici in `gulpfile.ts`): rimandato a ticket `chore` dedicato.

## Moduli toccati

| File | Tipo modifica |
|------|---------------|
| `projects/pap/src/app/shared/services/local-notification.service.ts` | Bug 2, Bug 4, cleanup formattazione |
| `projects/pap/src/app/shared/services/local-notification.service.spec.ts` | Test aggiornati |
