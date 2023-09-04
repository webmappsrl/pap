import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {SignInRoutingModule} from './sign-in-routing.module';
import {SignInComponent} from './sign-in.component';

@NgModule({
  declarations: [SignInComponent],
  imports: [SharedModule, SignInRoutingModule],
})
export class SignInModule {}
