import './webpack-public-path';
import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {TrashBookElementModule} from './app/elements/trash-book-element.module';
import {environment} from './environments/environment';
import {addIcons} from 'ionicons';

// Definizione del mapping delle icone personalizzate
const icons: { [key: string]: string } = {
  'arrow-back-outline': 'assets/svg/arrow-back-outline.svg',
  'checkmark-circle': 'assets/svg/checkmark-circle.svg',
  'information-circle': 'assets/svg/information-circle.svg',
  'close-circle': 'assets/svg/close-circle.svg'
};

// Configurazione delle icone personalizzate
addIcons(icons);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(TrashBookElementModule)
  .catch(err => console.error(err));
