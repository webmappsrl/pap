import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {StoreModule} from '@ngrx/store';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from './core/auth/auth.module';
import {DateFnsConfigurationService, DateFnsModule} from 'ngx-date-fns';
import {it} from 'date-fns/locale';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';

const italianConfig = new DateFnsConfigurationService();
italianConfig.setLocale(it);

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    AppRoutingModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AuthModule,
    DateFnsModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [InAppBrowser, {provide: DateFnsConfigurationService, useValue: italianConfig}],
})
export class AppModule {}
