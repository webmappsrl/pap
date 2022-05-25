import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {loadSignUps} from '../../core/auth/state/auth.actions';
import {error, selectAuthState} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({confirmedValidator: true});
    } else {
      matchingControl.setErrors(null);
    }
  };
}
@Component({
  selector: 'pap-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignUpComponent {
  signUpForm: FormGroup;
  error$: Observable<string | false | undefined> = this._store.select(error);
  constructor(fb: FormBuilder, private _store: Store<AppState>, private _navCtrl: NavController) {
    this.signUpForm = fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: ConfirmedValidator('password', 'password_confirmation'),
      },
    );
    this._store.pipe(select(selectAuthState)).subscribe(val => {
      if (val.isLogged) {
        this._navCtrl.navigateRoot('home');
      }
    });
  }

  register(value: any) {
    this._store.dispatch(loadSignUps(value));
  }
}
