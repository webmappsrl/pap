> Ticket: oc:8052

# Plan — Fix esito code review oc:7612 — messaggi di conferma

## Contesto

Bug fix sul frontend `pap`. Nessun submodule coinvolto. Branch: `feature/oc-8052-fix-code-review-7612-messaggi-conferma` derivato da `oc_558`.

Commit convention: `fix(oc:8052): ...`

---

## Task 1 — Rimozione prefissi "AAA " da `abandonmentTicketForm`

**File:** `projects/pap/src/app/shared/models/form.model.ts`

In `abandonmentTicketForm` (riga 131) rimuovere il prefisso `AAA ` da tre campi:

- `cancel`: `'AAA Sicuro di voler cancellare la prenotazione?'` → `'Sicuro di voler cancellare la prenotazione?'`
- `finalMessage`: `'AAA La ringraziamo per la segnalazione...'` → `'La ringraziamo per la segnalazione...'`
- `step[0].label`: `'AAA Questo serivizio ti permette...'` → `'Questo serivizio ti permette...'`

Nessuna altra modifica al file.

---

## Task 2 — Fix `form.component.ts`: reinizializzazione, separatore, console.log

**File:** `projects/pap/src/app/shared/form/form/form.component.ts`

### 2a — Reinizializzazione FormGroup nel setter (riga 42)

All'inizio del corpo del setter `ticketFormConf`, prima di iterare sugli step, aggiungere:

```typescript
this.ticketForm = new UntypedFormGroup({});
```

Il setter diventa idempotente: chiamarlo più volte non accumula controlli duplicati.

### 2b — Separatore `<br><br>` (riga 120)

Sostituire:
```typescript
finalMsg += `\n\n${trashBookType.confirmation_message}`;
```
con:
```typescript
finalMsg += `<br><br>${trashBookType.confirmation_message}`;
```

### 2c — Rimozione console.log e subscription non chiusa (riga 103)

Rimuovere interamente la riga:
```typescript
this.currentTrashbookType$.subscribe(val => console.log(val));
```

`currentTrashbookType$` rimane dichiarato come class field e viene usato correttamente in `_ticketSub` tramite `withLatestFrom` — non va toccato.

---

## Task 3 — Nuovo selector `selectTicketFormsConfigsLoaded`

**File:** `projects/pap/src/app/shared/form/state/form.selectors.ts`

Aggiungere in fondo al file, dopo `selectTicketFormConfByType`:

```typescript
export const selectTicketFormsConfigsLoaded = createSelector(
  selectTicketState,
  state => state.ticketFormsConfigsLoaded,
);
```

---

## Task 4 — Guard already-loaded in `home.component.ts`

**File:** `projects/pap/src/app/features/home/home.component.ts`

Aggiungere l'import del nuovo selector:
```typescript
import {selectTicketFormsConfigsLoaded} from '../../shared/form/state/form.selectors';
```

Nel metodo `action()`, sostituire il dispatch diretto:
```typescript
this._store.dispatch(loadTicketFormsConfig());
```
con il dispatch condizionale:
```typescript
this._store.pipe(select(selectTicketFormsConfigsLoaded), take(1)).subscribe(loaded => {
  if (!loaded) this._store.dispatch(loadTicketFormsConfig());
});
```

`take(1)` è già importato — nessun import aggiuntivo per rxjs.

---

## Task 5 — Test di regressione Karma

**File:** `projects/pap/src/app/shared/form/form/form.component.spec.ts`

Aggiungere un nuovo `describe` block in fondo al file (dopo i `describe` esistenti):

