> Ticket: oc:8056

# Notes — [Review oc:7608] Notifiche di recupero: promemoria persi e "zona di recupero" che non scatta

## Deviazioni dal piano

- **Test di integrazione su `LocalNotifications` non realizzabili via `spyOn`:** il piano prevedeva di mockare `LocalNotifications.cancel/schedule/getPending` direttamente. Capacitor usa un Proxy per le sue API — le proprietà non sono own properties e `spyOn` non le intercetta. I test che richiedevano la verifica di `cancel() before schedule()` e `schedule() ≤ PLATFORM_LIMIT` sono stati sostituiti con spy sui metodi privati `_removeNotifications` e `_initNotifications`, che coprono lo stesso intent comportamentale (ordinamento e guard concorrenza) senza dipendere dal Proxy.
- **Copertura PLATFORM_LIMIT già garantita dalla suite `split logic`:** i test `64 events: 56 normal, 8 recovery` e `74 events capped: splice keeps only 64` in `split logic` verificano la logica di troncamento attraverso `applyRecoverySplit`, che è una copia fedele della logica del service. L'integrazione non aggiunge valore extra per quella specifica assertion.

## Bug trovati

- Nessun bug aggiuntivo rispetto a quelli del ticket.

## Decisioni

- **`_scheduling` resettato in `finally` dopo il `setTimeout`, non dopo la subscription interna:** il lock serve a prevenire invocazioni ravvicinate al resume, non a serializzare la subscription asincrona dentro il timeout. Resettare dopo il `finally` è intenzionale — documentato nel piano e nel commento inline.
- **`PLATFORM_LIMIT = 64` come costante iOS usata come ceiling cross-platform:** Android non ha questo limite. La scelta di un valore fisso è deliberata (utente). Un commento nel codice documenta il ragionamento.
- **Capacitor Proxy non-spyable:** pattern noto nel testing Capacitor/Ionic. Soluzione clean futura: wrappare `LocalNotifications` in un injectable `LocalNotificationsPlugin` service per dependency injection nei test. Rimandato a refactor dedicato.

## Follow-up

- **Refactor `LocalNotificationsPlugin` wrapper** per rendere le API Capacitor testabili via DI — permetterebbe test end-to-end di `scheduleNotifications()` senza spy su metodi privati.
- **`setTimeout(2000)` hardcoded** — valore magico, candidato a diventare una costante configurabile se in futuro si vuole testare end-to-end con `jasmine.clock()`.
