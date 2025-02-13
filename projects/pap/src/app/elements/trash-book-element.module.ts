import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {BrowserModule} from '@angular/platform-browser';
import {TrashBookElementComponent} from './trash-book-element.component';
import {IonicModule} from '@ionic/angular';
import {SharedModule} from '../shared/shared.module';
import {CoreModule} from '../core/core.module';
@NgModule({
  declarations: [TrashBookElementComponent],
  imports: [
    BrowserModule,
    IonicModule,
    SharedModule,
    CoreModule,
  ],
  entryComponents: [TrashBookElementComponent],
})
export class TrashBookElementModule {
  constructor(injector: Injector) {
    const trashBookElement = createCustomElement(TrashBookElementComponent, {injector});
    customElements.define('trash-book-element', trashBookElement);
  }

  ngDoBootstrap() {}
}