```typescript
describe('FormComponent — ticketFormConf setter idempotency', () => {
  let component: FormComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore(),
        {provide: NavController, useValue: {navigateRoot: () => undefined}},
        {
          provide: AlertController,
          useValue: {create: () => Promise.resolve({present: () => {}, onDidDismiss: () => of(null)})},
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectCalendarState as any, null);
    store.overrideSelector(trashBookTypes as any, []);
    store.overrideSelector(confiniZone as any, []);
    store.overrideSelector(currentTrashBookType as any, undefined);
    store.overrideSelector(ticketError as any, null);
    store.overrideSelector(ticketLoading as any, false);
    store.overrideSelector(ticketSuccess as any, null);
    store.overrideSelector(user as any, null);

    const fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should not duplicate controls when ticketFormConf is set twice', () => {
    const conf: TicketFormConf = {
      cancel: '',
      finalMessage: '',
      pages: 1,
      ticketType: 'report',
      step: [{label: 'Note', type: 'note', required: false}],
    };
    component.ticketFormConf = conf;
    component.ticketFormConf = conf;
    // se addControl venisse chiamato senza reset, 'note' sarebbe duplicato e il form invalido
    expect(component.ticketForm.contains('note')).toBeTrue();
    expect(Object.keys(component.ticketForm.controls).filter(k => k === 'note').length).toBe(1);
  });
});
```

Aggiungere un caso nel `describe` esistente `'FormComponent — success alert message'`:

```typescript
it('should use <br><br> (not \\n) as separator between finalMessage and confirmation_message', fakeAsync(() => {
  store.overrideSelector(currentTrashBookType as any, {
    id: 5,
    slug: 'raee',
    name: {it: 'RAEE'},
    confirmation_message: 'Assicurarsi che la strada sia larga.',
  });
  store.refreshState();

  component.ticketFormConf = {
    cancel: '',
    finalMessage: 'La sua segnalazione è stata presa in carico.',
    pages: 1,
    ticketType: 'reservation',
    step: [],
  };

  store.overrideSelector(ticketSuccess as any, true);
  store.refreshState();
  tick(300);

  const msg: string = alertCreateSpy.calls.mostRecent().args[0].message;
  expect(msg).toContain('<br><br>Assicurarsi che la strada sia larga.');
  expect(msg).not.toContain('\n');
}));
```

---

## Task 6 — Fixture Cypress da risposta reale backend

**File nuovi:** `cypress/fixtures/ticket-forms-config.json`, `cypress/fixtures/trash-types.json`

Eseguire le chiamate reali con il backend attivo e salvare le risposte:

```bash
# ticket-forms-config
curl -s "https://dev.portapporta.webmapp.it/api/v2/c/1/ticket-forms-config" \
  -H "Authorization: Bearer <token>" > cypress/fixtures/ticket-forms-config.json

# trash_types
curl -s "https://dev.portapporta.webmapp.it/api/v2/c/1/trash_types.json" \
  -H "Authorization: Bearer <token>" > cypress/fixtures/trash-types.json
```

Per il test del `confirmation_message`: verificare che almeno un tipo in `trash-types.json` abbia `confirmation_message` valorizzato. Se nessun tipo lo ha in dev, aggiungere manualmente il campo a uno dei tipi `showed_in.reservation: true` nella fixture (non nel backend).

---

## Task 7 — Aggiornamento test Cypress esistenti

### 7a — `pap-abandonment-ticket.cy.ts`

**File:** `cypress/e2e/pap-abandonment-ticket/pap-abandonment-ticket.cy.ts`

Aggiungere nell'hook `before()`, dopo l'intercept di `apiTrashTypes`:

```typescript
const apiTicketFormsConfig = `${environment.api}/c/${environment.companyId}/ticket-forms-config`;
cy.intercept('GET', apiTicketFormsConfig, {fixture: 'ticket-forms-config.json'}).as('ticketFormsConfigCall');
```

Aggiungere la variabile in testa al file:
```typescript
const apiTicketFormsConfig = `${environment.api}/c/${environment.companyId}/ticket-forms-config`;
```

### 7b — `pap-ticket-reservation.cy.ts`

**File:** `cypress/e2e/pap-ticket-reservation/pap-ticket-reservation.cy.ts`

Stessa modifica di 7a: aggiungere la variabile e l'intercept nel `before()`.

---

## Task 8 — Nuovo test Cypress flusso successo con `confirmation_message`

