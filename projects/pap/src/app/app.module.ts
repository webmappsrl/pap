import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {EffectsModule} from '@ngrx/effects';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';
import { AuthModule } from './core/auth/auth.module';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, AppRoutingModule, IonicModule.forRoot(), HttpClientModule, AuthModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
