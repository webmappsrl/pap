import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import * as fromForm from './state/form.reducer';
import {EffectsModule} from '@ngrx/effects';
import {FormComponent} from './form/form.component';
import {LocationComponent} from './location/location.component';
import {RecapComponent} from './recap/recap.component';
import {PicturePickerComponent} from './picture-picker/picture-picker.component';
import {SharedModule} from '../shared.module';

@NgModule({
  declarations: [FormComponent, LocationComponent, RecapComponent, PicturePickerComponent],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature(fromForm.formFeatureKey, fromForm.reducer),
  ],
})
export class FormModule {}
