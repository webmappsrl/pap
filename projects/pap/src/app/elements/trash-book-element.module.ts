import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {BrowserModule} from '@angular/platform-browser';
import {TrashBookComponent} from './trash-book.component';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {reducers} from '../core/core.state';
import {IonicModule} from '@ionic/angular';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [TrashBookComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    IonicModule,
    SharedModule,
  ],
  entryComponents: [TrashBookComponent],
})
export class TrashBookElementModule {
  constructor(injector: Injector) {
    const trashBookElement = createCustomElement(TrashBookComponent, {injector});
    customElements.define('trash-book-element', trashBookElement);
  }

  ngDoBootstrap() {}
}
