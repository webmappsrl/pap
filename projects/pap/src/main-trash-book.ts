import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {TrashBookElementModule} from './app/elements/trash-book-element.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(TrashBookElementModule)
  .catch(err => console.error(err));
