import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {LayoutEffects} from './layout/state/layout.effects';
import {LayoutComponent} from './layout/layout.component';
import {environment} from '../../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {reducers} from './core.state';
import {AuthInterceptor} from './auth.interceptor';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TrashBookEffects} from '../features/trash-book/state/trash-book.effects';
import * as fromTrashBook from '../features/trash-book/state/trash-book.reducer';
import * as fromMap from '../shared/map/state/map.reducer';
import {MapEffects} from '../shared/map/state/map.effects';
@NgModule({
  declarations: [LayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    IonicModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forRoot(reducers, {}),
    StoreModule.forFeature(fromTrashBook.trashBookFeatureKey, fromTrashBook.reducer),
    StoreModule.forFeature(fromMap.mapFeatureKey, fromMap.reducer),
    EffectsModule.forRoot([LayoutEffects, TrashBookEffects, MapEffects]),
    IonicModule.forRoot(),
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  exports: [LayoutComponent],
})
export class CoreModule {}
