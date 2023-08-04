import {confiniZone} from './../../map/state/map.selectors';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FormArray, FormBuilder, UntypedFormGroup} from '@angular/forms';
import {FormProvider} from '../form-provider';
import {AlertController, IonModal, ModalController} from '@ionic/angular';
import {LocationModalComponent} from '../location/location.modal';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {Observable, from} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../core/core.state';
import {loadConfiniZone} from '../../map/state/map.actions';
import {currentZone} from '../../map/state/map.selectors';
import {SettingsService} from '../../../features/settings/state/settings.service';
@Component({
  selector: 'pap-first-step-signup-form',
  templateUrl: './first-step.component.html',
  styleUrls: ['./first-step.component.scss'],

  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class firstStepSignupComponent {
  get addresses() {
    return this.firstStep.get('addresses') as FormArray;
  }

  @Input() buttons = true;
  @Input() disable: string[] = [];
  @Output() next: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(IonModal) modal!: IonModal;

  confiniZone$: Observable<any> = this._store.select(confiniZone);
  firstStep: UntypedFormGroup = this._formProvider.getForm().get('firstStep') as UntypedFormGroup;

  constructor(
    private _formProvider: FormProvider,
    private _modalCtrl: ModalController,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _store: Store<AppState>,
    private _settingsSvc: SettingsService,
    private _alertCtrl: AlertController,
  ) {
    this._store.dispatch(loadConfiniZone());
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
            this.addresses.push(modalForm);
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
      });
  }

  deleteAddress(index: number): void {
    const currentAddressValue = this.addresses.value[index];
    if (currentAddressValue.id != null) {
      this._settingsSvc
        .deleteAddress(currentAddressValue.id)
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
                header: 'Cancellazione fallita',
                message: 'riprova in un secondo momento',
                buttons: ['ok'],
              });
            } else {
              this.addresses.removeAt(index);
              this._cdr.detectChanges();
              return this._alertCtrl.create({
                header: 'Cancellazione avvenuta con successo',
                message: "L'indirizzo è stato correttamente cancellato",
                buttons: ['ok'],
              });
            }
          }),
        )
        .subscribe(async alert => {
          (await alert).present();
        });
    }
  }

  setLocation(event: any): void {
    console.log(event);
  }
}
