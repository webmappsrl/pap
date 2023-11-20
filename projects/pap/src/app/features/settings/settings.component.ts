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
import {ActivatedRoute} from '@angular/router';
import {AlertController, AlertOptions, ModalController, NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {UpdateUser, deleteUser, logout} from '../../core/auth/state/auth.actions';
import {error, noAddress} from '../../core/auth/state/auth.selectors';
import {AppState} from '../../core/core.state';
import {FormProvider} from '../../shared/form/form-provider';
import {LocationModalComponent} from '../../shared/form/location/location.modal';
import {showButtons} from '../../shared/header/state/header.actions';
import {confiniZone} from '../../shared/map/state/map.selectors';
import {ConfirmedValidator} from '../sign-up/sign-up.component';
import {loadCalendarSettings, toggleEdit} from './state/settings.actions';
import {settingView} from './state/settings.selectors';
import {SettingsService} from './state/settings.service';
import {Zone} from '../../shared/form/location/location.model';
import {User} from '../../core/auth/auth.model';

const DELETE: AlertOptions = {
  cssClass: 'pap-alert',

  header: 'Vuoi eliminare il tuo account?',
  message: 'questa operazione è irreversibile una volta eseguita',
  buttons: [
    {
      text: 'ok',
      role: 'delete-ok',
      cssClass: 'pap-alert-btn-ok',
    },
    {
      text: 'annulla',
      role: 'annulla',
    },
  ],
};
const LOGOUT: AlertOptions = {
  cssClass: 'pap-alert',
  header: 'Sei sicuro di voler effettuare il logout?',
  message: '',
  buttons: [
    {
      text: 'ok',
      role: 'logout-ok',
      cssClass: 'pap-alert-btn-ok',
    },
    {
      text: 'annulla',
      role: 'annulla',
      cssClass: 'pap-alert-btn-cancel',
    },
  ],
};
const LOGOUT_CONFIRM: AlertOptions = {
  cssClass: 'pap-alert',

  header: 'Logout effettuato con successo',
  message: '',
  buttons: [
    {
      text: 'ok',
      role: 'ok',
      cssClass: 'pap-alert-btn-ok',
    },
  ],
};
@Component({
  selector: 'pap-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{provide: FormProvider, useExisting: SettingsComponent}],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private _addressFormArray: UntypedFormArray = this._formBuilder.array([]);
  private _alertEVT: EventEmitter<AlertOptions> = new EventEmitter<AlertOptions>();
  private _alertSub: Subscription = Subscription.EMPTY;
  private _noAddress$: Observable<boolean> = this._store.select(noAddress);
  private _settingsFormSub: Subscription = Subscription.EMPTY;

  confiniZone$: Observable<Zone[]> = this._store.select(confiniZone);
  currentStep$: BehaviorSubject<string> = new BehaviorSubject<string>('firstStep');
  error$: Observable<string | false | undefined> = this._store.select(error);
  initStep = 'firstStep';
  settingsForm: UntypedFormGroup;
  settingsView$ = this._store.pipe(select(settingView));

  constructor(
    private _alertCtrl: AlertController,
    private _store: Store<AppState>,
    private _navCtrl: NavController,
    private _modalCtrl: ModalController,
    private _formBuilder: FormBuilder,
    private _settingsSvc: SettingsService,
    private _cdr: ChangeDetectorRef,
    private _route: ActivatedRoute,
    fb: UntypedFormBuilder,
  ) {
    const urlSegments = this._route.snapshot.url.map(segment => segment.path);
    if (urlSegments.includes('address')) {
      this.initStep = 'thirdStep';
      this.currentStep$.next('thirdStep');
    }
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
        switchMap(opt => this._alertCtrl.create(opt)),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
      )
      .subscribe(val => {
        if (val != null && val.role != null && val.role === 'delete-ok') {
          this._store.dispatch(deleteUser());
          setTimeout(() => {
            this.logout();
          }, 300);
        }
        if (val != null && val.role != null && val.role === 'logout-ok') {
          this._store.dispatch(logout());
          this._alertEVT.emit(LOGOUT_CONFIRM);
          this._navCtrl.navigateForward('home');
        }
      });
  }

  delete(): void {
    this._alertEVT.emit(DELETE);
  }

  edit(value: boolean) {
    this._store.dispatch(toggleEdit());
  }

  getForm() {
    return this.settingsForm;
  }

  isDisabled(): boolean {
    const ctrl = this.settingsForm.controls[this.currentStep$.value];

    return !ctrl.valid || !ctrl.dirty;
  }

  logout(): void {
    this._alertEVT.emit(LOGOUT);
  }

  ngOnDestroy(): void {
    this._settingsFormSub.unsubscribe();
    this._alertSub.unsubscribe();
  }

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: false}));
    this._noAddress$
      .pipe(
        filter(noAddress => noAddress),
        take(1),
      )
      .subscribe(_ => this.openModalLocation());
  }

  openModalLocation(): void {
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
              cssClass: 'pap-alert',
              header: 'Salvataggio fallito',
              message: 'riprova in un secondo momento',
              buttons: [
                {
                  text: 'ok',
                  cssClass: 'pap-alert-btn-ok',
                },
              ],
            });
          } else {
            const modalForm = this._formBuilder.group({
              address: '',
              location: undefined,
              zone_id: undefined,
            });
            modalForm.setValue({
              address: address.address,
              location: address.location,
              zone_id: address.zone_id,
            });

            this._addressFormArray.push(modalForm);
            this._cdr.detectChanges();
            return this._alertCtrl.create({
              cssClass: 'pap-alert',
              header: 'Salvataggio avvenuto con successo',
              message: 'il nuovo indirizzo è stato correttamente salvato',
              buttons: [
                {
                  text: 'ok',
                  role: 'ok',
                },
              ],
            });
          }
        }),
      )
      .subscribe(async alert => {
        (await alert).present();
        this._store.dispatch(loadCalendarSettings());
      });
  }

  update(): void {
    let updates: Partial<User> | null = {};
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
