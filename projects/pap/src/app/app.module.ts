import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {IonicModule} from '@ionic/angular';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from './core/auth/auth.module';
import {CoreModule} from './core/core.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CoreModule,
    AppRoutingModule,
    IonicModule.forRoot({
      rippleEffect: false,
      mode: 'md',
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'it',
    }),
    AuthModule,
  ],
  bootstrap: [AppComponent],
  providers: [InAppBrowser],
})
export class AppModule {}
