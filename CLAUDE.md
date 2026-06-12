# PAP — PortAPPorta

## Stack

Angular 15 + Ionic 6 + NgRx + Capacitor (iOS/Android). Test unitari: Karma + Jasmine. Test e2e: Cypress.

## Comandi principali

```bash
npm run test:ci      # test unitari headless (CI)
npm run cy:run       # test e2e Cypress (richiede backend attivo + npm start)
ng serve             # dev server su localhost:8100
```

## Feature disponibili

| Feature                                                 | Ticket  | Moduli toccati                                                                                                                                                                                                                                                                                                               | Note                                                                                                                                                                         |
| ------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fix code review oc:7608 — notifiche recupero           | oc:8056 | `shared/services/local-notification.service.ts`, `shared/services/local-notification.service.spec.ts` | `PLATFORM_LIMIT=64` + splice prima dello split; `_removeNotifications` incondizionato con try/catch; guard `_scheduling`; `_formatTimeRange` condiviso; 71/71 test |
| Fix bug code review oc:7609 — store calendario separato | oc:8054 | `core/core.module.ts`, `report-ticket/report-ticket.component.ts`, `report-ticket/report-ticket.component.spec.ts`, `report-ticket/state/report-calendar.actions.ts`, `report-ticket/state/report-calendar.reducer.ts`, `report-ticket/state/report-calendar.effects.ts`, `report-ticket/state/report-calendar.selectors.ts` | Nuovo slice `reportCalendar` isolato; `ionViewWillEnter` attende `loading===false` company con fallback permissivo; 64/64 test                                               |
| Fix race condition GPS in getLocation()                 | oc:8045 | `location.component.ts`, `location.component.spec.ts`, `report-ticket.component.spec.ts`, `company.selectors.spec.ts`                                                                                                                                                                                                        | Swap 2 righe in getLocation(); 2 test di regressione per Caso 1 e Caso 2                                                                                                     |
| Revisione test suite CI headless                        | oc:7991 | `karma.conf.js`, `angular.json`, `package.json`, `cypress/e2e/**`, `form.component.html`, `first-step.component.html`, `second-step.component.ts`                                                                                                                                                                            | Karma CI headless + script test:ci; tutti i test Cypress corretti e funzionanti                                                                                              |
| Fix code review oc:7612 — form messaggi                 | oc:8052 | `form.model.ts`, `form.component.ts`, `form.component.spec.ts`, `form.selectors.ts`, `home.component.ts`, `cypress/e2e/pap-*-ticket/**`, `cypress/fixtures/ticket-forms-config.json`, `cypress/fixtures/trash-types.json`, `cypress/fixtures/minimal-reservation-config.json`                                                | 4 fix bloccanti (debug prefix, FormGroup reset, `<br>` separator, subscription); guard already-loaded per `loadTicketFormsConfig`; test Cypress aggiornati con fixture reali |

## Decisioni architetturali

### Fix code review oc:7608 — notifiche recupero (oc:8056)

- **`PLATFORM_LIMIT = 64` con `sort → splice → split`:** iOS scarta le notifiche più lontane se si superano 64 pending. Il tetto va applicato DOPO l'ordinamento cronologico — se si tronca prima, si potrebbero tenere date casuali. La costante è il limite iOS usato come ceiling cross-platform (Android non ha questo limite).
- **`_removeNotifications()` incondizionata con try/catch:** spostata prima del check permessi in `scheduleNotifications()` così le notifiche zombie vengono sempre ripulite anche quando i permessi sono revocati. Il try/catch interno gestisce `getPending()` che può lanciare su Android con Doze mode.
- **Guard `_scheduling`:** previene esecuzioni concorrenti di `scheduleNotifications()` su resume ravvicinati. Il flag è resettato in `finally` subito dopo il `setTimeout`, non dopo la subscription interna — il lock non serve a serializzare l'async interno, solo a bloccare invocazioni multiple in ingresso.
- **`spyOn` non funziona su Capacitor Proxy:** le API di `LocalNotifications` sono esposte via Proxy, le proprietà non sono own properties e `spyOn` non le intercetta. I test di integrazione usano spy sui metodi privati `_removeNotifications`/`_initNotifications`. Soluzione futura: wrappare `LocalNotifications` in un injectable service per DI nei test.

### Fix bug code review oc:7609 — store calendario separato (oc:8054)

