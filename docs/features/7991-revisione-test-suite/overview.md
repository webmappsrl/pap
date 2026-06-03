> Ticket: oc:7991

# Revisione test suite frontend: verifica, correzione e configurazione CI headless

## Cosa cambia

La configurazione Karma acquisisce un profilo CI (`ChromeHeadless`, `singleRun: true`) separato da quello di sviluppo locale. Tutti i test unitari Karma/Jasmine (10 spec file) e tutti i test e2e Cypress (15 suite) vengono verificati e corretti fino a farne passare la totalità.

## Perché

Il team ha bisogno di una suite di test affidabile per l'app PortAPPorta. La configurazione attuale (`browsers: ['Chrome']`, `singleRun: false`) non è eseguibile in ambienti headless o CI senza un display fisico. I test unitari e e2e potrebbero avere regressioni silenti non rilevate.

## Requisiti

- [ ] Aggiungere un profilo Karma CI (`ChromeHeadless`, `singleRun: true`, `--no-progress`) separato dalla configurazione di sviluppo locale
- [ ] Aggiungere la configurazione `test-ci` in `angular.json` che punta al profilo headless
- [ ] Aggiungere lo script `test:ci` in `package.json` (`ng test --configuration=ci`)
- [ ] Eseguire tutti i test unitari Karma/Jasmine e correggere i test non funzionanti
- [ ] Eseguire tutti i test Cypress e2e e correggere i test non funzionanti
- [ ] Tutti i test passano al termine del ticket
- [ ] Ogni correzione mantiene o migliora le asserzioni originali — sono vietati `pending()`, rimozione di `expect`, e mock troppo permissivi che rendano il test sempre verde indipendentemente dal comportamento reale

## Rischi

- **Cypress e2e richiedono backend attivo:** i test Cypress usano credenziali reali e chiamano API reali — non possono girare in CI standard senza un backend disponibile. Il profilo headless riguarda solo i test Karma; i Cypress restano legati all'ambiente di sviluppo con backend attivo. Mitigazione: documentare chiaramente questa limitazione.
- **Test con dipendenze da Capacitor/plugin nativi:** alcuni componenti usano plugin Capacitor (geolocation, push notifications) che si comportano diversamente in ambiente browser testing — i test unitari devono mockare questi plugin correttamente.

## Out of scope

- Backend Laravel (gestito in repo separato)
- Aggiunta di nuovi test per componenti privi di copertura
- Soglie minime di code coverage
- Sostituzione delle chiamate API reali in Cypress con fixture statiche
- Configurazione CI pipeline (GitHub Actions, GitLab CI, ecc.)

## Moduli toccati

- `projects/pap/karma.conf.js` — aggiunta launcher `ChromeHeadlessCi` e flag `singleRun` condizionale
- `angular.json` — aggiunta configurazione `test-ci` sotto `projects.core.architect.test`
- `package.json` — aggiunta script `test:ci`
- `projects/pap/src/app/**/*.spec.ts` — correzione test unitari non funzionanti (se presenti)
- `cypress/e2e/**/*.cy.ts` — correzione test e2e non funzionanti (se presenti)
