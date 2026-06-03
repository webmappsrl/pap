> Ticket: oc:7991

# Notes — Revisione test suite frontend

## Deviazioni dal piano

- Il backend Laravel era out of scope (repo separato): lavoro limitato al solo frontend Angular/Ionic.
- Lo step "configurazione database di test dedicato" del ticket riguardava il backend; non implementato in questo ciclo.
- I test Cypress richiedono backend attivo (credenziali reali in `cypress.env.json` già gitignored).

## Bug trovati durante l'implementazione

- `karma.conf.js` con `singleRun: false` e `clearContext: false` in headless causava "Some of your tests did a full page reload" — risolto con `clearContext: isCI`.
- Il reporter `kjhtml` causava reload in CI headless — rimosso solo per il profilo CI.
- `app.component.ts` usa `take(1)` su `isLogged$` per dispatchar `loadConfiniZone()` — con `testIsolation: false` in run completo, la chiamata non viene ridispatchata tra spec file; fix: `apiZonesGeoJsonData` impostato direttamente dal mock senza `cy.wait`.
- Il default map center `(44.034, 10.124)` è fuori da tutte e 40 le zone reali → mock `zones.geojson` con bounding box ampia che copre l'area.
- `sign-up.component.ts` e `settings.component.ts` usano `take(1)` su `selectFormJsonByStep` che si completava prima del caricamento di `companies_data` → mock deterministico di `companies_data` in `before()`.
- `second-step.component.ts` ha il template inline (non separato in `.html`) — mancava l'attributo `e2e-pap-form-control-name` per i campi password.
- Push notification service usa `map(r => r.data)` → il mock necessitava wrapping `{data: [...]}`.
- `ion-input` non è clearable da Cypress (non è un `input` nativo) → usare `{selectall}` o `{force: true}`.
- `ion-input` non espone `placeholder` come attributo DOM host → non usare `have.attr 'placeholder'` nei test.
- `authError$` in `app.component.ts` mostra un `ion-alert` popup per errori di login → i test sign-in devono verificare l'alert, non l'`ion-label` inline.

## Decisioni

- Mock `zones.geojson` con un poligono bbox ampia invece di navigare la mappa a una zona reale: soluzione più semplice e deterministica.
- `apiZonesGeoJsonData` impostato direttamente dal mock (no `cy.wait`) per evitare flakiness da `take(1)` non ridispatchato.
- `realZonesGeoJsonData` caricato via `cy.request` in `pap-settings` per il test del thirdStep che confronta le label reali.
- `e2e-pap-form-control-name` aggiunto ai template (prod code) come attributo di test per selettori Cypress stabili su `ion-input`.
- `Math.random()` in `pap-trash-book-type` sostituito con indice fisso `0` per determinismo.

## Follow-up

- Configurare la CI pipeline (GitHub Actions/GitLab CI) che invoca `npm run test:ci` — lo script è pronto ma non collegato a nessuna pipeline in questo ticket.
- `cy:run` per i Cypress richiede backend attivo — non automatizzabile in CI standard senza backend disponibile.
- Rivedere il template sign-in: `{{error?.error?.message}}` è vuoto per errori stringa — potenziale bug di visualizzazione in produzione.
