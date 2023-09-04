import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {SignUpRoutingModule} from './sign-up-routing.module';
import {SignUpComponent} from './sign-up.component';

@NgModule({
  declarations: [SignUpComponent],
  imports: [SharedModule, SignUpRoutingModule],
})
export class SignUpModule {}
