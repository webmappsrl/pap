import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import * as fromLayout from './layout/state/layout.reducer';
import { EffectsModule } from '@ngrx/effects';
import { LayoutEffects } from './layout/state/layout.effects';
import { LayoutComponent } from './layout/layout.component';
import { environment } from '../../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers } from './core.state';
@NgModule({
  declarations: [LayoutComponent, ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    IonicModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forRoot(reducers, {}),
    EffectsModule.forRoot([LayoutEffects]),
    IonicModule.forRoot(),
  ],
  exports: [LayoutComponent, ],
})
export class CoreModule { }
