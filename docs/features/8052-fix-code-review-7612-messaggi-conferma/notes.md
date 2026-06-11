> Ticket: oc:8052

# Note di sviluppo — oc:8052

## Decisioni prese durante l'implementazione

### 1. Prefissi "AAA " in `abandonmentTicketForm`

Rimossi 3 prefissi debug dalle stringhe `cancel`, `finalMessage` e `step[0].label` in `form.model.ts`. Era codice di test rimasto in produzione.

### 2. Reset FormGroup nel setter `ticketFormConf`

Il setter aggiungeva i controlli con `addControl` senza mai resettare il `FormGroup`. Impostando la config due volte (es. riutilizzo del componente) si accumulavano controlli duplicati. Fix: `this.ticketForm = new UntypedFormGroup({})` come prima riga del setter.

### 3. Separatore `<br><br>` invece di `\n\n` nel messaggio di successo

`AlertController` di Ionic renderizza il campo `message` via `innerHTML`. Il carattere `\n` non viene interpretato come interruzione di riga — serve `<br>`. La stringa di conferma visibile all'utente è ora `finalMessage + '<br><br>' + confirmation_message`.

### 4. Subscription non chiusa nel costruttore

`this.currentTrashbookType$.subscribe(val => console.log(val))` era rimasta nel costruttore di `form.component.ts` come debug. Rimossa perché creava una subscription zombie non gestita.

### 5. Guard already-loaded per `loadTicketFormsConfig`

Invece di dispatchare `loadTicketFormsConfig()` incondizionatamente al click su un servizio, si verifica prima con `selectTicketFormsConfigsLoaded`. Se la config è già caricata il dispatch non parte. Questo evita la race condition in cui il backend risponde mentre il form statico è già visualizzato, sovrascrivendo la configurazione a metà compilazione.

Aggiunto selector `selectTicketFormsConfigsLoaded` in `form.selectors.ts` che legge `state.ticketFormsConfigsLoaded` (già presente nello store).

### 6. Test Cypress: fixture invece di costanti hardcoded

I 4 file di test Cypress (`pap-abandonment-ticket`, `pap-report-ticket`, `pap-info-ticket`, `pap-ticket-reservation`) usavano la costante `abandonmentTicketForm` ecc. importata da `form.model.ts`. Questo fallback statico poteva differire dal backend. Ora ogni file carica `ticket-forms-config.json` (fixture da chiamata reale) e usa quella per i controlli DOM (`testTicketFormStep`).

Aggiunta fixture `trash-types.json` con `raee_big` (id:29) patchato con `confirmation_message` per il test del separatore `<br>`.

### 7. Test Cypress success alert — problema con guard already-loaded

Il test di regressione per il separatore `<br>` (ultimo describe in `pap-ticket-reservation.cy.ts`) usa `minimal-reservation-config.json` — una config senza lo step `location` — per evitare la dipendenza dal map Leaflet (non si inizializza correttamente in headless).

Con `testIsolation: false`, dopo i test precedenti il flag `ticketFormsConfigsLoaded` nello store NgRx è `true`. Il guard impedisce il re-fetch: l'intercept per la minimal config non verrebbe chiamato e il form userebbe la config completa (con location step). Fix: `before()` nel describe che fa `cy.visit()` per resettare lo store prima di impostare l'intercept.

### 8. Fixture `minimal-reservation-config.json`

Estratta in file separato invece di essere definita inline come oggetto JS, per rispettare la convenzione di usare sempre `{fixture: '...'}` negli intercept Cypress.
