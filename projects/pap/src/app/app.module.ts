import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';
import {AuthModule} from './core/auth/auth.module';
import {InAppBrowser} from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, AppRoutingModule, IonicModule.forRoot(), HttpClientModule, AuthModule],
  bootstrap: [AppComponent],
  providers: [InAppBrowser],
})
export class AppModule {}
