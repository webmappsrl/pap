import {
  FormGroup,
  FormBuilder,
  Validators,
  UntypedFormBuilder,
  UntypedFormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import {FormJson} from './model';
import {User} from '../../core/auth/auth.model';

export abstract class BaseCustomForm {
  private _directUserFields: string[] = ['name', 'email', 'password', 'password_confirmation'];

  get directUserFields(): string[] {
    return this._directUserFields;
  }

  form: FormGroup;

  constructor(protected fb: FormBuilder) {}

  ConfirmedValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (control && matchingControl && control.value !== matchingControl.value) {
        matchingControl.setErrors({confirmedValidator: true});
        return {confirmedValidator: true};
      } else {
        if (matchingControl) {
          matchingControl.setErrors(null);
        }
        return null;
      }
    };
  }

  createForm(fb: UntypedFormBuilder, formFields: FormJson[], user?: User): UntypedFormGroup {
    const formGroup = fb.group({});
    formFields.forEach(field => {
      if (field.type !== 'group') {
        const validators = this._getValidators(field);
        const value = user
          ? ((user[field.name as keyof User] as any) ?? user.form_data?.[field.name] ?? '')
          : '';
        formGroup.addControl(field.name, fb.control(value, validators));
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

  isFieldRequired(field: FormJson): boolean {
    return field.rules?.some(rule => rule.name === 'required') ?? false;
  }

  private _getCustomValidator(customValidator: {name: string; args: string[]}) {
    switch (customValidator.name) {
      case 'confirmedValidator':
        return this.ConfirmedValidator(customValidator.args[0], customValidator.args[1]);
      default:
        return this.ConfirmedValidator(customValidator.args[0], customValidator.args[1]);
    }
  }

  private _getValidators(field: FormJson): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
    if (field.rules) {
      field.rules.forEach(rule => {
        switch (rule.name) {
          case 'required':
            validators.push(Validators.required);
            break;
          case 'email':
            validators.push(Validators.email);
            break;
          case 'minLength':
            validators.push(Validators.minLength(rule.value));
            break;
        }
      });
    }
    return validators;
  }
}
