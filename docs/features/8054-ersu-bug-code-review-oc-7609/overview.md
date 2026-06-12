> Ticket: oc:8054

# [ersu] Bug emersi dalla code review di oc:7609 — PAP (frontend)

## Cosa cambia

Il form "Mancato ritiro" usa un proprio store slice dedicato invece di contaminare lo store calendario condiviso. Il flag aziendale `exclude_in_progress` viene letto solo quando i dati company sono effettivamente caricati, con fallback permissivo in caso di errore API.

## Perché

La code review di oc:7609 ha evidenziato che:
1. `report-ticket.component.ts` dispatchava `loadCalendars` con una finestra ridotta (`oggi-15 → oggi`), sovrascrivendo lo store condiviso. Al resume successivo, `scheduleNotifications()` trovava solo date passate e cancellava tutte le notifiche senza rischedularne.
2. `ionViewWillEnter` leggeva `selectCompanyProperties` con `take(1)` sincrono: se `companies_data` non era ancora caricato il flag `exclude_in_progress` finiva a `false`, mostrando la data odierna durante il giro.

## Requisiti

- [ ] Creare una nuova action `loadReportCalendars` con proprio store slice (`reportCalendar`) separato da `calendar`
- [ ] Il reducer `reportCalendar` include `loading: boolean` per permettere alla UI di mostrare lo stato di caricamento
- [ ] Il form `report-ticket` usa `loadReportCalendars` — non modifica più lo store `calendar` condiviso
- [ ] `ionViewWillEnter` attende `loading === false` su `CompanyState` prima di dispatchare `loadReportCalendars`
- [ ] Se `properties` è `undefined` dopo il caricamento (errore API), il fallback è `exclude_in_progress: false`
- [ ] `ReportCalendarEffects` usa il pattern `actions$.pipe(ofType, withLatestFrom(isLogged$), switchMap(inner.pipe(catchError)))` — NON replica il pattern outer-`switchMap` di `CalendarEffects`
- [ ] I test unitari per `report-ticket.component` coprono i due casi: flag caricato correttamente e fallback su errore API
- [ ] Le notifiche promemoria non vengono cancellate dopo l'apertura del form mancato ritiro

## Rischi

- **Duplicazione reducer/effects/selectors**: la separazione dello store introduce boilerplate. Mitigazione: il nuovo slice è minimale (`calendars`, `loading`, `error`).
- **`CompanyState.loading` parte a `false`**: teoricamente il form potrebbe aprirsi prima che `loadCompaniesData` venga dispatchato, usando subito il fallback. In pratica `loadCompaniesData` è dispatchato nel costruttore di `app.component.ts` prima di qualsiasi navigazione — rischio accettato e documentato.
- **Bug pre-esistente in `scheduleNotifications`**: se al resume lo store `calendar` è vuoto (app fredda), le notifiche vengono cancellate senza rischedularne. Non introdotto da questa feature — follow-up in ticket dedicato.
- **Regressione `CalendarPageComponent`**: usa ancora `loadCalendars` senza argomenti — non viene toccato, ma va verificato che il nuovo slice non interferisca con il selettore del calendario visivo.

## Out of scope

- Validazione server-side di `missed_withdraw_date` in `TicketController.php` (ticket backend dedicato)
- Fix typo `enableExludeInProgress` (richiede data migration + sync Nova)
- Deduplicazione `CompanyController`

## Moduli toccati

| File | Operazione |
|---|---|
| `projects/pap/src/app/features/report-ticket/report-ticket.component.ts` | Modifica: usa `loadReportCalendars`, attende `loading` |
| `projects/pap/src/app/features/report-ticket/state/report-calendar.actions.ts` | Nuovo |
| `projects/pap/src/app/features/report-ticket/state/report-calendar.reducer.ts` | Nuovo |
| `projects/pap/src/app/features/report-ticket/state/report-calendar.effects.ts` | Nuovo |
| `projects/pap/src/app/features/report-ticket/state/report-calendar.selectors.ts` | Nuovo |
| `projects/pap/src/app/features/report-ticket/report-ticket.module.ts` | Modifica: registra nuovo store slice |
| `projects/pap/src/app/features/report-ticket/report-ticket.component.spec.ts` | Modifica: aggiorna test |
| `projects/pap/src/app/core/core.state.ts` | Modifica: aggiunge `reportCalendar` all'`AppState` (se centralizzato) |
