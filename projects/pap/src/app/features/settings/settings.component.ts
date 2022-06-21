import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {BehaviorSubject, map, Observable, Subscription} from 'rxjs';
import {UpdateUser} from '../../core/auth/state/auth.actions';
import {error} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {FormProvider} from '../../shared/form/form-provider';
import {loadUserTypes} from '../../shared/form/state/sign-up.actions';
import {showButtons} from '../../shared/header/state/header.actions';
import {loadConfiniZone} from '../../shared/map/state/map.actions';
import {ConfirmedValidator} from '../sign-up/sign-up.component';
import {toggleEdit} from './state/settings.actions';
import {settingView} from './state/settings.selectors';

@Component({
  selector: 'pap-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: FormProvider, useExisting: SettingsComponent}],
})
export class SettingsComponent implements OnInit {
  settingsView$ = this._store.pipe(select(settingView));
  settingsForm: FormGroup;
  settingsFormSub: Subscription = Subscription.EMPTY;
  error$: Observable<string | false | undefined> = this._store.select(error);
  currentStep = 'firstStep';

  step$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private _store: Store<AppState>, fb: FormBuilder) {
    this._store.dispatch(loadConfiniZone());
    this._store.dispatch(loadUserTypes());
    this.settingsForm = fb.group({
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
    this.settingsFormSub = this.settingsView$.subscribe(sv => {
      this.settingsForm.controls['firstStep'].setValue({
        name: sv.user?.name ?? '',
        email: sv.user?.email ?? '',
      });
      this.settingsForm.controls['thirdStep'].setValue({
        location: sv.user?.location ?? undefined,
        zone_id: sv.user?.zone_id ?? undefined,
        user_type_id: sv.user?.user_type_id ?? undefined,
      });
    });
  }

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: false}));
  }

  edit(value: boolean) {
    this._store.dispatch(toggleEdit());
  }

  update() {
    let updates: {[key: string]: any} | null = {};
    switch (this.currentStep) {
      case 'firstStep':
        updates['name'] = this.settingsForm.controls['firstStep'].value['name'];
        break;
      case 'secondStep':
        updates = this.settingsForm.controls['secondStep'].value;
        this.settingsForm.controls['secondStep'].reset();
        break;
      case 'thirdStep':
        updates = this.settingsForm.controls['thirdStep'].value;
        break;
      default:
        updates = null;
        console.log('error');
    }
    if (updates != null) {
      this._store.dispatch(UpdateUser({updates}));
    }
  }
  isDisabled(): boolean {
    const ctrl = this.settingsForm.controls[this.currentStep];

    return !ctrl.valid;
  }
  getForm() {
    return this.settingsForm;
  }
}
