> Ticket: oc:8045

# Notes — Race condition su geolocalizzazione GPS

## Deviazioni dal piano

Nessuna deviazione sul fix principale. Il piano prevedeva 2 file modificati; la suite di test ha richiesto 2 file aggiuntivi (vedi sezione Decisioni).

## Bug trovati

**Selector pollution preesistente** (`report-ticket.component.spec.ts`): il test chiamava `store.overrideSelector(selectCompanyProperties, ...)` senza `afterEach(() => store.resetSelectors())`. Il valore mockato persisteva globalmente sulla funzione selector (chiusura `overrideResult` in `defaultMemoize`). I nuovi test hanno cambiato qualcosa nella lifecycle del MockStore che ha esposto la fragilità: `company.selectors.spec.ts` ha iniziato a ricevere `{enableExludeInProgress: false}` (leftover del primo test di report-ticket) invece di `{true}`. Prima passava per puro accidente di ordinamento.

## Decisioni

**Scope esteso a `report-ticket.component.spec.ts` e `company.selectors.spec.ts`**: i 2 file non erano nel piano originale, ma la suite non poteva essere dichiarata verde senza fixare il pollution preesistente. Entrambi i fix seguono la best practice NgRx (`resetSelectors()` in `afterEach`, `clearResult()` in `beforeEach` per test che invocano il selector direttamente).

**Design test con `store.dispatch` spy**: il test non verifica solo l'outcome (zone_id/city) ma anche l'invariante di ordinamento — lo spy su `store.dispatch` aggiorna `overrideSelector` solo dopo il dispatch di `setMarker`, quindi il test fallisce se le righe vengono reinvertite. Questo fu scelto dopo la Challenge adversariale che evidenziò come test basati su solo `overrideSelector` non falsifichino la race condition.

## Follow-up

- **Double-tap GPS non-issue**: se l'utente preme GPS due volte rapidamente, entrambe le callback GPS restituiscono le stesse coordinate (utente da fermo). La zona calcolata è identica — non c'è corruzione di dati. Non richiede fix.
- **`try/catch` asincrono inutile**: il blocco `try/catch` in `getLocation()` cattura solo eccezioni sincrone; la callback di errore di `getCurrentPosition` (permesso GPS negato, GPS non disponibile) viene ignorata silenziosamente. Il form resta in stato indeterminato senza feedback. Bug preesistente, da indirizzare in ticket separato.
- **Sovrascrittura `zone_id` non serializzata**: in `setPosition()` ci sono due scritture su `zone_id` non serializzate — `currentZone$.pipe(take(1))` (sincrono) e `getAddress()` asincrono via `setAddress(res)`. Se `res.zone_id` è presente, può sovrascrivere il valore corretto impostato dal selector. Bug preesistente, da indirizzare in ticket separato.