- **Store slice separato `reportCalendar`**: il form Mancato ritiro dispatchava `loadCalendars({oggi-15 → oggi})` sovrascrivendo lo store condiviso. Al resume successivo `scheduleNotifications()` trovava solo date passate e cancellava tutte le notifiche. La soluzione è un nuovo slice `reportCalendar` con azioni, reducer, effects e selectors dedicati — il form usa `loadReportCalendars` e non tocca mai lo store `calendar` condiviso.
- **Attesa `loading === false` su CompanyState**: `ionViewWillEnter` usava `take(1)` sincrono su `selectCompanyProperties`. Se `companies_data` non era ancora caricato, `exclude_in_progress` finiva a `false`. Ora si usa `combineLatest([selectCompanyProperties, selectLoading]).pipe(filter(([, loading]) => !loading), take(1))` — il dispatch avviene solo quando il caricamento è completato (o fallito). Fallback permissivo (`false`) se `properties` è `undefined` dopo errore API.
- **Pattern effects corretto in `ReportCalendarEffects`**: usa `actions$.pipe(ofType, withLatestFrom(isLogged$), filter, switchMap(inner.pipe(catchError)))` invece del pattern outer-`switchMap` di `CalendarEffects`. Il `catchError` dentro il `switchMap` interno non termina lo stream esterno al primo errore HTTP.
- **Registrazione in `core.module.ts`**: coerente con tutti gli altri feature slice; non nel `ReportTicketModule`.

### Fix race condition GPS (oc:8045)

- **Ordine dispatch/setPosition in `getLocation()`**: `dispatch(setMarker({coords}))` deve avvenire **prima** di `setPosition(coords)`. `setPosition` legge `currentZone$` con `take(1)` in modo sincrono — se il marker non è ancora aggiornato nello store la zona è quella del marker precedente (o null). Il flusso `clickOnMap` in `map.component.ts` aveva già l'ordine corretto.
- **Test con spy su `store.dispatch`**: i test di `getLocation()` non usano solo `overrideSelector` statico, ma aggiornano il selector dentro lo spy del dispatch. Questo rende il test sensibile all'ordine: con le righe invertite il test fallisce perché `setPosition` legge il selector prima che venga aggiornato dal dispatch.
- **Selector pollution fix**: `report-ticket.component.spec.ts` ora chiama `store.resetSelectors()` in `afterEach` — senza di esso il valore mockato di `selectCompanyProperties` persisteva globalmente sulla funzione selector (chiusura `overrideResult` in `defaultMemoize` di NgRx). `company.selectors.spec.ts` ora chiama `clearResult()` in `beforeEach` per essere ermetico indipendentemente dall'ordine di esecuzione.

### Revisione test suite (oc:7991)

- **Attributo `e2e-pap-form-control-name`** aggiunto agli `ion-input` nei template (`form.component.html`, `first-step.component.html`, `second-step.component.ts`) per selettori Cypress stabili — `ion-input` Ionic non espone `formControlName` come attributo DOM standard.
- **Mock deterministici Cypress**: `zones.geojson` mockato con bounding box ampia `[9.5-11.0 lon, 43.5-44.8 lat]` perché il default map center `(44.034, 10.124)` è fuori da tutte le zone reali. `companies_data` mockato per evitare race condition con `take(1)` nei form.
- **`apiZonesGeoJsonData` senza `cy.wait`**: `app.component.ts` usa `take(1)` su `isLogged$` per `loadConfiniZone()` — in suite completa con `testIsolation: false` la chiamata non viene ridispatchata; dato mockato direttamente.
- **CI pipeline out of scope**: lo script `test:ci` è pronto ma non collegato a nessuna pipeline — serve GitHub Actions/GitLab CI separato.
- **Cypress e2e richiedono backend**: i test Cypress usano credenziali reali (`cypress.env.json` gitignored) e non girano senza backend attivo.

### Fix code review oc:7612 — messaggi conferma (oc:8052)

- **Reset FormGroup nel setter `ticketFormConf`**: il setter inizia con `this.ticketForm = new UntypedFormGroup({})` per evitare accumulo di controlli duplicati ad ogni re-assegnazione della config.
- **Separatore `<br><br>` nel messaggio di successo**: `AlertController` Ionic renderizza il campo `message` via `innerHTML` — `\n` non funziona, serve `<br><br>` per separare `finalMessage` da `confirmation_message`.
- **Guard already-loaded per `loadTicketFormsConfig`**: `home.component.ts` controlla `selectTicketFormsConfigsLoaded` prima di dispatchare. Evita la race condition in cui il backend risponde mentre l'utente sta già compilando il form con la configurazione statica di fallback.
- **Cypress fixture-based**: i 4 file di test ticket usano `ticket-forms-config.json` (fixture da backend reale) per i controlli DOM invece del fallback statico `form.model.ts`. La fixture `minimal-reservation-config.json` (senza step location) evita la dipendenza da Leaflet nel test del separatore `<br>`.
- **Reset store nei test Cypress**: il describe di regressione per `<br>` chiama `cy.visit()` nel `before()` per resettare lo store NgRx (`ticketFormsConfigsLoaded → false`) e far sì che l'intercept minimal venga effettivamente usato.
