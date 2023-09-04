import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';
import {IonicModule} from '@ionic/angular';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from './core/auth/auth.module';
import {CoreModule} from './core/core.module';

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
    AuthModule,
  ],
  bootstrap: [AppComponent],
  providers: [InAppBrowser],
})
export class AppModule {}
