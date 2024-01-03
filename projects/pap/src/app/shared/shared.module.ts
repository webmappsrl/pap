import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {CalendarComponent} from './components/calendar/calendar.component';
import {ErrorFormHandlerComponent} from './error-form-handler/error-form-handler';
import {FooterComponent} from './footer/footer.component';
import {CalendarSelectComponent} from './form/calendar-select/calendar-select.component';
import {FormComponent} from './form/form/form.component';
import {GetZoneFromLocationPipe} from './form/get-zone-from-location.pipe';
import {ImagePickerComponent} from './form/image-picker/image-picker.component';
import {InputPatternPipe} from './form/input-pattern.pipe';
import {InputTypePipe} from './form/input-type.pipe';
import {LocationComponent} from './form/location/location.component';
import {LocationModalComponent} from './form/location/location.modal';
import {RecapComponent} from './form/recap/recap.component';
import {SelectComponent} from './form/select/select.component';
import {FormEffects} from './form/state/form.effects';
import * as fromForm from './form/state/form.reducer';
import {SignUpEffects} from './form/state/sign-up.effects';
import * as fromSignUp from './form/state/sign-up.reducer';
import {FormStatusComponent} from './form/status/status.component';
import {firstStepSignupComponent} from './form/steps/first-step.component';
import {secondStepSignupComponent} from './form/steps/second-step.component';
import {thirdStepSignupComponent} from './form/steps/third-step-signup.component';
import {thirdStepComponent} from './form/steps/third-step.component';
import {HeaderComponent} from './header/header.component';
import {HeaderEffects} from './header/state/header.effects';
import * as fromHeader from './header/state/header.reducer';
import {MapComponent} from './map/map.component';
import {MenuComponent} from './menu/menu.component';
import {FilterByPipe} from './pipes/filter-by.pipe';
import {PapDatePipe} from './pipes/pap-date.pipe';
import {PapLangPipe} from './pipes/pap-lang.pipe';
import {PapTicketPipe} from './pipes/pap-ticket.pipe';
import {SortPipe} from './pipes/sort.pipe';
import {BroadcastNotificationService} from './services/broadcast-notification.service';
import {LocalNotificationService} from './services/local-notification.service';
import {DateComponent} from './components/date/date.component';
import {RecapRowComponent} from './form/recap/recap-row/recap-row.component';
import {addr2StringPipe} from './pipes/addr-2-string.pipe';
import {AddressSelectorComponent} from './components/address-selector/address-selector.component';
import {papAddressesFromCalendars} from './pipes/pap-addresses-from-calendars';
const pipes = [
  InputTypePipe,
  InputPatternPipe,
  PapTicketPipe,
  PapDatePipe,
  PapLangPipe,
  SortPipe,
  FilterByPipe,
  addr2StringPipe,
  GetZoneFromLocationPipe,
  papAddressesFromCalendars,
];
@NgModule({
  declarations: [
    AddressSelectorComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    ErrorFormHandlerComponent,
    MapComponent,
    FormComponent,
    firstStepSignupComponent,
    secondStepSignupComponent,
    thirdStepComponent,
    thirdStepSignupComponent,
    LocationComponent,
    LocationModalComponent,
    FormStatusComponent,
    RecapComponent,
    RecapRowComponent,
    ImagePickerComponent,
    SelectComponent,
    CalendarSelectComponent,
    CalendarComponent,
    DateComponent,
    ...pipes,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    HttpClientModule,
    StoreModule.forFeature(fromHeader.headerFeatureKey, fromHeader.reducer),
    EffectsModule.forFeature([HeaderEffects]),
    StoreModule.forFeature(fromForm.ticketFeatureKey, fromForm.reducer),
    EffectsModule.forFeature([FormEffects]),
    StoreModule.forFeature(fromSignUp.signUpFeatureKey, fromSignUp.reducer),
    EffectsModule.forFeature([SignUpEffects]),
    TranslateModule.forRoot(),
  ],
  providers: [LocalNotificationService, BroadcastNotificationService],
  exports: [
    CommonModule,
    DateComponent,
    FooterComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    HeaderComponent,
    MapComponent,
    MenuComponent,
    ErrorFormHandlerComponent,
    TranslateModule,
    FormComponent,
    LocationComponent,
    RecapComponent,
    RecapRowComponent,
    FormStatusComponent,
    ImagePickerComponent,
    SelectComponent,
    firstStepSignupComponent,
    secondStepSignupComponent,
    thirdStepComponent,
    thirdStepSignupComponent,
    CalendarSelectComponent,
    CalendarComponent,
    LocationModalComponent,
    AddressSelectorComponent,
    ...pipes,
  ],
})
export class SharedModule {}
