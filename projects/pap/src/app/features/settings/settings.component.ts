import {BehaviorSubject, Observable, Subscription, map} from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store, select} from '@ngrx/store';
import {UpdateUser, deleteUser, logout} from '../../core/auth/state/auth.actions';

import {AlertController} from '@ionic/angular';
import {AppState} from '../../core/core.state';
import {ConfirmedValidator} from '../sign-up/sign-up.component';
import {FormProvider} from '../../shared/form/form-provider';
import {error} from '../../core/auth/state/auth.selectors';
import {settingView} from './state/settings.selectors';
import {showButtons} from '../../shared/header/state/header.actions';
import {switchMap} from 'rxjs/operators';
import {toggleEdit} from './state/settings.actions';

@Component({
  selector: 'pap-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: FormProvider, useExisting: SettingsComponent}],
})
export class SettingsComponent implements OnInit, OnDestroy {
  currentStep = 'firstStep';
  error$: Observable<string | false | undefined> = this._store.select(error);
  settingsForm: FormGroup;
  private _settingsFormSub: Subscription = Subscription.EMPTY;
  settingsView$ = this._store.pipe(select(settingView));
  step$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _alertSub: Subscription = Subscription.EMPTY;
  private _alertEVT: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private _alertCtrl: AlertController,
    private _store: Store<AppState>,
    fb: FormBuilder,
  ) {
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
    this._settingsFormSub = this.settingsView$.subscribe(sv => {
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

    this._alertSub = this._alertEVT
      .pipe(
        switchMap(_ =>
          this._alertCtrl.create({
            header: 'Vuoi eliminare il tuo account?',
            message: 'questa operazione è irreversibile una volta eseguita',
            buttons: [
              {
                text: 'ok',
                role: 'ok',
              },
              {
                text: 'annulla',
                role: 'annulla',
              },
            ],
          }),
        ),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
      )
      .subscribe(val => {
        if (val != null && val.role != null && val.role === 'ok') {
          this._store.dispatch(deleteUser());
          setTimeout(() => {
            this._store.dispatch(logout());
          }, 300);
        }
      });
  }

  delete(): void {
    this._alertEVT.emit();
  }

  edit(value: boolean) {
    this._store.dispatch(toggleEdit());
  }

  getForm() {
    return this.settingsForm;
  }

  isDisabled(): boolean {
    const ctrl = this.settingsForm.controls[this.currentStep];

    return !ctrl.valid;
  }

  ngOnDestroy(): void {
    this._settingsFormSub.unsubscribe();
    this._alertSub.unsubscribe();
  }

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: false}));
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
}
