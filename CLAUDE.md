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

| Feature | Ticket | Moduli toccati | Note |
|---|---|---|---|
| Fix race condition GPS in getLocation() | oc:8045 | `location.component.ts`, `location.component.spec.ts`, `report-ticket.component.spec.ts`, `company.selectors.spec.ts` | Swap 2 righe in getLocation(); 2 test di regressione per Caso 1 e Caso 2 |
| Revisione test suite CI headless | oc:7991 | `karma.conf.js`, `angular.json`, `package.json`, `cypress/e2e/**`, `form.component.html`, `first-step.component.html`, `second-step.component.ts` | Karma CI headless + script test:ci; tutti i test Cypress corretti e funzionanti |

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
