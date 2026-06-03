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
| Revisione test suite CI headless | oc:7991 | `karma.conf.js`, `angular.json`, `package.json`, `cypress/e2e/**`, `form.component.html`, `first-step.component.html`, `second-step.component.ts` | Karma CI headless + script test:ci; tutti i test Cypress corretti e funzionanti |

## Decisioni architetturali

### Revisione test suite (oc:7991)

- **Attributo `e2e-pap-form-control-name`** aggiunto agli `ion-input` nei template (`form.component.html`, `first-step.component.html`, `second-step.component.ts`) per selettori Cypress stabili — `ion-input` Ionic non espone `formControlName` come attributo DOM standard.
- **Mock deterministici Cypress**: `zones.geojson` mockato con bounding box ampia `[9.5-11.0 lon, 43.5-44.8 lat]` perché il default map center `(44.034, 10.124)` è fuori da tutte le zone reali. `companies_data` mockato per evitare race condition con `take(1)` nei form.
- **`apiZonesGeoJsonData` senza `cy.wait`**: `app.component.ts` usa `take(1)` su `isLogged$` per `loadConfiniZone()` — in suite completa con `testIsolation: false` la chiamata non viene ridispatchata; dato mockato direttamente.
- **CI pipeline out of scope**: lo script `test:ci` è pronto ma non collegato a nessuna pipeline — serve GitHub Actions/GitLab CI separato.
- **Cypress e2e richiedono backend**: i test Cypress usano credenziali reali (`cypress.env.json` gitignored) e non girano senza backend attivo.
