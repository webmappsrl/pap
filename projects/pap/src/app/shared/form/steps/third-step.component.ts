import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FormArray, FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {AlertController, IonModal} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {loadAuths} from '../../../core/auth/state/auth.actions';
import {AppState} from '../../../core/core.state';
import {loadCalendarSettings} from '../../../features/settings/state/settings.actions';
import {calendarSettings} from '../../../features/settings/state/settings.selectors';
import {SettingsService} from '../../../features/settings/state/settings.service';
import {loadConfiniZone} from '../../map/state/map.actions';
import {confiniZone} from '../../map/state/map.selectors';
import {Address} from '../../../core/auth/auth.model';

@Component({
  selector: 'pap-third-step-form',
  templateUrl: './third-step.component.html',
  styleUrls: ['./third-step.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class thirdStepComponent implements OnInit {
  get addresses() {
    return this.thirdStep.get('addresses') as FormArray;
  }

  @Input() buttons = true;
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @Output() prev: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(IonModal) modal!: IonModal;

  calendarSettings$: Observable<any> = this._store.select(calendarSettings);
  confiniZone$: Observable<any> = this._store.select(confiniZone);
  thirdStep: UntypedFormGroup;

  constructor(
    private _store: Store<AppState>,
    private _settingSvc: SettingsService,
    private _cdr: ChangeDetectorRef,
    private _settingsSvc: SettingsService,
    private _alertCtrl: AlertController,
    private _parent: FormGroupDirective,
    private alertController: AlertController,
  ) {
    this._store.dispatch(loadCalendarSettings());
    this._store.dispatch(loadConfiniZone());
  }

  deleteAddress(address: Address): void {
    if (address.id != null) {
      this._settingsSvc
        .deleteAddress(address.id)
        .pipe(
          take(1),
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
                header: 'Cancellazione fallita',
                message: 'riprova in un secondo momento',
                buttons: [
                  {
                    text: 'ok',
                    cssClass: 'pap-alert-btn-ok',
                  },
                ],
              });
            } else {
              this._cdr.detectChanges();
              return this._alertCtrl.create({
                cssClass: 'pap-alert',
                header: 'Cancellazione avvenuta con successo',
                message: "L'indirizzo è stato correttamente cancellato",
                buttons: [
                  {
                    text: 'ok',
                    cssClass: 'pap-alert-btn-ok',
                  },
                ],
              });
            }
          }),
        )
        .subscribe(async alert => {
          (await alert).present();
          this._store.dispatch(loadAuths());
          this._store.dispatch(loadCalendarSettings());
        });
    }
  }

  ngOnInit(): void {
    this.thirdStep = this._parent.form.get('thirdStep') as UntypedFormGroup;
  }

  async presentAlert(address: Address) {
    const alert = await this.alertController.create({
      cssClass: 'pap-status-alert',
      header: 'Conferma eliminazione',
      message: 'Sei sicuro di voler eliminare questo indirizzo?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            this.deleteAddress(address);
          },
        },
      ],
    });

    await alert.present();
  }

  reset(): void {
    this.thirdStep.controls['user_type_id'].reset();
  }

  selectUserType(address: Address, userTypeEVT: any): void {
    console.log(address, userTypeEVT);
    const newAddress = {...address, ...{user_type_id: userTypeEVT.detail.value}};
    this._settingSvc
      .updateAddress({...address, ...{user_type_id: userTypeEVT.detail.value}})
      .pipe(
        take(1),
        map(res => {
          if (res.success) {
            return res.data.address;
          } else {
            return null;
          }
        }),
      )
      .subscribe(v => {
        console.log(v);
      });
  }
}
