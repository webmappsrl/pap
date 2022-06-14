import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, filter, Observable, Subscription, switchMap} from 'rxjs';
import {loadSignUps} from '../../core/auth/state/auth.actions';
import {error, selectAuthState} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {loadConfiniZone} from '../../shared/map/state/map.actions';
import {FormProvider} from '../../shared/form/form-provider';
import {loadUserTypes} from '../../shared/form/state/sign-up.actions';
export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
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
  signUpForm: FormGroup;
  step$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    fb: FormBuilder,
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
  ) {
    super();
    this._store.dispatch(loadConfiniZone());
    this._store.dispatch(loadUserTypes());
    this.signUpForm = fb.group({
      firstStep: fb.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
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
        location: ['', [Validators.required]],
        user_type_id: ['', [Validators.required]],
        zone_id: [''],
      }),
    });
    this._isLoggesSub = this._store
      .pipe(
        select(selectAuthState),
        filter(v => v.isLogged),
        switchMap(_ =>
          this._alertCtrl.create({
            header: 'Registrazione avvenuta con successo',
            message:
              'Gentile utente ti abbiamo inviato una email per consentirci di verificare la email con cui ti sei registrato',
            buttons: ['ok'],
          }),
        ),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
      )
      .subscribe(val => {
        this._navCtrl.navigateRoot('home');
      });
  }

  getForm() {
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
