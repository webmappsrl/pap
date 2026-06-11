> Ticket: oc:8045

# Race condition su geolocalizzazione GPS: zone_id e comune errati o errore spurio

## Cosa cambia

`getLocation()` in `location.component.ts` dispatcha `setMarker` **prima** di chiamare `setPosition`, allineandosi all'ordine già corretto usato dal flusso click-su-mappa.

## Perché

`setPosition()` legge `currentZone$` con `take(1)` in modo sincrono: al momento della lettura il selector calcola la zona sulle coordinate di `currentMarkerCoords` presenti nello store. Con il vecchio ordine, `setMarker` non era ancora stato dispatchato, quindi la zona veniva calcolata sulle coordinate del marker precedente (Caso 1) o su coordinate vuote/`[0,0]` (Caso 2), causando rispettivamente dato corrotto silenzioso o errore spurio che bloccava il form.

## Requisiti

- [ ] In `getLocation()`, `dispatch(setMarker({coords}))` viene eseguito **prima** di `setPosition(coords)`
- [ ] Test unitario: `getLocation()` con marker iniziale vuoto non produce errore `incorrect` sul campo `location` (Caso 2 — errore spurio); il test usa spy su `store.dispatch` per aggiornare `overrideSelector` solo dopo il dispatch di `setMarker`, così fallisce se le righe vengono reinvertite
- [ ] Test unitario: `getLocation()` con marker precedente in zona diversa imposta `zone_id` e `city` dalle coordinate GPS nuove, non da quelle vecchie (Caso 1 — dato corrotto silenzioso); stesso pattern di spy

## Rischi

- **Nessuna regressione su `mapClick()`**: `mapClick()` chiama già solo `setPosition()` senza dispatchare `setMarker` — il dispatch arriva da `clickOnMap` in `map.component.ts` prima che venga emesso `genericClickEvt`. Il fix non tocca questo flusso.
- **`take(1)` sincrono**: il fix funziona perché NgRx aggiorna lo stato dello store sincronamente al dispatch. Se in futuro il reducer diventasse asincrono, il contratto di ordinamento andrebbe rivisto. I test fissano questo comportamento atteso.

## Out of scope

- Refactoring di `mapClick()` per aggiungere il dispatch (il contratto attuale è corretto, garantito dai test)
- Modifiche a `map.component.ts` o ad altri componenti
- Aggiunta di commenti inline per documentare il contratto di ordinamento

## Moduli toccati

| File | Azione |
|---|---|
| `projects/pap/src/app/shared/form/location/location.component.ts` | swap 2 righe in `getLocation()` (riga 106–107) |
| `projects/pap/src/app/shared/form/location/location.component.spec.ts` | aggiunta `describe('getLocation()')` con 2 test |
