import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../../environments/environment';
import * as fromCalendar from '../features/calendar/state/calendar.reducer';
import {TrashBookEffects} from '../features/trash-book/state/trash-book.effects';
import * as fromTrashBook from '../features/trash-book/state/trash-book.reducer';
import * as fromMap from '../shared/map/state/map.reducer';
import {AuthInterceptor} from './auth.interceptor';
import {reducers} from './core.state';
import {LayoutComponent} from './layout/layout.component';
import {LayoutEffects} from './layout/state/layout.effects';
import {CalendarEffects} from '../features/calendar/state/calendar.effects';
import {MapEffects} from '../shared/map/state/map.effects';
import {PushNotificationEffects} from '../features/push-notification/state/push-notification.effects';
import * as fromPushnotification from '../features/push-notification/state/push-notification.reducer';
import {CompanyEffects} from '../shared/form/state/company.effects';
import * as fromCompany from '../shared/form/state/company.reducer';
import { ReportsEffects } from '../features/reports/state/reports.effects';
import * as fromReports from '../features/reports/state/reports.reducer';
@NgModule({
  declarations: [LayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    IonicModule.forRoot({
      rippleEffect: false,
      mode: 'md',
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forRoot(reducers, {}),
    StoreModule.forFeature(fromTrashBook.trashBookFeatureKey, fromTrashBook.reducer),
    StoreModule.forFeature(fromCalendar.calendarFeatureKey, fromCalendar.reducer),
    StoreModule.forFeature(fromTrashBook.trashBookFeatureKey, fromTrashBook.reducer),
    StoreModule.forFeature(fromMap.mapFeatureKey, fromMap.reducer),
    StoreModule.forFeature(fromMap.mapFeatureKey, fromMap.reducer),
    StoreModule.forFeature(
      fromPushnotification.pushNotificationFeatureKey,
      fromPushnotification.reducer,
    ),
    StoreModule.forFeature(fromCompany.companyFeatureKey, fromCompany.reducer),
    StoreModule.forFeature(fromReports.reportsFeatureKey, fromReports.reducer),
    EffectsModule.forRoot([
      LayoutEffects,
      TrashBookEffects,
      MapEffects,
      CalendarEffects,
      PushNotificationEffects,
      CompanyEffects,
      ReportsEffects,
    ]),
    IonicModule.forRoot({
      rippleEffect: false,
      mode: 'md',
    }),
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}],
  exports: [LayoutComponent],
})
export class CoreModule {}