**File:** `cypress/e2e/pap-ticket-reservation/pap-ticket-reservation.cy.ts`

Aggiungere in testa al file le variabili necessarie:
```typescript
const apiTicket = `${environment.api}/c/${environment.companyId}/ticket`;
```

Aggiungere un nuovo `describe` block in fondo al file (prima dell'`after()`):

```typescript
describe('pap-ticket-reservation: success alert shows confirmation_message separated by <br>', () => {
  it('should show finalMessage and confirmation_message separated by visible space in success alert', () => {
    // recupera un trash type con confirmation_message dalla fixture
    cy.fixture('trash-types.json').then((trashTypes: any) => {
      const types = trashTypes?.data ?? trashTypes;
      const typeWithConfirmation = types.find((t: any) => t.confirmation_message);
      if (!typeWithConfirmation) {
        cy.log('Nessun trash type con confirmation_message nella fixture — test skippato');
        return;
      }

      cy.intercept('POST', apiTicket, {
        statusCode: 200,
        body: {data: {id: 9999, code: 'TEST-9999'}},
      }).as('sendTicket');

      cy.intercept('GET', apiTrashTypes, {fixture: 'trash-types.json'}).as('trashTypesFixture');

      // naviga al form prenotazione
      cy.contains(servicesButton!.label).click();
      cy.contains(ticketReservationButton!.text).should('be.visible').click();

      // seleziona il tipo con confirmation_message
      cy.get('ion-radio-group').contains(typeWithConfirmation.name?.it ?? typeWithConfirmation.name).click();
      cy.get('.pap-status-next-button').click();

      // compila location (mock già attivo su zones.geojson)
      cy.get('pap-map').click('center');
      cy.get('.pap-status-next-button').should('not.be.disabled').click();

      // skip image
      cy.get('.pap-status-next-button').click();

      // note
      cy.get('ion-textarea').type('test note');
      cy.get('.pap-status-next-button').click();

      // telefono
      cy.get('input').type('3334455667');
      cy.get('.pap-status-checkmark-button').click();

      // invia
      cy.get('.pap-status-sending-button').click();
      cy.wait('@sendTicket');

      // verifica alert
      cy.get('ion-alert').should('be.visible');
      cy.get('ion-alert .alert-message').then($el => {
        const html = $el.html();
        expect(html).to.include(typeWithConfirmation.confirmation_message);
        expect(html).to.include('<br>');
      });
    });
  });
});
```

---

## Ordine di esecuzione consigliato

1. Task 1 (form.model.ts) — isolato, nessuna dipendenza
2. Task 3 (form.selectors.ts) — necessario prima del Task 4
3. Task 4 (home.component.ts) — dipende da Task 3
4. Task 2 (form.component.ts) — indipendente, può andare in parallelo con 3+4
5. Task 5 (spec Karma) — dopo Task 2
6. Task 6 (fixture Cypress) — richiede backend attivo
7. Task 7 (intercept nei test esistenti) — dopo Task 6
8. Task 8 (nuovo test Cypress) — dopo Task 6 e 7

## Commit suggeriti

```
fix(oc:8052): remove AAA debug prefixes from abandonmentTicketForm fallback
fix(oc:8052): reinitialize FormGroup in ticketFormConf setter, fix br separator, remove stale subscription
fix(oc:8052): expose ticketFormsConfigsLoaded selector and guard loadTicketFormsConfig dispatch
test(oc:8052): add karma regression tests for setter idempotency and br separator
test(oc:8052): add cypress fixtures and intercepts for ticket-forms-config
test(oc:8052): add cypress e2e test for reservation success alert with confirmation_message
```

## Cleanup out of scope (da fare in ticket separato)

- Rimozione codice morto `alertEvt$.pipe(...)` mai sottoscritto in `form.component.ts`
- Refactor backend: estrazione `TicketType::allConfigs($company)` (repo portapporta)
- Refactor backend: rimozione ~187 righe hardcoded in `TicketType.php`
- Refactor backend: deduplicazione `step0label` nel trait Nova
