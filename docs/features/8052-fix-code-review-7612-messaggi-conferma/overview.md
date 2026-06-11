> Ticket: oc:8052

# Fix esito code review oc:7612 — messaggi di conferma

## Cosa cambia

Quattro difetti bloccanti introdotti dal commit `f25abfc` (oc:7612) vengono corretti nel frontend `pap`:
- I testi fallback di `abandonmentTicketForm` non mostrano più il prefisso debug "AAA " all'utente
- Il form viene reinizializzato correttamente quando la config backend arriva dopo il render col fallback
- Il messaggio di conferma per prenotazioni RAEE/ingombranti appare separato visivamente dal messaggio principale
- Una subscription mai chiusa e un console.log residuo vengono rimossi dal constructor

## Perché

La code review di oc:7612 ha identificato quattro problemi bloccanti visibili in produzione per il client ERSU: testo di debug esposto all'utente, potenziale perdita di input durante la compilazione del form, messaggi attaccati senza separazione visiva, memory leak da subscription non gestita.

## Requisiti

- [ ] Rimuovere i prefissi "AAA " da `cancel`, `finalMessage` e `step[0].label` in `abandonmentTicketForm`
- [ ] Reinizializzare `ticketForm` (`new UntypedFormGroup({})`) all'inizio del setter `ticketFormConf` prima di aggiungere i controlli
- [ ] Aggiungere selector `selectTicketFormsConfigsLoaded` in `form.selectors.ts` che espone `ticketFormsConfigsLoaded` dallo store
- [ ] Aggiungere guard already-loaded in `home.component.ts`: dispatchare `loadTicketFormsConfig` solo se `selectTicketFormsConfigsLoaded` è `false` — elimina la race condition alla radice
- [ ] Sostituire `\n\n` con `<br><br>` come separatore tra `finalMessage` e `confirmation_message` nel messaggio dell'AlertController
- [ ] Rimuovere `this.currentTrashbookType$.subscribe(val => console.log(val))` dal constructor
- [ ] [UX] Il messaggio di conferma prenotazione deve renderizzare correttamente la spaziatura tra i due paragrafi nell'Ionic AlertController
- [ ] Aggiungere test di regressione (Karma): impostare `ticketFormConf` due volte non duplica i controlli del form
- [ ] Aggiungere test di regressione (Karma): il separatore tra `finalMessage` e `confirmation_message` è `<br><br>` e non `\n`
- [ ] Verificare che `pap-abandonment-ticket.cy.ts` passi dopo il fix (importa `abandonmentTicketForm` direttamente — sarà automaticamente consistente col modello aggiornato)
- [ ] Creare fixture `cypress/fixtures/ticket-forms-config.json` e `cypress/fixtures/trash-types.json` partendo dalla risposta reale del backend
- [ ] Aggiungere `cy.intercept` su `ticket-forms-config` nei test Cypress che aprono un form ticket, usando la fixture creata
- [ ] Aggiungere test Cypress nel file `pap-ticket-reservation.cy.ts`: flusso di successo prenotazione con `confirmation_message` proveniente dal backend mockato (fixture `trash-types.json` con campo `confirmation_message` valorizzato + mock POST `/ticket`) — verifica che l'alert mostri entrambi i messaggi separati da spazio visibile

## Rischi

- **Race condition config/form eliminata alla radice**: il guard already-loaded garantisce che `loadTicketFormsConfig` venga dispatchato una sola volta e che la config sia stabile prima che l'utente interagisca col form. Il setter `ticketFormConf` viene comunque reso idempotente (reinizializzazione) come difesa in profondità. ~~Reinizializzazione distruttiva mid-session~~ — non più applicabile con il guard.
- **`<br><br>` già in uso a riga 122**: il codice esistente usa già `<br><br>` + `<strong>` nello stesso campo `message` dell'AlertController — la sanitizzazione Ionic non è un rischio reale.
- **Testi fallback `abandonmentTicketForm`**: i testi senza "AAA " non sono stati validati dal cliente ERSU. Se la config backend è sempre disponibile, il fallback non viene mai mostrato in produzione — rischio basso.
- **Scope condiviso**: `abandonmentTicketForm` è usato come fallback per tutti i client, non solo ERSU. Il fix ha impatto positivo su tutti gli ambienti.

## Out of scope

I seguenti cleanup identificati in code review sono **documentati ma non implementati** in questo ciclo:

- Rimozione stato morto `ticketFormsConfigsLoaded` dal reducer — portato in scope come selector, non più stato morto
- Rimozione codice morto `alertEvt$.pipe(...)` mai sottoscritto in `form.component.ts`
- Refactor backend: estrazione helper `TicketType::allConfigs($company)` (repo portapporta)
- Refactor backend: rimozione ~187 righe hardcoded in `TicketType.php` (repo portapporta)
- Refactor backend: deduplicazione special-case `step0label` nel trait Nova (repo portapporta)

## Moduli toccati

| File | Modifica |
|------|---------|
| `projects/pap/src/app/shared/models/form.model.ts` | Rimozione prefissi "AAA " da `abandonmentTicketForm` |
| `projects/pap/src/app/shared/form/form/form.component.ts` | Reinizializzazione FormGroup nel setter, fix `<br><br>`, rimozione console.log/subscription |
| `projects/pap/src/app/shared/form/form/form.component.spec.ts` | Aggiunta test di regressione per fix 2 e fix 3 |
| `projects/pap/src/app/shared/form/state/form.selectors.ts` | Nuovo selector `selectTicketFormsConfigsLoaded` |
| `projects/pap/src/app/features/home/home.component.ts` | Guard already-loaded prima del dispatch di `loadTicketFormsConfig` |
| `cypress/fixtures/ticket-forms-config.json` | Nuova fixture da chiamata reale backend |
| `cypress/fixtures/trash-types.json` | Nuova fixture da chiamata reale backend (con `confirmation_message`) |
| `cypress/e2e/pap-abandonment-ticket/pap-abandonment-ticket.cy.ts` | Aggiunta intercept `ticket-forms-config` |
| `cypress/e2e/pap-ticket-reservation/pap-ticket-reservation.cy.ts` | Aggiunta intercept `ticket-forms-config` + test flusso successo con `confirmation_message` |
