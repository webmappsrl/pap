import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromForm from './state/form.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FormEffects } from './state/form.effects';
import { FormComponent } from './form/form.component';
import { LocationComponent } from './location/location.component';
import { RecapComponent } from './recap/recap.component';
import { PicturePickerComponent } from './picture-picker/picture-picker.component';



@NgModule({
  declarations: [
    FormComponent,
    LocationComponent,
    RecapComponent,
    PicturePickerComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromForm.formFeatureKey, fromForm.reducer),
    EffectsModule.forFeature([FormEffects])
  ]
})
export class FormModule { }
