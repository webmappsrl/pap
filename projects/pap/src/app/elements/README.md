# Gestione `__webpack_public_path__` per Angular Elements

## ⚡️ Sviluppo Locale

Durante lo sviluppo locale (test con `ionic serve --configuration=elements` o server statico), **imposta** il public path in questo modo:

```typescript
// projects/pap/src/webpack-public-path.ts
__webpack_public_path__ = '/';
```

In questo modo i chunk JS e CSS verranno caricati correttamente dalla root del server locale.

---

## 🚚 Preparazione per la consegna al cliente

Quando devi **consegnare il componente** al cliente (tutti i file in un'unica cartella `assets`):

1. **Modifica** il public path così:

    ```typescript
    // projects/pap/src/webpack-public-path.ts
    __webpack_public_path__ = '/assets/';
    ```

2. **Ricostruisci** la build con la configurazione `elements`:

    ```bash
    ionic build --configuration=elements
    ```

3. **Copia tutti i file JS e CSS generati** (chunk, main, polyfills, runtime, styles, ecc.) dalla cartella `dist/elements/` nella cartella `assets` del componente che consegni al cliente.

    - Esempio:  
      - `dist/elements/main.js` → `assets/main.js`
      - `dist/elements/runtime.js` → `assets/runtime.js`
      - `dist/elements/styles.css` → `assets/styles.css`
      - ...e così via per tutti i file generati

4. **Assicurati che l'HTML o il loader del cliente punti ai file nella cartella `assets/`**.

---

## 📝 Riepilogo

- **Per test locale:**  
  `__webpack_public_path__ = '/';`
- **Per consegna cliente:**  
  `__webpack_public_path__ = '/assets/';`  
  e copia tutti i file generati nella cartella `assets` del componente.

---

## ⚠️ Attenzione

- Ricordati di **modificare sempre** il valore di `__webpack_public_path__` in base all'ambiente (locale vs produzione/consegna).
- Se dimentichi di cambiare questo valore, i chunk JS/CSS non verranno caricati correttamente e l'app non funzionerà!
