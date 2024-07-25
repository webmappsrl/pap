import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {loadSignUps} from '../../core/auth/state/auth.actions';
import {AppState} from '../../core/core.state';
import {loadUserTypes} from '../../shared/form/state/sign-up.actions';
import {loadConfiniZone} from '../../shared/map/state/map.actions';
import {selectFormJsonByStep} from '../../shared/form/state/company.selectors';
import {BaseCustomForm} from '../../shared/form/base-custom-form.component';

@Component({
  selector: 'pap-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent extends BaseCustomForm implements OnDestroy {
  private _isLoggesSub: Subscription = Subscription.EMPTY;

  signUpForm: UntypedFormGroup;
  step$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    fb: UntypedFormBuilder,
    private _store: Store<AppState>,
    private _navCtrl: NavController,
  ) {
    super(fb);
    this._store.dispatch(loadConfiniZone());
    this._store.dispatch(loadUserTypes());
    this.signUpForm = fb.group({
      thirdStep: fb.group({
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        house_number: ['', [Validators.required]],
        zone_id: ['', [Validators.required]],
        user_type_id: ['', [Validators.required]],
        location: [[], [Validators.required]],
      }),
    });

    this._store
      .select(selectFormJsonByStep(1))
      .pipe(take(1))
      .subscribe(formJson => {
        if (formJson) {
          const firstStep = this.createForm(fb, formJson);
          this.signUpForm.setControl('firstStep', firstStep);
        }
      });
    this._store
      .select(selectFormJsonByStep(2))
      .pipe(take(1))
      .subscribe(formJson => {
        if (formJson) {
          const secondStep = this.createForm(fb, formJson);
          this.signUpForm.setControl('secondStep', secondStep);
        }
      });
  }

  getForm(): UntypedFormGroup {
    return this.signUpForm;
  }

  ngOnDestroy(): void {
    this._isLoggesSub.unsubscribe();
  }

  register(): void {
    const allValues = {
      ...this.signUpForm.controls['firstStep'].value,
      ...this.signUpForm.controls['secondStep'].value,
    };
    const {name, email, password, password_confirmation, ...rest} = allValues;
    const res = {
      name,
      email,
      password,
      password_confirmation,
      form_data: rest,
      ...this.signUpForm.controls['thirdStep'].value,
    };
    this._store.dispatch(loadSignUps({data: res}));
  }
}
