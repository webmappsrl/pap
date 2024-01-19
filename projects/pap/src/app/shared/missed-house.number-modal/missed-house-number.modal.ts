import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Address} from '../../core/auth/auth.model';
import {SettingsService} from '../../features/settings/state/settings.service';
import {map, take} from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'pap-missed-house-number-modal',
  templateUrl: 'missed-house-number.modal.html',
  styleUrls: ['./missed-house-number.modal.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MissedHouseNumberModal {
  missedHouseNumberAddresses: Address[] = [];
  @Input() set addresses(addr: Address[]) {
    this.addressesForm = this._fb.group({
      addresses: this._fb.array(addr.map(address => this.createAddressGroup(address))),
    });
  }
  addressesForm: FormGroup;
  constructor(
    private _modalCtrl: ModalController,
    private _settingSvc: SettingsService,
    private _fb: FormBuilder,
  ) {}

  cancel(): void {
    this._modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    const formAddresses = this.addressesForm.getRawValue().addresses;
    const updateAddresses = formAddresses.map((address: any) =>
      this._settingSvc.updateAddress(address),
    );
    forkJoin(updateAddresses)
      .pipe(take(1))
      .subscribe(res => {
        this._modalCtrl.dismiss(res, 'ok');
      });
  }

  createAddressGroup(address: Address): FormGroup {
    return this._fb.group({
      address: [{value: address.address, disabled: true}],
      house_number: [address.house_number],
      id: [{value: address.id, disabled: true}],
    });
  }
  get addressesArray() {
    return this.addressesForm.get('addresses') as FormArray;
  }
}
