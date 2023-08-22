import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {loadSignUps} from '../../core/auth/state/auth.actions';
import {error, selectAuthState} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {FormProvider} from '../../shared/form/form-provider';
import {loadUserTypes} from '../../shared/form/state/sign-up.actions';
import {loadConfiniZone} from '../../shared/map/state/map.actions';
export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: UntypedFormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl == null ||
      (matchingControl.errors && !matchingControl.errors['confirmedValidator'])
    ) {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: FormProvider, useExisting: SignUpComponent}],
})
export class SignUpComponent extends FormProvider implements OnDestroy {
  private _isLoggesSub: Subscription = Subscription.EMPTY;

  error$: Observable<string | false | undefined> = this._store.select(error);
  signUpForm: UntypedFormGroup;
  step$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    fb: UntypedFormBuilder,
    private _store: Store<AppState>,
    private _navCtrl: NavController,
  ) {
    super();
    this._store.dispatch(loadConfiniZone());
    this._store.dispatch(loadUserTypes());
    this.signUpForm = fb.group({
      firstStep: fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone_number: [null],
        user_code: [null],
        fiscal_code: [null],
      }),
      secondStep: fb.group(
        {
          password: ['', [Validators.required, Validators.minLength(8)]],
          password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
        },
        {
          validator: ConfirmedValidator('password', 'password_confirmation'),
        },
      ),
      thirdStep: fb.group({
        address: '',
        location: [[], [Validators.required]],
        user_type_id: ['', [Validators.required]],
        zone_id: ['', [Validators.required]],
      }),
    });
    this._isLoggesSub = this._store
      .pipe(
        select(selectAuthState),
        filter(v => v.isLogged),
      )
      .subscribe(val => {
        this._navCtrl.navigateRoot('home');
      });
  }

  getForm(): UntypedFormGroup {
    return this.signUpForm;
  }

  ngOnDestroy(): void {
    this._isLoggesSub.unsubscribe();
  }

  register() {
    const res = {
      ...this.signUpForm.controls['firstStep'].value,
      ...this.signUpForm.controls['secondStep'].value,
      ...this.signUpForm.controls['thirdStep'].value,
    };
    this._store.dispatch(loadSignUps(res));
  }
}
