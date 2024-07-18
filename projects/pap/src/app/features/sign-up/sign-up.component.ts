import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {AbstractControl, FormControlOptions, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {loadSignUps} from '../../core/auth/state/auth.actions';
import {AppState} from '../../core/core.state';
import {FormProvider} from '../../shared/form/form-provider';
import {loadUserTypes} from '../../shared/form/state/sign-up.actions';
import {loadConfiniZone} from '../../shared/map/state/map.actions';
import { FormJson } from '../../shared/form/model';
import { selectFormJsonByStep } from '../../shared/form/state/form-fields.selectors';

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

  signUpForm: UntypedFormGroup;
  step$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    public fb: UntypedFormBuilder,
    private _store: Store<AppState>,
    private _navCtrl: NavController,
  ) {
    super();
    this._store.dispatch(loadConfiniZone());
    this._store.dispatch(loadUserTypes());
    this.signUpForm = fb.group({
      firstStep: this.fb.group({}),
      secondStep: this.fb.group({}),
      thirdStep: fb.group({
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        house_number: ['', [Validators.required]],
        zone_id: ['', [Validators.required]],
        user_type_id: ['', [Validators.required]],
        location: [[], [Validators.required]],
      }),
    });

    this._store.select(selectFormJsonByStep(1)).pipe(take(1)).subscribe(formJson => {
      console.log('subscribe step 1: ', formJson);
      if (formJson) {
        const firstStep = this._createForm(formJson);
        this.signUpForm.setControl('firstStep', firstStep);
      }
    })
    this._store.select(selectFormJsonByStep(2)).pipe(take(1)).subscribe(formJson => {
      console.log('subscribe step 2: ', formJson);
      if (formJson) {
        const secondStep = this._createForm(formJson);
        this.signUpForm.setControl('secondStep', secondStep);
      }
    })
  }

  getForm(): UntypedFormGroup {
    return this.signUpForm;
  }

  isFieldRequired(field: FormJson): boolean {
    return field.validators?.some(validator => validator.name === 'required') ?? false;
  }

  ngOnDestroy(): void {
    this._isLoggesSub.unsubscribe();
  }

  register(): void {
    const res = {
      ...this.signUpForm.controls['firstStep'].value,
      ...this.signUpForm.controls['secondStep'].value,
      ...this.signUpForm.controls['thirdStep'].value,
    };
    this._store.dispatch(loadSignUps({data: res}));
  }

  private _createForm(formFields: FormJson[]): UntypedFormGroup {
    const formGroup = this.fb.group({});
    formFields.forEach(field => {
      if (field.type !== 'group') {
        const validators = this._getValidators(field);
        formGroup.addControl(field.id, this.fb.control('', validators));
      }
    });

    formFields.forEach(field => {
      if (field.type === 'group' && field.customValidator) {
        const customValidator = this._getCustomValidator(field.customValidator);
        formGroup.setValidators(customValidator);
      }
    });

    return formGroup;
  }

  private _getCustomValidator(customValidator: { name: string, args: string[] }) {
    switch (customValidator.name) {
      case 'confirmedValidator':
        return ConfirmedValidator(customValidator.args[0], customValidator.args[1]);
      default:
        return ConfirmedValidator(customValidator.args[0], customValidator.args[1]);;
    }
  }

  private _getValidators(field: FormJson): ValidatorFn[] {
    const validators:  ValidatorFn[] = [];
    if (field.validators) {
      field.validators.forEach(validator => {
        switch (validator.name) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'email':
            validators.push(Validators.email);
            break;
          case 'minLength':
            validators.push(Validators.minLength(validator.value));
            break;
          // Aggiungi altri validatori personalizzati qui se necessario
        }
      });
    }
    return validators;
  }
}

export function ConfirmedValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (control && matchingControl && control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
      return { confirmedValidator: true };
    } else {
      if (matchingControl) {
        matchingControl.setErrors(null);
      }
      return null;
    }
  };
}

export function isFieldRequired(field: FormJson): boolean {
  return field.validators?.some(validator => validator.name === 'required') ?? false;
}
