> Ticket: oc:7991

# Plan — Revisione test suite frontend: verifica, correzione e configurazione CI headless

## Contesto

- **Repo:** `pap` (Angular/Ionic frontend)
- **Classificazione:** Custom (nessun submodule)
- **Commit convention:** `feat(oc:7991): ...` / `fix(oc:7991): ...`
- **Branch:** `feature/oc-7991-revisione-test-suite`

---

## Step 1 — Configurazione Karma CI headless

**File:** `projects/pap/karma.conf.js`

Aggiungere il launcher `ChromeHeadlessCi` con flag stabili per ambienti headless:

```js
customLaunchers: {
  ChromeHeadlessCi: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  },
},
```

Rendere `singleRun` e `browsers` condizionali alla variabile d'ambiente `CI`:

```js
browsers: [process.env['CI'] ? 'ChromeHeadlessCi' : 'Chrome'],
singleRun: !!process.env['CI'],
```

**File:** `angular.json`

Aggiungere la configurazione `ci` sotto `projects.core.architect.test.configurations`:

```json
"configurations": {
  "ci": {
    "progress": false,
    "watch": false
  }
}
```

**File:** `package.json`

Aggiungere lo script:

```json
"test:ci": "CI=true ng test --configuration=ci"
```

Commit: `feat(oc:7991): add karma headless CI config and test:ci script`

---

## Step 2 — Esecuzione e audit test unitari Karma

Eseguire i test in modalità headless:

```bash
npm run test:ci 2>&1 | tee /tmp/karma-output.txt
```

Per ogni test che fallisce, identificare la causa:

| Causa accettabile | Correzione ammessa |
|---|---|
| Mock mancante per provider Angular | Aggiungere il provider nel `TestBed` |
| Import non risolto | Correggere l'import |
| Asincronia non gestita | Usare `fakeAsync`/`tick` o `async`/`await` |
| Dipendenza da plugin Capacitor | Mockare il plugin con `jasmine.createSpyObj` |

**Regola ferrea:** nessuna correzione può rimuovere o indebolire le asserzioni esistenti. Se un test fallisce perché l'implementazione è sbagliata, si corregge l'implementazione — non il test.

Commit: `fix(oc:7991): fix failing unit tests`  
*(omettere se tutti i test passano già)*

---

## Step 3 — Esecuzione e audit test Cypress e2e

Prerequisiti:
- App in esecuzione su `http://localhost:8100` (`npm start`)
- Backend attivo e raggiungibile con le credenziali in `cypress.env.json`

Eseguire:

```bash
npm run cy:run 2>&1 | tee /tmp/cypress-output.txt
```

Per ogni suite che fallisce, analizzare:

- **Selettori CSS obsoleti** — aggiornare al selettore attuale nel DOM
- **Timing / `cy.wait`** — aumentare il timeout o usare `cy.intercept` per aspettare la risposta
- **Comportamento UI cambiato** — aggiornare il test per rispecchiare il comportamento reale attuale

**Regola ferrea:** stesse restrizioni dei test unitari — nessuna asserzione rimossa o indebolita.

Commit: `fix(oc:7991): fix failing e2e Cypress tests`  
*(omettere se tutti i test passano già)*

---

## Step 4 — Verifica finale

Eseguire l'intera suite in sequenza e confermare che tutto sia verde:

```bash
# Unit tests headless
npm run test:ci

# E2e (richiede app + backend attivi)
npm run cy:run
```

Entrambi i comandi devono terminare con exit code 0.

---

## Note al piano

- I test Cypress richiedono un backend reale — non girano in CI senza backend disponibile. Questo è un limite noto e documentato, non un bug del piano.
- La CI pipeline (GitHub Actions / GitLab CI) è out of scope: lo script `test:ci` è pronto ma non viene collegato a nessuna pipeline in questo ticket.
- Il prerequisito `Chrome` (o `Chromium`) deve essere installato nell'ambiente dove si esegue `test:ci`.
