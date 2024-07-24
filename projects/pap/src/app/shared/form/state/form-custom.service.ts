import {Injectable} from '@angular/core';
import {FormJson} from '../model';
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ConfirmedValidator} from '../../../features/sign-up/sign-up.component';
import {User} from '../../../core/auth/auth.model';

@Injectable({
  providedIn: 'root',
})
export class FormCustomService {
  private _directUserFields: string[] = ['name', 'email', 'password', 'password_confirmation'];

  get directUserFields(): string[] {
    return this._directUserFields;
  }

  createForm(fb: UntypedFormBuilder, formFields: FormJson[], user?: User): UntypedFormGroup {
    const formGroup = fb.group({});
    formFields.forEach(field => {
      if (field.type !== 'group') {
        const validators = this._getValidators(field);
        const value = user
          ? ((user[field.id as keyof User] as any) ?? user.form_data?.[field.id] ?? '')
          : '';
        formGroup.addControl(field.id, fb.control(value, validators));
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
    return field.validators?.some(validator => validator.name === 'required') ?? false;
  }

  private _getCustomValidator(customValidator: {name: string; args: string[]}) {
    switch (customValidator.name) {
      case 'confirmedValidator':
        return ConfirmedValidator(customValidator.args[0], customValidator.args[1]);
      default:
        return ConfirmedValidator(customValidator.args[0], customValidator.args[1]);
    }
  }

  private _getValidators(field: FormJson): ValidatorFn[] {
    const validators: ValidatorFn[] = [];
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
