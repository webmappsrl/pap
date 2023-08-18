import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {Store, select} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {UpdateUser, deleteUser, loadAuths, logout} from '../../core/auth/state/auth.actions';

import {AlertController, ModalController, NavController} from '@ionic/angular';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {error} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {FormProvider} from '../../shared/form/form-provider';
import {showButtons} from '../../shared/header/state/header.actions';
import {ConfirmedValidator} from '../sign-up/sign-up.component';
import {loadCalendarSettings, toggleEdit} from './state/settings.actions';
import {settingView} from './state/settings.selectors';
import {confiniZone} from '../../shared/map/state/map.selectors';
import {LocationModalComponent} from '../../shared/form/location/location.modal';
import {SettingsService} from './state/settings.service';

@Component({
  selector: 'pap-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: FormProvider, useExisting: SettingsComponent}],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private _alertEVT: EventEmitter<void> = new EventEmitter<void>();
  private _alertSub: Subscription = Subscription.EMPTY;
  private _settingsFormSub: Subscription = Subscription.EMPTY;

  error$: Observable<string | false | undefined> = this._store.select(error);
  settingsForm: UntypedFormGroup;
  settingsView$ = this._store.pipe(select(settingView));
  currentStep$: BehaviorSubject<string> = new BehaviorSubject<string>('firstStep');
  confiniZone$: Observable<any> = this._store.select(confiniZone);
  private _addressFormArray: UntypedFormArray = this._formBuilder.array([]);
  constructor(
    private _alertCtrl: AlertController,
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _modalCtrl: ModalController,
    private _formBuilder: FormBuilder,
    private _settingsSvc: SettingsService,
    private _cdr: ChangeDetectorRef,
    fb: UntypedFormBuilder,
  ) {
    this._settingsFormSub = this.settingsView$.subscribe(sv => {
      try {
        (sv.user?.addresses ?? []).forEach(address => {
          this._addressFormArray.push(
            fb.group({
              address: new FormControl(address.address, Validators.required),
              location: new FormControl(address.location, Validators.required),
              user_type_id: [address.user_type_id ?? '', [Validators.required]],
              id: new FormControl(address.id, Validators.required),
            }),
          );
        });

        this.settingsForm = fb.group({
          firstStep: fb.group({
            name: [sv.user?.name ?? '', [Validators.required]],
            email: [sv.user?.email ?? '', [Validators.required, Validators.email]],
            phone_number: [sv.user?.phone_number ?? null],
            user_code: [sv.user?.user_code ?? null],
            fiscal_code: [sv.user?.fiscal_code ?? null],
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
            addresses: this._addressFormArray,
          }),
        });
      } catch (e) {
        console.error(e);
      }
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
            this.logout();
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
    const ctrl = this.settingsForm.controls[this.currentStep$.value];

    return !ctrl.valid;
  }

  logout(): void {
    this._store.dispatch(logout());
    this._navCtrl.navigateForward('home');
  }

  ngOnDestroy(): void {
    this._settingsFormSub.unsubscribe();
    this._alertSub.unsubscribe();
  }

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: false}));
  }
  openModalLocation() {
    this.confiniZone$
      .pipe(
        filter(f => f != null && f.length > 0),
        take(1),
        switchMap(features => {
          return this._modalCtrl.create({
            component: LocationModalComponent,
            componentProps: {
              features,
            },
            cssClass: 'pap-location-modal',
          });
        }),
        switchMap(m => {
          m.present();
          return m.onDidDismiss();
        }),
        map(res => res.data),
        switchMap(address => this._settingsSvc.createAddress(address)),
        map(res => {
          if (res.success) {
            return res.data.address;
          } else {
            return null;
          }
        }),
        map(address => {
          if (address == null) {
            return this._alertCtrl.create({
              header: 'Salvataggio fallito',
              message: 'riprova in un secondo momento',
              buttons: ['ok'],
            });
          } else {
            const modalForm = this._formBuilder.group({
              address: '',
              location: [],
              zone_id: '',
            });
            modalForm.setValue({
              address: address.address,
              location: address.location,
              zone_id: address,
            });

            this._addressFormArray.push(modalForm);
            this._cdr.detectChanges();
            return this._alertCtrl.create({
              header: 'Salvataggio avvenuto con successo',
              message: 'il nuovo indirizzo è stato correttamente salvato',
              buttons: ['ok'],
            });
          }
        }),
      )
      .subscribe(async alert => {
        (await alert).present();
        this._store.dispatch(loadCalendarSettings());
      });
  }
  update() {
    let updates: {[key: string]: any} | null = {};
    const firstStep = this.settingsForm.get('firstStep');
    switch (this.currentStep$.value) {
      case 'firstStep':
        if (firstStep != null) {
          const formControlNames = Object.keys((firstStep as any).controls as string[]);
          Object.values((firstStep as any).controls as any[]).forEach((fcontrol, idx) => {
            if (fcontrol?.dirty) {
              (updates as any)[formControlNames[idx]] = fcontrol.value!;
            }
          });
        }
        break;
      case 'secondStep':
        updates = this.settingsForm.controls['secondStep'].value;
        this.settingsForm.controls['secondStep'].reset();
        break;
      case 'thirdStep':
        updates = this.settingsForm.controls['thirdStep'].value;
        updates!['addresses'] = this.settingsForm.controls['thirdStep'].value['addresses'];
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
