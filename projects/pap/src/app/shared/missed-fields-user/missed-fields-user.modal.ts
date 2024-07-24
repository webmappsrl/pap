import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {User} from '../../core/auth/auth.model';
import {BehaviorSubject, Subscription} from 'rxjs';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {FormJson} from '../form/model';
import {select, Store} from '@ngrx/store';
import {UpdateUser, UpdateUserSuccess} from '../../core/auth/state/auth.actions';
import {user} from '../../core/auth/state/auth.selectors';
import {Actions, ofType} from '@ngrx/effects';
import {FormCustomService} from '../form/state/form-custom.service';

@Component({
  selector: 'pap-missed-fields-user-modal',
  templateUrl: 'missed-fields-user.modal.html',
  styleUrls: ['./missed-fields-user.modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MissedFieldsUserModal {
  private _subscription: Subscription = new Subscription();

  @Input() set fields(formFields: FormJson[]) {
    this.fields$.next(formFields);
    this.missedForm = this._formCustomSvc.createForm(this._fb, formFields);
  }

  fields$: BehaviorSubject<FormJson[]> = new BehaviorSubject<FormJson[]>([]);
  missedForm: UntypedFormGroup;
  user$ = this._store.pipe(select(user));

  constructor(
    private _fb: UntypedFormBuilder,
    private _formCustomSvc: FormCustomService,
    private _store: Store,
    private _modalCtrl: ModalController,
    private _actions: Actions,
  ) {
    this._subscription.add(
      this._actions.pipe(ofType(UpdateUserSuccess)).subscribe(() => {
        this._modalCtrl.dismiss(null, 'ok');
      }),
    );
  }

  isRequired(field: FormJson): boolean {
    return this._formCustomSvc.isFieldRequired(field);
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  save(): void {
    const updates: Partial<User> = {form_data: this.missedForm.getRawValue()};
    this._store.dispatch(UpdateUser({updates}));
  }
}
