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

| Feature                                 | Ticket  | Moduli toccati                                                                                                                                    | Note                                                                            |
| --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Fix race condition GPS in getLocation() | oc:8045 | `location.component.ts`, `location.component.spec.ts`, `report-ticket.component.spec.ts`, `company.selectors.spec.ts`                             | Swap 2 righe in getLocation(); 2 test di regressione per Caso 1 e Caso 2        |
| Revisione test suite CI headless        | oc:7991 | `karma.conf.js`, `angular.json`, `package.json`, `cypress/e2e/**`, `form.component.html`, `first-step.component.html`, `second-step.component.ts` | Karma CI headless + script test:ci; tutti i test Cypress corretti e funzionanti |
| Fix code review oc:7612 — form messaggi | oc:8052 | `form.model.ts`, `form.component.ts`, `form.component.spec.ts`, `form.selectors.ts`, `home.component.ts`, `cypress/e2e/pap-*-ticket/**`, `cypress/fixtures/ticket-forms-config.json`, `cypress/fixtures/trash-types.json`, `cypress/fixtures/minimal-reservation-config.json` | 4 fix bloccanti (debug prefix, FormGroup reset, `<br>` separator, subscription); guard already-loaded per `loadTicketFormsConfig`; test Cypress aggiornati con fixture reali |

## Decisioni architetturali

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
