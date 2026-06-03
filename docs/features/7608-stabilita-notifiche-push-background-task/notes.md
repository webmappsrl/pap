> Ticket: oc:7608

# Notes — Stabilità notifiche push: notifiche locali graduate con recupero passivo

## Deviazioni dal piano

- **Testo recovery cambiato dopo test su device**: il testo originale "C'è qualcosa da raccogliere oggi — apri per vedere quale" è stato sostituito con "Ritiro dalle ore HH:MM alle ore HH:MM — apri per vedere cosa preparare". La notifica scatta 12h prima della raccolta (sera del giorno precedente), quindi "oggi" era semanticamente errato. L'orario è ora estratto dall'`extra` della notifica durante la conversione in recovery.

- **`_initNotifications()` ora ritorna `boolean`**: la firma originale era `Promise<void>`. Modificata per supportare l'early return in caso di permessi negati, con guard in `scheduleNotifications()`.

## Bug trovati

- **Race condition `loadCalendars$`**: l'effetto NgRx triggerato da `loadTrashBooksSuccess` chiamava `getCalendars()` senza params (10gg default) e poteva sovrascrivere lo store dopo il caricamento a 60gg. Risolto rimuovendo `loadCalendars$` — `loadCalendarsWithDate$` copre già il caso d'uso.

## Decisioni

- **`recoveryTap$` Observable nel service, navigazione in `app.component.ts`**: `NavController` non è stato iniettato in `LocalNotificationService` per evitare rischi di navigazione durante il cold-start. Il service espone solo l'Observable, il component gestisce la navigazione.
- **`extra` usato per passare `start_time`/`stop_time`**: i tempi vengono salvati nell'`extra` di ogni notifica durante la costruzione, poi letti al momento della conversione in recovery. Il campo viene poi sovrascritto con `{ recovery: true }` per il listener di tap.
- **`_listenerRegistered` flag**: Capacitor accumula listener duplicati se `addListener` viene chiamato più volte. Il flag garantisce registrazione una tantum anche su resume ripetuti.

- **Tap notifiche normali → calendario**: il listener `localNotificationActionPerformed` ora emette `recoveryTap$` per qualsiasi notifica, non solo recovery. La condizione `extra?.recovery === true` è stata rimossa. Motivazione: coerenza UX — l'utente si aspetta di atterrare sul calendario toccando un promemoria di raccolta, indipendentemente dal tipo.

## Follow-up

- `environment.ts` e `tsconfig.json` hanno modifiche pre-esistenti non legate a questo ticket (`app_name` aggiunto, `esModuleInterop: true`). Da committare separatamente.
- Testato su device Android con `DEBUG_NOTIFICATIONS = true` (notifiche ogni 5s). Verificare su iOS prima del rilascio sugli store.
- Il `setTimeout(2000)` in `scheduleNotifications()` è un accoppiamento temporale con l'idratazione dello store NgRx. Tech debt accettato — refactor futuro potrebbe sostituirlo con una sottoscrizione reattiva a `loadCalendarsSuccess`.
