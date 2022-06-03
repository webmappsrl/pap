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
import {PicturePickerComponent} from './form/picture-picker/picture-picker.component';
import {InputTypePipe} from './form/input-type.pipe';
import {InputPatternPipe} from './form/input-pattern.pipe';
import {FormEffects} from './form/state/form.effects';

@NgModule({
  declarations: [
    HeaderComponent,
    ErrorFormHandlerComponent,
    MapComponent,
    FormComponent,
    LocationComponent,
    RecapComponent,
    PicturePickerComponent,
    InputTypePipe,
    InputPatternPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    HttpClientModule,
    StoreModule.forFeature(fromHeader.headerFeatureKey, fromHeader.reducer),
    StoreModule.forFeature(fromForm.ticketFeatureKey, fromForm.reducer),
    EffectsModule.forFeature([FormEffects]),
    TranslateModule.forRoot(),
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    HeaderComponent,
    MapComponent,
    FormComponent,
    RecapComponent,
    ErrorFormHandlerComponent,
    TranslateModule,
    InputTypePipe,
    InputPatternPipe,
  ],
})
export class SharedModule {}
