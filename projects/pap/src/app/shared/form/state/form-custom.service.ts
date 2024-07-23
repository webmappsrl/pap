import {Injectable} from '@angular/core';
import {FormJson} from '../model';
import {UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ConfirmedValidator} from '../../../features/sign-up/sign-up.component';

@Injectable({
  providedIn: 'root',
})
export class FormCustomService {
  createForm(fb: UntypedFormBuilder, formFields: FormJson[]): UntypedFormGroup {
    const formGroup = fb.group({});
    formFields.forEach(field => {
      if (field.type !== 'group') {
        const validators = this._getValidators(field);
        formGroup.addControl(field.id, fb.control('', validators));
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
