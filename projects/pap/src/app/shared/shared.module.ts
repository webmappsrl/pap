import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {HeaderComponent} from './header/header.component';
import * as fromHeader from './header/state/header.reducer';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ErrorFormHandlerComponent} from './error-form-handler/error-form-handler';
import {TranslateModule} from '@ngx-translate/core';
import {MapComponent} from './map/map.component';
import * as fromForm from './form/state/form.reducer';
import {FormComponent} from './form/form/form.component';
import {LocationComponent} from './form/location/location.component';
import {RecapComponent} from './form/recap/recap.component';
import {ImagePickerComponent} from './form/image-picker/image-picker.component';
import {InputTypePipe} from './form/input-type.pipe';
import {InputPatternPipe} from './form/input-pattern.pipe';
import {FormEffects} from './form/state/form.effects';
import {HeaderEffects} from './header/state/header.effects';
import {SelectComponent} from './form/select/select.component';
import {PapDatePipe} from './pipes/pap-date.pipe';
import {firstStepSignupComponent} from './form/steps/first-step.component';
import {secondStepSignupComponent} from './form/steps/second-step.component';
import {thirdStepSignupComponent} from './form/steps/third-step.component';
import * as fromSignUp from './form/state/sign-up.reducer';
import {SignUpEffects} from './form/state/sign-up.effects';
import {MenuComponent} from './menu/menu.component';
import {NotificationService} from './services/notification.service';
@NgModule({
  declarations: [
    HeaderComponent,
    MenuComponent,
    ErrorFormHandlerComponent,
    MapComponent,
    InputTypePipe,
    InputPatternPipe,
    FormComponent,
    firstStepSignupComponent,
    secondStepSignupComponent,
    thirdStepSignupComponent,
    LocationComponent,
    RecapComponent,
    ImagePickerComponent,
    SelectComponent,
    PapDatePipe,
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
  providers: [NotificationService],
  exports: [
    CommonModule,
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
    InputTypePipe,
    InputPatternPipe,
    FormComponent,
    LocationComponent,
    RecapComponent,
    ImagePickerComponent,
    SelectComponent,
    PapDatePipe,
    firstStepSignupComponent,
    secondStepSignupComponent,
    thirdStepSignupComponent,
  ],
})
export class SharedModule {}
