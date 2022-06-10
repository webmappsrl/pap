import {NgModule} from '@angular/core';
import {SignUpRoutingModule} from './sign-up-routing.module';
import {SignUpComponent} from './sign-up.component';
import {SharedModule} from '../../shared/shared.module';
import {StoreModule} from '@ngrx/store';
import * as fromSignUp from './state/sign-up.reducer';
import {EffectsModule} from '@ngrx/effects';
import {SignUpEffects} from './state/sign-up.effects';
import {firstStepSignupComponent} from './steps/first-step.component';
import {secondStepSignupComponent} from './steps/second-step.component';
import {thirdStepSignupComponent} from './steps/third-step.component';

@NgModule({
  declarations: [
    SignUpComponent,
    firstStepSignupComponent,
    secondStepSignupComponent,
    thirdStepSignupComponent,
  ],
  imports: [
    SharedModule,
    SignUpRoutingModule,
    StoreModule.forFeature(fromSignUp.signUpFeatureKey, fromSignUp.reducer),
    EffectsModule.forFeature([SignUpEffects]),
  ],
})
export class SignUpModule {}
