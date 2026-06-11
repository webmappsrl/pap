> Ticket: oc:8045

# Plan — Race condition su geolocalizzazione GPS

## Step 1 — Crea branch

```bash
git checkout -b fix/oc-8045-race-condition-gps
```

---

## Step 2 — Fix `location.component.ts`

**File:** `projects/pap/src/app/shared/form/location/location.component.ts`

Nella callback di `getLocation()` (righe 104–108), invertire le due righe: dispatchare `setMarker` **prima** di chiamare `setPosition`.

**Prima (ordine errato):**
```ts
navigator.geolocation.getCurrentPosition(location => {
  const coords = [location.coords.longitude, location.coords.latitude] as [number, number];
  this.setPosition(coords);
  this._store.dispatch(setMarker({coords}));
});
```

**Dopo (ordine corretto):**
```ts
navigator.geolocation.getCurrentPosition(location => {
  const coords = [location.coords.longitude, location.coords.latitude] as [number, number];
  this._store.dispatch(setMarker({coords}));
  this.setPosition(coords);
});
```

---

## Step 3 — Aggiungi test in `location.component.spec.ts`

**File:** `projects/pap/src/app/shared/form/location/location.component.spec.ts`

Aggiungere un nuovo blocco `describe('getLocation()')` dopo il blocco `describe('setAddress() con "altro"')` esistente.

I test usano `spyOn(store, 'dispatch').and.callFake(...)` per aggiornare `overrideSelector` solo dopo che `setMarker` viene dispatchato — così il test **fallisce** se le righe vengono reinvertite (perché `currentZone$` sarebbe ancora `null` al momento della lettura).

```ts
describe('getLocation()', () => {
  beforeEach(() => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((cb: any) => {
      cb({coords: {longitude: 11.25, latitude: 43.77}});
    });
  });

  it('non produce errore spurio quando non esiste un marker precedente (Caso 2)', async () => {
    store.overrideSelector(currentZone as any, null);
    store.refreshState();

    spyOn(store, 'dispatch').and.callFake((action: any) => {
      if (action.type === '[Map] set current marker') {
        store.overrideSelector(currentZone as any, mockZone);
        store.refreshState();
      }
    });

    await component.getLocation();

    expect(component.form.get('location')!.errors).toBeNull();
    expect(component.form.get('zone_id')!.value).toBe(42);
  });

  it('usa zone_id e city delle coordinate GPS nuove, non del marker precedente (Caso 1)', async () => {
    const oldZone = {
      type: 'Feature',
      geometry: {coordinates: [], type: 'MultiPolygon'},
      properties: {id: 99, comune: 'Vecchio', availableUserTypes: [], types: [], url: ''},
    };
    store.overrideSelector(currentZone as any, oldZone);
    store.refreshState();

    spyOn(store, 'dispatch').and.callFake((action: any) => {
      if (action.type === '[Map] set current marker') {
        store.overrideSelector(currentZone as any, mockZone);
        store.refreshState();
      }
    });

    await component.getLocation();

    expect(component.form.get('zone_id')!.value).toBe(42);
    expect(component.form.get('city')!.value).toBe('Firenze');
  });
});
```

---

## Step 4 — Verifica test

```bash
npm run test:ci
```

Tutti i test devono passare, inclusi i due nuovi.

---

## Step 5 — Scrivi `notes.md`

Creare `docs/features/8045-race-condition-gps/notes.md` con le deviazioni e i follow-up emersi dalla Challenge.

---

## Step 6 — Aggiorna `CLAUDE.md`

Aggiornare le sezioni "Feature disponibili" e "Decisioni architetturali" del `CLAUDE.md` radice.

---

## Step 7 — Commit e PR

```bash
git add projects/pap/src/app/shared/form/location/location.component.ts
git add projects/pap/src/app/shared/form/location/location.component.spec.ts
git add docs/features/8045-race-condition-gps/
```

Commit message:
```
fix(oc:8045): correggi race condition GPS in getLocation() — dispatch setMarker prima di setPosition

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Aprire PR verso **`develop`**.
