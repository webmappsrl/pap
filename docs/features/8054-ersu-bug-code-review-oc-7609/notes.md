> Ticket: oc:8054

# Notes — [ersu] Bug code review oc:7609 — PAP

## Deviazioni dal piano

Nessuna deviazione. I 7 step del piano sono stati seguiti esattamente.

## Bug trovati

Nessun bug aggiuntivo scoperto durante l'implementazione.

## Decisioni

- **Pattern effects corretto vs. consistente**: il nuovo `ReportCalendarEffects` usa `withLatestFrom + catchError` inner invece del pattern outer-`switchMap` di `CalendarEffects`. Scelta consapevole: il pattern di `CalendarEffects` ha un bug latente (catchError outer termina lo stream); il nuovo file è l'occasione per farlo bene senza toccare il vecchio.
- **Registrazione in `core.module.ts`**: il nuovo slice `reportCalendar` è stato registrato in `core.module.ts` (non nel `ReportTicketModule`) per coerenza con tutti gli altri feature slice del progetto.

## Follow-up

- **Bug pre-esistente `scheduleNotifications`**: se al momento del `resume` lo store `calendar` è vuoto (app fredda, non ancora risposto), il `filter(p.calendars.length > 0)` non emette mai e le notifiche vengono cancellate senza rischedularne. Non introdotto da questa feature — ticket dedicato da aprire.
- **Pattern `CalendarEffects` da correggere**: il `catchError` in fondo all'outer pipe termina l'effect stream al primo errore HTTP. Da fixare in un ticket separato.
- **Bloccante 3 (validazione server-side `missed_withdraw_date`)**: esplicitamente out of scope — da gestire direttamente in portapporta con ticket backend dedicato.
- **Bloccante 4 (`stop_time` non parsabile in `filterExcludeInProgress`)**: da implementare nel repo portapporta con `wm-plan` separato.
